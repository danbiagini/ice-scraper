import cheerio from 'cheerio';
import { loadPage } from './loader';
import fs = require('fs');

let DEBUG = false;

export interface Association {
    name: string;
    city: string;
    state: string;
    league: string;
    assoc_web?: string;
    league_web?: string;
    rinks?: string;
};

export interface AssociationFilter {
    city?: string;
    state?: string;
    league?: string;
};

export class AssociationScraper {
    rootDomain: string;
    userAgent?: string;
    scrapedTeams: Association[];
    cacheExpiry: number;
    filter?: AssociationFilter;

    constructor(root: string, ua?: string, cacheExp?: number, filter?: AssociationFilter) {
        this.rootDomain = root;
        this.userAgent = ua;
        this.scrapedTeams = [];
        if (cacheExp === undefined) {
            this.cacheExpiry = (60 * 60 * 24 * 7);
        } else {
            this.cacheExpiry = cacheExp;
        }

        if (filter) this.filter = filter;

        console.log("New assoc scraper on ", this.rootDomain);
    }

    save() {
        const host = new URL(this.rootDomain).hostname;
        const now = Date.now().toString();
        const fileName = `output/${host}-${now}.json`;
        fs.writeFileSync(fileName, JSON.stringify(this.scrapedTeams));
    }

    scrapeAssociation(html: string, assoc: Association) {
        console.log("parsing %d bytes for association %s", html.length, assoc.name);
        const $ = cheerio.load(html);

        try {
            assoc.assoc_web = new URL($('td#assoc-web a:first').attr('href')!).toString();
        } catch (error) {
            console.log(`no web found for ${assoc.name}`);
        }
        let rinks = $('tr:contains("Rinks") td').text().trim();
        if (rinks.length) {
            assoc.rinks = rinks.replace(/\s\s+/g, ' ');
        }
    }

    async scrapeAssocList(html: string, max?: number) {
        console.log("parsing %d bytes for association list", html.length);
        const $ = cheerio.load(html);

        $('.mhr-ad-row').remove();
        $('.in-context-ad').remove();
        let count = 0;
        const rows = $('table.linked_table > tbody > tr');
        
        for (let r of rows) {
            if (max && count >= max) {
                break;
            }
            let log_it = false;
            if (count == 0) log_it = true;

            const cols = $(r).find('td');
            const name = $(cols[0]).text();
            const assocHref = $(cols[0]).find('a').eq(0).attr('href');

            const city = $(cols[1]).text();
            const state = $(cols[2]).text();
            const league = $(cols[3]).text().trim();

            let team = { name, city, state, league };

            if (this.filter) {
                if ((this.filter.city && !city.includes(this.filter.city)) ||
                    (this.filter.state && !state.includes(this.filter.state)) ||
                    (this.filter.league && !league.includes(this.filter.league))) {
                        console.log(`Assoc ${name} doesn't match filter ${this.filter}`);
                        continue;
                    }
            }
            count++;

            if (!assocHref) {
                this.scrapedTeams.push(team);
                continue;
            }

            const assocHtml = await loadPage(this.rootDomain + '/' + assocHref, this.cacheExpiry, this.userAgent);

            if (!assocHtml) {
                console.log("Error loading assocation %s, %s", assocHref.toString());
                this.scrapedTeams.push(team);
                continue;
            }

            if (DEBUG && log_it) {
                console.log(assocHtml);
            }
            this.scrapeAssociation(assocHtml, team);
            if (log_it) {
                console.log(team);
            }
            this.scrapedTeams.push(team);
        }
    }
}

