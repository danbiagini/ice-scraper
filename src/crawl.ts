import minimist from 'minimist';
import { SiteCrawler } from './SiteCrawler';
import { urlToFileName } from './loader';
import fs = require('fs');

async function main() {
    const argv = minimist(process.argv.slice(1));

    if (argv['url'] === undefined) {
        console.log("No --url <url> specified");
        process.exit(0);
    }
    const startUrl = argv['url'];
    cachMaxAge = argv['max_age'] ? (argv['max_age']) : (60 * 60 * 24 * 7);
    const maxDepth = argv['max_depth'] ? argv['max_depth'] : 10;
    const thirdPartiesEnabled = argv['crawl_third_parties'] ? argv['crawl_third_parties'] : false;

    const outFile = argv['out_file'] ? argv['out'] : `./output/${urlToFileName(startUrl)}-m${maxDepth}-${Date.now().toString()}.json`
    const c = new SiteCrawler(startUrl,
                              undefined, 
                              undefined,
                              10, 
                              cachMaxAge, 
                              maxDepth);
    await c.crawl(thirdPartiesEnabled);
    const out: string = JSON.stringify(c);
    console.log(out);
    try {
        fs.writeFileSync(outFile, out);
    } catch (error) {
        console.log("Error %s writing %d byes to %s", error, out.length, outFile);
    }

}

let DEBUG = false;
let cachMaxAge;

main();
