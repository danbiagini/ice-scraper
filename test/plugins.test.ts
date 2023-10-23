import axios from 'axios';
import cheerio from 'cheerio';
import * as snips from "./html-snips"
import { SiteCrawler, Page } from '../src/SiteCrawler';
import {expect, jest, test} from '@jest/globals';
import { PluginManager, ScrapePlugin } from '../src/PluginManager';

// https://www.csrhymes.com/2022/03/09/mocking-axios-with-jest-and-typescript.html
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

class PluginTest extends ScrapePlugin {
    // titles: Map<Page, String>;
    name: string = "Plugin Test Scraper";
    version: string = "0.0.1";
    data: Map<Page, String>;

    constructor() {
        super();
        console.log("New plugin test scraper");
        this.data = new Map<Page, String>();
        // this.titles = new Map<Page, string>();
    }

    async scrape(page: Page, html: string): Promise<void> {
        console.log("parsing %d bytes for plugin test scrape", html.length);
        const $ = cheerio.load(html);
        const t = $("title").first().text();
        this.data.set(page, t);
        console.log("found title %s on page %s", t, page.href);
    }

    init() {
        console.log("init plugin test scraper");
    }

    stop() {
        console.log("stop plugin test scraper");
    }

    serialize() {
        console.log("serialize plugin test scraper with %s titles", this.data.size)
        let temp: any = {};
        this.data.forEach((val, key) => {
            temp[key.href] = val;
        })
        return temp;
    }
}

describe('testing Plugins', () => {
    test('plugin from file', async () => {
        const p = new PluginManager();
        const site_url = 'https://www.google.com';
        await p.loadFile('../src/ArenaScraper.ts', site_url);
    
        const a = new SiteCrawler(site_url, p);
        expect(a).toBeDefined();
        expect(p).toBeInstanceOf(PluginManager);        
        expect(a).toBeInstanceOf(SiteCrawler);
    });

    test('new test plugin', async () => {
        const p = new PluginTest();
        const page: Page = {
            origin: "test.com",
            href: "test.com/its-a-link",
            links: []
        }
        await p.scrape(page, "<html><head><title>It's a title</title></head></html>");
        expect(p.version).toBe("0.0.1")
        expect(p.serialize()).toMatchObject({
            "test.com/its-a-link": "It's a title"
        })
    });

    test('new crawler with a test plugin and 1 layer of anchors in html content', async () => {
        const site_url = 'https://www.google.com';

        const p = new PluginManager();
        await p.load(new PluginTest(), site_url);

        // Provide the data object to be returned
        mockedAxios.get.mockResolvedValue({
          data: snips.html_no_a,
          status: 200,
        })
        .mockResolvedValueOnce({
          data: snips.assoc_info_html,
          status: 200,
        });
        const a = new SiteCrawler("https://www.google.com", p, undefined, undefined, undefined, 0);
        expect(a.pageCount()).toBe(0);
    
        await a.crawl(() => true, undefined, undefined);
        expect(a.pageCount()).toBe(7);
        const links = a.getLinks();
    
        expect(a.getLinks().length).toBe(6);
        expect(a.getLinks()[0].href).toBe("https://www.google.com/contact_request.php?o=a&a=a&n=352&p=1");

        let exp = {
            "root": "https://www.google.com/",
            "plugins": [
                {
                    "Plugin Test Scraper": 
                    {
                        data: {
                            "https://www.google.com/contact_request.php?o=a&a=a&n=352&p=1": "Assoc Info Title No A",
                            "https://www.google.com/": "Assoc Info Title",
                            "https://www.google.com/website_request.php?o=a&n=352": "Assoc Info Title No A",
                            "https://www.google.com/rink_info.php?r=112": "Assoc Info Title No A",
                            "https://www.google.com/league_info.php?l=134": "Assoc Info Title No A",
                            "https://www.hometeamsonline.com/teams/1?u=alaskaallstars&s=hockey": "Assoc Info Title No A"
                        },
                        version: "0.0.1"
                    }
                }
            ]
        }
        expect(a.toJSON()).toMatchObject(exp);
    });
    
});