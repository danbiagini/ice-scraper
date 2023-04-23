import { AssociationScraper } from "../src/AssociationScraper"
import axios from 'axios';
import * as snips from "./html-snips"

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('testing Association class', () => {
  test('new Association object should result in instance', () => {
    const a = new AssociationScraper("https://www.google.com");
    expect(a).toBeInstanceOf(AssociationScraper);
  });

  test('new Association scraper with mid html ad content', async () => {
    // Provide the data object to be returned
    mockedAxios.get.mockResolvedValue({
      data: snips.assoc_info_html,
    });
    const a = new AssociationScraper("https://www.google.com", undefined, 0);
    await a.scrapeAssocList(snips.html_rows_with_ads);
    expect(a.scrapedTeams.length).toBe(3);
    expect(a.scrapedTeams[2]!.name).toBe("Fairbanks Arctic Lions");
    expect(a.scrapedTeams[2]!.rinks).toBe("Dempsey Anderson Ice Arenas (Anchorage, AK)");
    expect(a.scrapedTeams[2]!.assoc_web).toBe("https://www.hometeamsonline.com/teams/?u=alaskaallstars&s=hockey")
  });

  test('Assoc scrape with no rinks', async () => {
      // Provide the data object to be returned
      mockedAxios.get.mockResolvedValue({
        data: snips.assoc_no_rink_html,
      });
      
      const a = new AssociationScraper("https://assocscrapewithnorinks", undefined, 0);
      await a.scrapeAssocList(snips.html_one_row);
      expect(a.scrapedTeams.length).toBe(1);
      expect(a.scrapedTeams[0].rinks).toBeUndefined();
  });

  test('Assoc scrape with no web', async () => {
    // Provide the data object to be returned
    mockedAxios.get.mockResolvedValue({
      data: snips.assoc_no_web_html,
    });
    
    const a = new AssociationScraper("https://assocscrapewithnoweb", undefined, 0);
    await a.scrapeAssocList(snips.html_one_row);
    expect(a.scrapedTeams.length).toBe(1);
    expect(a.scrapedTeams[0].assoc_web).toBeUndefined();
  })
});