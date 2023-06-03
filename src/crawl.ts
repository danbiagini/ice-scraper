import minimist from 'minimist';
import { SiteCrawler } from './SiteCrawler';
import { urlToFileName } from './loader';
import fs = require('fs');
import { writeFile } from 'node:fs/promises';


let DEBUG = false;
let cachMaxAge = (60 * 60 * 24 * 7);
let avgDelay = 5;
let statsFile = "output/crawl_stats.json"

interface Stats {
    time: Date,
    completed: number,
    total: number,
    currentRunning: number
}

function updateStats(stats: Stats) {
    writeFile(statsFile, JSON.stringify(stats));
}

async function crawlUrl(url: string, maxDepth: number, next: Function) {
    const c = new SiteCrawler(url, undefined, undefined, avgDelay, cachMaxAge, maxDepth);

    c.crawl().then(async () => {
        try {
            const outFile = `./output/${urlToFileName(url)}-m${maxDepth}-${Date.now().toString()}.json`;
            await writeFile(outFile, JSON.stringify(c));
        } catch (w_error) {
            console.error("error %s writing site info for %s", w_error, url);
        }
    }, (error) => {
        console.error("error crawling %s", url);
    }).finally(() => next());
}

// inspired by https://book.mixu.net/node/ch7.html
async function runner (urls: string[], maxDepth: number, limit: number) {

    let running = 1; // this smells, but its decremented in nextCrawl so have to initialize to 1
    let task = 0;

    const nextCrawl = () => {
        running --;
        if (task == urls.length && running == 0) {
            console.log("DONE! finished crawling %d sites", task);
        }

        while (running < limit && urls[task]) {
            const url = urls[task];
            console.log("runner sending %s to crawler", url);
            crawlUrl(url, maxDepth, nextCrawl);
            running ++;
            task ++;
        }
        updateStats({
            time: new Date(),
            completed: task,
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
    let thirdPartiesEnabled = (link:URL): boolean => {return false};
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
    } else {
        const data = fs.readFileSync(argv['url_file']);
        // should be ok for modest size files, but not the most memory efficient approach
        // fs.readFile(argv['url_file'], (error, data) => {
        //     if (error) {
        //         console.error("Error reading url_file %s, %s", argv['url_file'], error);
        //         return;
        //     }
        data.toString().split(/\r?\n/).forEach(line => {
            if (line.length > 0) {
                try {
                    let u = new URL(line);
                    urls.push(line);
                } catch (error) {
                    console.error("'%s' is not a valid URL", line);
                }
            }
        });
    }
    cachMaxAge = argv['max_age'] ? (argv['max_age']) : (60 * 60 * 24 * 7);
    const maxDepth = argv['max_depth'] ? argv['max_depth'] : 10;
    const limit = argv['threads'] ? argv['threads'] : 10;
    runner(urls, maxDepth, limit);
}

main();
