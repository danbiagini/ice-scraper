import minimist from 'minimist';
import { SiteCrawler } from './SiteCrawler';
import { PluginManager, ScrapePlugin } from './PluginManager';
import { urlToFileName } from './loader';
import fs = require('fs');
import { writeFile } from 'node:fs/promises';


let DEBUG = false;
let cachMaxAge = (60 * 60 * 24 * 7);
let avgDelay = 5;
const initTime = new Date();
let outDir = `output/${initTime.getFullYear()}_${initTime.getMonth()+1}_${initTime.getDate()}`;
let statsFile = `${outDir}/${initTime.getTime()}_crawl_stats.json`;

let runStats = {
    time: new Date(),
    completed: 0,
    total: 0,
    currentRunning: 0,
    url: undefined,
    url_file: undefined,
};

function updateStats(s:any) {
    const stats = {...runStats, ...s};
    writeFile(statsFile, JSON.stringify(stats));
}

async function crawlUrl(url: string, maxDepth: number, next: Function, plugs: PluginManager) {
    const c = new SiteCrawler(url, plugs, undefined, undefined, avgDelay, cachMaxAge, maxDepth, undefined);

    c.crawl(undefined, url, maxDepth).then(async () => {
        try {
            const outFile = `./${outDir}/${urlToFileName(url)}-m${maxDepth}-${Date.now().toString()}.json`;
            await writeFile(outFile, JSON.stringify(c));
        } catch (w_error) {
            console.error("error %s writing site info for %s", w_error, url);
        }
    }, (error) => {
        console.error("error crawling %s", url);
    }).finally(() => next());
}

// inspired by https://book.mixu.net/node/ch7.html
async function runner (urls: string[], maxDepth: number, limit: number, plugs: string) {

    const plugManager = new PluginManager();   

    let running = 1; // this smells, but its decremented in nextCrawl so have to initialize to 1
    let task = 0;

    const nextCrawl = async () => {
        running --;
        if (task == urls.length && running == 0) {
            console.log("DONE! finished crawling %d sites", task);
        }

        while (running < limit && urls[task]) {
            const url = urls[task];
            task ++;
            running ++;
            console.log("runner sending %s to crawler", url);
            await plugManager.loadFile(plugs, url);
            crawlUrl(url, maxDepth, nextCrawl, plugManager);
        }
        updateStats({
            time: new Date(),
            completed: task - running,
            total: urls.length,
            currentRunning: running
        });
    }
    nextCrawl();
}

// example usage : npx ts-node src/crawl.ts --url "http://localhost:3000" --max_depth 4
async function main() {
    const argv = minimist(process.argv.slice(1));

    if ((argv['url'] === undefined) && (argv['url_file'] === undefined)) {
        console.log("No --url <url> or --url_file <file> specified");
        process.exit(0);
    }
    let urls = [];
    let thirdPartiesEnabled = (_u:URL): boolean => {return false};
    if (argv['url']) {
        urls.push(argv['url']);
        thirdPartiesEnabled = (link: URL): boolean => {
            if (argv['crawl_third_parties']) {
                let tp: string = argv['crawl_third_parties'];
                if (tp.split(",").indexOf(link.origin) >= 0) {
                    return true;
                }
            } 
            return false;
        }
        runStats.url = argv['url'];
    } else {
        const data = fs.readFileSync(argv['url_file']);

        data.toString().split(/\r?\n/).forEach(line => {
            if (line.length > 0) {
                if (line.charAt(0) === '"' && line.charAt(line.length - 1) === '"') {
                    line = line.substring(1, line.length - 1);
                }
                try {
                    let u = new URL(line);
                    urls.push(line);
                } catch (error) {
                    console.error("'%s' is not a valid URL", line);
                }
            }
        });
        runStats.url_file = argv['url_file'];
    }
    const maxDepth = (argv['max_depth'] !== undefined) ? argv['max_depth'] : 10;

    if (argv['max_age'] !== undefined) {
        cachMaxAge = argv['max_age'];
    }

    const limit = argv['threads'] ? argv['threads'] : 10;
    const plugin = argv['plugin_file'];
 
    if (!fs.existsSync(outDir)){
        fs.mkdirSync(outDir, {recursive: true});
    }
    runner(urls, maxDepth, limit, plugin);
}


main();
