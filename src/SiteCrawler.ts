import cheerio from 'cheerio';
import { loadPage } from './loader';

export class SiteCrawler {
    rootPage: string;
    userAgent?: string;
    pageFilter?: string;
    avgDelaySecs?: number;
    visited: Map<URL, URL[]>;
    cacheExpiry: number = (60 * 60 * 24 * 7);

    constructor(rootPage: string, find: string, ua?: string, filter?: string, delay?: number) {
        this.rootPage = rootPage;
        this.visited = new Map<URL, URL[]>;

        if (filter) this.pageFilter = filter;
        if (delay) this.avgDelaySecs = delay;
    }

    scrapeLinks(page: URL, html: string, max: number = 0): URL[] {
        const $ = cheerio.load(html);

        let count = 0;
        let links: URL[] = [];
        const anchors = $('a');
        
        for (let a of anchors) {
            if (max && count >= max) {
                break;
            }

            const href: string = $(a).attr("href") || "";

            try {
                links.push(new URL(href, page.origin));
            } catch (e) {
                console.log("Error % parsing %", e, page.href);
            }

        }
        return links;
    }

    async crawl(page: string = this.rootPage) {
        let delay = 0;
        if (this.avgDelaySecs) {
            delay = (this.avgDelaySecs * 2 * Math.random());
        }

        const html = await loadPage(page, this.cacheExpiry, this.userAgent, delay);
        console.log("parsing %d bytes for  list", html.length);

        this.scrapeLinks(page, html);

    }
}