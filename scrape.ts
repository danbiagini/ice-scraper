import axios, { AxiosRequestConfig } from 'axios';
import cheerio from 'cheerio';
import { last } from 'cheerio/lib/api/traversing';
import fs = require('fs');
import minimist from 'minimist';

interface Team {
    name: string;
    city: string;
    state: string;
    web: string;
    league: string;
    rinks: string;
}

export async function loadPage(url: string, max_age: number = (60 * 60 * 24 * 7), ua?: string) {
    const urlAsFileName = url.match(/https?\:\/\/([\w\.]+)(\/?[\w\/\.\?=]*)/);
    if (!urlAsFileName) {
        throw "Invalid URL for pattern";
    }

    const deSlashedPath = urlAsFileName[2].replace("/", "_");
    const fileName = 'page_cache/' + urlAsFileName[1] + deSlashedPath;
    const fStat = fs.statSync(fileName, { bigint: false, throwIfNoEntry: false });

    if (fStat && (fStat.mtimeMs + (max_age * 1000)) > Date.now()) {
        const buf = fs.readFileSync(fileName);
        console.log("pulling content from cache: %s", fileName)
        return (buf.toString());
    }

    const config: AxiosRequestConfig = {}
    if (ua) {
        config.headers = { 'User-Agent': ua }
    }

    const response = await axios.get(url, config);
    if (response.status != 200) {
        console.log("response code not 200... ", response.status);
    }
    fs.writeFileSync(fileName, response.data);
    console.log("retrieved and cached %d bytes from %s to %s ", response.data.length, url, fileName);

    return (response.data);
}

interface Association {
    name: string;
    city: string;
    state: string;
    league: string;
    assoc_web?: string;
    league_web?: string;
    rinks?: string;
};

export class AssociationScraper {
    rootDomain: string;
    userAgent: string;
    scrapedTeams: Association[];

    constructor(root: string, ua?: string) {
        this.rootDomain = root;
        this.userAgent = ua ? ua : edgeUa;
        this.scrapedTeams = [];

        console.log("New assoc scraper on ", this.rootDomain);
    }

    scrapAssociation(html: string, assoc: Association) {
        console.log("parsing %d bytes for association %s, %s", html.length, assoc.name, assoc.assoc_web);
        const $ = cheerio.load(html);

        assoc.assoc_web = new URL($('td#assoc-web a:first').attr('href')!).toString();
        assoc.rinks = $('tr:contains("Rinks") td').text().trim()!;
    }

    scrapeAssocList(html: string, max?: number): void {
        console.log("parsing %d bytes for association list", html.length);
        const $ = cheerio.load(html);

        $('#mhr-ad-row').remove();
        $('#in-context-ad').remove();
        let count = 0;
        const rows = $('table.linked_table > tbody > tr');

        $('table.linked_table > tbody > tr').each((i, e) => {
            if (max && count >= max) {
                return false;
            }
            let log_it = false;
            if (count == 0) log_it = true;
            count ++;

            const cols = $(e).find('td');
            const name = $(cols[0]).text();
            const assocHref = $(cols[0]).find('a').eq(0).attr('href');

            const city = $(cols[1]).text();
            const state = $(cols[2]).text();
            const league = $(cols[3]).text().trim();

            let team = { name, city, state, league };

            if (!assocHref) {
                this.scrapedTeams.push(team);
                return true;
            }

            const assocHtml = loadPage(this.rootDomain + '/' + assocHref).then((html) => {
                if (DEBUG && log_it) {
                    console.log(html);
                }
                this.scrapAssociation(html, team);
                if (log_it) {
                    console.log(team);
                }
                this.scrapedTeams.push(team);
            }, (err) => {
                console.log("Error loading assocation %s, %s", assocHref.toString(), err);
                this.scrapedTeams.push(team);
            });
        })
    }
}

async function main() {
    const argv = minimist(process.argv.slice(1));

    const startUrl = argv['url'] ? (argv['url']) : "https://www.google.com";
    cachMaxAge = argv['max_age'] ? (argv['max_age']) : (60 * 60 * 24 * 7);

    const root: string = await loadPage(startUrl, cachMaxAge, edgeUa);

    const fqdn = startUrl.match(/(https?\:\/\/[\w\.]+)\/?[\w\/]*/);
    const scraper = new AssociationScraper(fqdn[1]);
    const teams = scraper.scrapeAssocList(root, argv['count']);
    console.log(scraper.scrapedTeams.length);
}
let DEBUG = false;
let cachMaxAge;
const edgeUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"

main();
