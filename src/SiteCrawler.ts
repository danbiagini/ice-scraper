import cheerio from 'cheerio';
import { loadPage } from './loader';

export class SiteCrawler {
    rootPage: string;
    userAgent?: string;
    pageFilter?: string;
    avgDelaySecs?: number;
    visited!: Map<string, URL[]>;
    cacheExpiry: number = (60 * 60 * 24 * 7);

    constructor(rootPage: string, ua?: string, filter?: string, delay?: number, cache?: number) {
        const rootUrl = new URL(rootPage);
        this.rootPage = rootUrl.href;
        this.visited = new Map<string, URL[]>;
        this.userAgent = ua;

        if (filter) this.pageFilter = filter;
        if (delay) this.avgDelaySecs = delay;
        if (cache !== undefined) this.cacheExpiry = cache;
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
                console.log("Error % parsing links on %", e, page.href);
            }

        }
        return links;
    }

    async crawl(page: string = this.rootPage) {
        console.log("crawling %s", page);
        let delay = 0;
        if (this.avgDelaySecs) {
            delay = (this.avgDelaySecs * 2 * Math.random());
        }

        const url = new URL(page);
        const html = await loadPage(url.href, this.cacheExpiry, this.userAgent, delay);
        console.log("parsing %d bytes for %s list", html.length, url.href);

        const hrefs = this.scrapeLinks(url, html);
        this.visited.set(url.href, hrefs);

        for (let link of hrefs) {
            if (!this.visited.has(link.href)) {
                await this.crawl(link.href);
            } else {
                console.log("already crawled %s", link.href);
            }
        }
        console.log("finished crawling %s, found %d links", page, hrefs.length);

    }

    pageCount(): number {
        return (this.visited.size || 0)
    }

    getLinks(page: string = this.rootPage): URL[] {
        return (this.visited.get(page) || []);
    }
}