import cheerio from 'cheerio';
import { loadPage } from './loader';
import { PluginManager } from './PluginManager';

export type Page = {
    href: string,
    title?: string,
    origin: string,
    links: URL[],
    status?: number,
    crawl_time?: number
};

let MAX_CRAWL_TIME = (60 * 30 * 1000); // 30 mins seems like more than enough

export class SiteCrawler {
    rootPage: string;
    userAgent?: string;
    pageFilter?: string;
    avgDelaySecs?: number;
    visited!: Map<string, Page>;
    pages: Page[];
    cacheExpiry: number = (60 * 60 * 24 * 7);
    maxDepth: number = 10;
    crawlStartTime?: number;
    crawlFinishTime?: number;
    maxTime: number = MAX_CRAWL_TIME;
    aborted: boolean = false;
    rootLinkCount: number = 0;
    rootLinkIndex: number = 0;
    // scrapePlugin: Function = (p: Page, html: string) => {return};
    plugins: PluginManager;

    constructor(rootPage: string, 
                plugins: PluginManager,
                ua?: string, 
                filter?: string, 
                delay?: number, 
                cache?: number,
                max_depth?: number,
                max_time?: number) {
        const rootUrl = new URL(rootPage);
        this.rootPage = rootUrl.href;
        this.visited = new Map<string, Page>();
        this.userAgent = ua;
        this.pages = [];

        if (filter) this.pageFilter = filter;
        if (delay) this.avgDelaySecs = delay;
        if (cache !== undefined) this.cacheExpiry = cache;
        if (max_depth !== undefined) this.maxDepth = max_depth;
        if (max_time !== undefined) this.maxTime = max_time;

        this.plugins = plugins;
    }

    scrapePage(page: URL, html: string): Page {
        const $ = cheerio.load(html);

        let links: URL[] = [];
        let p: Page = {
            href: page.href,
            origin: page.origin,
            links: links,
            crawl_time: Date.now(),
        };

        const anchors = $('a');
        p.title = $('title').text();

        for (let a of anchors) {
            const href: string = $(a).attr("href") || "";

            try {
                p.links.push(new URL(href, page.origin));
            } catch (e) {
                console.log("Error % parsing links on %", e, page.href);
            }

        }

        this.plugins.scrape(p, html);

        return p;
    }

    async crawl(origin_filter?: (arg0: URL) => boolean,
                page: string = this.rootPage, 
                max_depth: number = this.maxDepth) {

        console.log("crawling %s, max_depth %d, root link %d/%d ", page, max_depth, this.rootLinkIndex, this.rootLinkCount);

        if (this.crawlStartTime === undefined) {
            this.crawlStartTime = Date.now();
        } else if ((Date.now() - this.crawlStartTime) > this.maxTime) {
            this.aborted = true;
            console.log("aborting crawl on %s due to exceeding %d seconds", page, (this.maxTime / 1000));
            return;
        }
        let delay = 0;
        if (this.avgDelaySecs) {
            delay = (this.avgDelaySecs * 2 * Math.random());
        }

        const url = new URL(page);
        const html = await loadPage(url.href, this.cacheExpiry, this.userAgent, delay);
    
        const hrefs: Page = this.scrapePage(url, html);

        this.visited.set(page, hrefs);

        let isRoot = false;
        if (page == this.rootPage) {
            this.rootLinkCount = hrefs.links.length;
            isRoot = true;
        }

        if (max_depth == 0) {
            console.log("reached max depth, not traversing new links on %s", page)
        } else {
            for (let i = 0; i < hrefs.links.length; i++) {
                if (isRoot) {
                    this.rootLinkIndex = i;
                }
                const link = hrefs.links[i];
                if (!this.visited.has(link.href)) {
                    if (link.origin != url.origin) {
                        if (origin_filter === undefined || !origin_filter(link)) {
                            console.log("not crawling external link %s", link.href);
                            continue;
                        }
                    }
                    await this.crawl(origin_filter, link.href, max_depth - 1);
                } else {
                    console.log("already crawled %s", link.href);
                }
            }
        }
        if (isRoot) {
            this.crawlFinishTime = Date.now();
        }
        console.log("finished crawling %s, found %d links", page, hrefs.links.length);
    }

    pageCount(): number {
        return (this.visited.size || 0)
    }

    getLinks(page: string = this.rootPage): URL[] {
        let p = this.visited.get(page);
        if (p) {
            return p.links;
        } 
        return [];
    }

    // https://javascript.info/json
    toJSON() {
        let o: Object = {
            root: this.rootPage,
            filter: this.pageFilter,
            crawl_start: new Date(this.crawlStartTime!) || undefined,
            crawl_finish: (this.crawlFinishTime) ? new Date(this.crawlFinishTime!) : undefined,
            page_count: this.visited.size,
            pages: [Object.fromEntries(this.visited)],
            status: (this.aborted) ? "ABORTED" : (this.crawlFinishTime) ? "COMPLETE" : undefined,
            plugins: [Object.fromEntries(this.plugins.serialize())]
        };
        return o;
    }
}