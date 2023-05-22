import axios from 'axios';
import * as snips from "./html-snips"
import { SiteCrawler } from '../src/SiteCrawler';

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
    })
    .mockResolvedValueOnce({
      data: snips.assoc_no_web_html,
      status: 200
    });
    const a = new SiteCrawler("https://www.google.com", undefined, undefined, undefined, 0);
    expect(a.pageCount()).toBe(0);

    await a.crawl();
    expect(a.pageCount()).toBe(9);

    expect(a.getLinks().length).toBe(6);
    expect(a.getLinks()[0].href).toBe("https://www.google.com/contact_request.php?o=a&a=a&n=352&p=1");
    expect(a.getLinks("https://www.google.com/contact_request.php?o=a&a=a&n=352&p=1").length).toBe(7);
  });
});

