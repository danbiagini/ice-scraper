import axios from 'axios';
import * as snips from "./html-snips"
import { SiteCrawler } from '../src/SiteCrawler';
import {expect, jest, test} from '@jest/globals';
import { PluginManager } from '../src/PluginManager';

// https://www.csrhymes.com/2022/03/09/mocking-axios-with-jest-and-typescript.html
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const plugs = new PluginManager();

describe('testing SiteCrawler class', () => {
  test('new crawler object should result in instance', () => {
    const a = new SiteCrawler("https://www.google.com", plugs);
    expect(a).toBeInstanceOf(SiteCrawler);
  });

  test('new crawler with 1 layer of anchors in html content', async () => {
    // Provide the data object to be returned
    // mockedAxios.get.mockResolvedValue({
    //   data: snips.assoc_info_html,
    // });
    mockedAxios.get.mockResolvedValue({
      data: snips.html_no_a,
      status: 200,
    })
    .mockResolvedValueOnce({
      data: snips.assoc_info_html,
      status: 200,
    });
    const a = new SiteCrawler("https://www.google.com", plugs, undefined, undefined, undefined, 0);
    expect(a.pageCount()).toBe(0);

    await a.crawl(() => true, undefined, undefined);
    expect(a.pageCount()).toBe(7);
    const links = a.getLinks();

    expect(a.getLinks().length).toBe(6);
    expect(a.getLinks()[0].href).toBe("https://www.google.com/contact_request.php?o=a&a=a&n=352&p=1");
  });
  test('new crawler with 3 layer of anchors in html content', async () => {
    /* mock the first 2 GETs with HTML including anchors,
    *  then no anchors.
    */

    mockedAxios.get.mockResolvedValue({
      data: snips.html_no_a,
      status: 200,
    })
    .mockResolvedValueOnce({
      data: snips.html_root_w_3_anchors,
      status: 200,
    })
    .mockResolvedValueOnce({
      data: snips.html_page_1,
      status: 200
    })
    .mockResolvedValueOnce({
      data: snips.html_no_a,
      status: 200,
    })
    .mockResolvedValueOnce({
      data: snips.html_page_2,
      status: 200
    });
    const a = new SiteCrawler("https://www.google.com", plugs, undefined, undefined, undefined, 0);
    expect(a.pageCount()).toBe(0);

    await a.crawl(() => false);
    expect(a.pageCount()).toBe(5);

    expect(a.getLinks().length).toBe(3); // 3 links on root
    expect(a.getLinks()[0].href).toBe("https://www.google.com/page1"); // first link on root is for page 1
    expect(a.getLinks()[1].href).toBe("https://www.google.com/page2"); // second link on root is for page 2

    expect(a.getLinks("https://www.google.com/page2").length).toBe(2); // 2 links on page 2

    let exp = {
      "rootPage": "https://www.google.com/",
      "crawlStartTime": expect.anything(),
      "crawlFinishTime": expect.anything(),
      "visited": new Map([
        ["https://www.google.com/", {"href": "https://www.google.com/",
        "crawl_time": expect.anything(),
        "origin": "https://www.google.com",
        "links": [
        new URL("https://www.google.com/page1"),
        new URL("https://www.google.com/page2"),
        new URL("https://www.google.com/page3"),
        ],
        "title":""}],
        ["https://www.google.com/page1",{"href": "https://www.google.com/page1",
        "crawl_time": expect.anything(),
        "origin": "https://www.google.com",
        "links": [
          new URL("https://www.google.com/page1-a"),
          new URL("https://www.google.com/page2"),
          new URL("https://www.google.com/page3"),
        ],
        "title":"Page 1"}],
        ["https://www.google.com/page1-a", {"href": "https://www.google.com/page1-a",
        "crawl_time": expect.anything(),
        "origin": "https://www.google.com",
        "links": [],
        "title": "Assoc Info Title No A"}],
        ["https://www.google.com/page2", {
          "href":"https://www.google.com/page2",
          "crawl_time": expect.anything(),
          "origin": "https://www.google.com",
          "links":[
            new URL("https://www.google.com/page1"),
            new URL("https://www.google.com/page3")
          ],
          "title":"Page 2"
        }],
        ["https://www.google.com/page3", {
          "href": "https://www.google.com/page3",
          "crawl_time": expect.anything(),
          "origin": "https://www.google.com",
          "links": [],
          "title": "Assoc Info Title No A"
      }]])
    }
    expect(a).toMatchObject(exp);
  });

  test('new crawler with max depth 1 layer w/ 3 layers of html anchors', async () => {
    /* mock the first 2 GETs with HTML including anchors,
    *  then no anchors.
    */

    mockedAxios.get.mockResolvedValue({
      data: snips.html_no_a,
      status: 200,
    })
    .mockResolvedValueOnce({
      data: snips.html_root_w_3_anchors,
      status: 200,
    })
    .mockResolvedValueOnce({
      data: snips.html_page_1,
      status: 200
    })
    .mockResolvedValueOnce({
      data: snips.html_page_2,
      status: 200
    });
    const a = new SiteCrawler("https://www.google.com", 
                              plugs,
                              undefined, 
                              undefined, 
                              undefined, 
                              0,
                              1);
                              
    expect(a.pageCount()).toBe(0);

    await a.crawl(() => false);
    expect(a.pageCount()).toBe(4);

    expect(a.getLinks().length).toBe(3); // 3 links on root
    expect(a.getLinks()[0].href).toBe("https://www.google.com/page1"); // first link on root is for page 1
    expect(a.getLinks()[1].href).toBe("https://www.google.com/page2"); // second link on root is for page 2

    expect(a.getLinks("https://www.google.com/page1").length).toBe(3); // 2 links on page 2

    let exp = {
      "rootPage": "https://www.google.com/",
      "aborted": false,
      "visited": new Map([
        ["https://www.google.com/", {"href": "https://www.google.com/",
        "crawl_time": expect.anything(),
        "origin": "https://www.google.com",
        "links": [
        new URL("https://www.google.com/page1"),
        new URL("https://www.google.com/page2"),
        new URL("https://www.google.com/page3"),
        ],
        "title":""}],
        ["https://www.google.com/page1",{"href": "https://www.google.com/page1",
        "crawl_time": expect.anything(),
        "origin": "https://www.google.com",
        "links": [
          new URL("https://www.google.com/page1-a"),
          new URL("https://www.google.com/page2"),
          new URL("https://www.google.com/page3"),
        ],
        "title":"Page 1"}],
        ["https://www.google.com/page2", {
          "href":"https://www.google.com/page2",
          "crawl_time": expect.anything(),
          "origin": "https://www.google.com",
          "links":[
            new URL("https://www.google.com/page1"),
            new URL("https://www.google.com/page3")
          ],
          "title":"Page 2"
        }],
        ["https://www.google.com/page3", {
          "href": "https://www.google.com/page3",
          "crawl_time": expect.anything(),
          "origin": "https://www.google.com",
          "links": [],
          "title": "Assoc Info Title No A"
      }]])
    }
    expect(a).toMatchObject(exp);
  });
  test('dont crawl any 3rd party anchors', async () => {
    // Provide the data object to be returned
    // mockedAxios.get.mockResolvedValue({
    //   data: snips.assoc_info_html,
    // });
    mockedAxios.get.mockResolvedValue({
      data: snips.html_no_a,
      status: 200,
    })
    .mockResolvedValueOnce({
      data: snips.assoc_info_html,
      status: 200,
    });
    const a = new SiteCrawler("https://www.google.com", plugs, undefined, undefined, undefined, 0);
    expect(a.pageCount()).toBe(0);

    await a.crawl(() => false, undefined, undefined);
    expect(a.pageCount()).toBe(6); // won't crawl hometeamsonline.com link
    const links = a.getLinks();

    expect(a.getLinks().length).toBe(6);
    expect(a.getLinks()[0].href).toBe("https://www.google.com/contact_request.php?o=a&a=a&n=352&p=1");
  });

  test('dont crawl \'hometeamsonline.com\' 3rd party anchors', async () => {
    // Provide the data object to be returned
    // mockedAxios.get.mockResolvedValue({
    //   data: snips.assoc_info_html,
    // });
    mockedAxios.get.mockResolvedValue({
      data: snips.html_no_a,
      status: 200,
    })
    .mockResolvedValueOnce({
      data: snips.assoc_info_html,
      status: 200,
    });
    const a = new SiteCrawler("https://www.google.com", plugs, undefined, undefined, undefined, 0);
    expect(a.pageCount()).toBe(0);

    await a.crawl((link: URL) => {
      if (link.origin == 'https://www.hometeamsonline.com') {
        return false;
      }
      return true;
    }, undefined, undefined);
    expect(a.pageCount()).toBe(6); // won't crawl hometeamsonline.com link
    const links = a.getLinks();

    expect(a.getLinks().length).toBe(6);
    expect(a.getLinks()[0].href).toBe("https://www.google.com/contact_request.php?o=a&a=a&n=352&p=1");
  });
});

