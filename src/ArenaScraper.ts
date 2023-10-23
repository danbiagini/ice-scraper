import cheerio from 'cheerio';
import { Page } from './SiteCrawler';
import { ScrapePlugin } from './PluginManager';

let DEBUG = true;

export interface Arena {
    tag: string;
    name: string;
    city: string;
    state: string;
    gmap_url: URL;
    address?: string;
    updated_at?: string;
    created_at?: string;
};

export interface ArenaFilter {
    city?: string;
    state?: string;
};

export default class ArenaScraper extends ScrapePlugin {
    name: string = "ArenaScraper";
    version: string = "0.0.1";
    data: Map<string, string>;

    constructor() {
        super();
        this.data = new Map<string, string>();
        console.log("New arena scraper");
    }

    async scrape(page: Page, html: string): Promise<void> {
        if (DEBUG) console.log("parsing %d bytes for arena scrape %s", html.length, page.href);
        const $ = cheerio.load(html);

        const t = $("title").first().text();
        this.data.set("title", t);
        const name = $("h3").first().text();
        this.data.set("Rink Name", name);
        const details = $(".text p").find('br').replaceWith(' ').end().first().text();
        const chomped = details.replace(/(\r\n|\n|\r|\u00a0)/gm, "");
        let address = "none"

        const explicit_address = chomped.match(/Address:(.*\d{5})/);
        if (explicit_address) {
            address = explicit_address[1];
        } else {
            let guess_address = chomped.match(/(\d*.*[A-Z]{2}\s(\d{5})?)/);
            if (guess_address) {
                address = guess_address[1]
            }
        }
        if (address != "none") {
            if (DEBUG) console.log("found address %s for %s", address, chomped);
            this.data.set("address", address);    
        } else {
            console.log("Could not find an address in %s for %s", chomped, name)
            this.data.set("details", chomped);
        }
    }

    init() {

    }

    stop() {

    }

    serialize() {
        let temp: any = {};
        this.data.forEach((val, key) => {
            temp[key] = val;
        })
        return temp;
    }
}
