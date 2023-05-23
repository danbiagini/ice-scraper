import axios from 'axios';
import * as snips from "./html-snips"
import { SiteCrawler } from '../src/SiteCrawler';

// https://www.csrhymes.com/2022/03/09/mocking-axios-with-jest-and-typescript.html
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing SiteCrawler class', () => {
  test('new crawler object should result in instance', () => {
    const a = new SiteCrawler("https://www.google.com");
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
    const a = new SiteCrawler("https://www.google.com", undefined, undefined, undefined, 0);
    expect(a.pageCount()).toBe(0);

    await a.crawl();
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
      data: snips.html_page_2,
      status: 200
    });
    const a = new SiteCrawler("https://www.google.com", undefined, undefined, undefined, 0);
    expect(a.pageCount()).toBe(0);

    await a.crawl();
    expect(a.pageCount()).toBe(4);

    expect(a.getLinks().length).toBe(3); // 3 links on root
    expect(a.getLinks()[0].href).toBe("https://www.google.com/page1"); // first link on root is for page 1
    expect(a.getLinks()[1].href).toBe("https://www.google.com/page2"); // second link on root is for page 2

    expect(a.getLinks("https://www.google.com/page2").length).toBe(2); // 2 links on page 2

    let exp = {
      "root": "https://www.google.com/",
      "pages": [{
        "https://www.google.com/":{
        "href": "https://www.google.com/",
        "origin": "https://www.google.com",
        "links": [
          "https://www.google.com/page1",
          "https://www.google.com/page2",
          "https://www.google.com/page3",
        ],
        "title":""
      },
        "https://www.google.com/page1": {
          "href": "https://www.google.com/page1",
          "origin": "https://www.google.com",
          "links": [
          "https://www.google.com/page2",
          "https://www.google.com/page3"
          ],
          "title": "Page 1"
      },
        "https://www.google.com/page2": {
          "href":"https://www.google.com/page2",
          "origin": "https://www.google.com",
          "links":[
          "https://www.google.com/page1",
          "https://www.google.com/page3"
          ],
          "title":"Page 2"
      },
        "https://www.google.com/page3": {
          "href": "https://www.google.com/page3",
          "origin": "https://www.google.com",
          "links": [],
          "title": ""
      }
      }]
    }
    expect(JSON.stringify(a)).toBe(JSON.stringify(exp));
  });
});

