import cheerio from 'cheerio';
import { loadPage } from './loader';
import fs = require('fs');
import { Association, AssociationFilter } from './AssociationScraper';

let DEBUG = false;

export class AssociationCrawler {
    userAgent?: string;
    scrapedTeams: Association[];
    filter?: AssociationFilter;
    avgDelaySecs?: number;

    constructor(associations: Association[], ua?: string, filter?: AssociationFilter, delay?: number) {
        this.scrapedTeams = associations;

        if (filter) this.filter = filter;
        if (delay) this.avgDelaySecs = delay;
    }

    async crawl(start?: number, count?: number) {
        let i = start || 0;
        let last_i = (count ? i + count : this.scrapedTeams.length - 1);
    }
}