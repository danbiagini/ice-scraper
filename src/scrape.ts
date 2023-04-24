import minimist from 'minimist';
import { AssociationScraper, Association, AssociationFilter } from './AssociationScraper';
import { loadPage } from './loader';

async function main() {
    const argv = minimist(process.argv.slice(1));

    const startUrl = argv['url'] ? (argv['url']) : "https://www.google.com";
    cachMaxAge = argv['max_age'] ? (argv['max_age']) : (60 * 60 * 24 * 7);

    let filter:AssociationFilter = {};
    if (argv["state_filter"] || argv["league_filter"] || argv["city_filter"]) {
        filter.state = argv["state_filter"];
        filter.league = argv["league_filter"];
        filter.city = argv["city_filter"];
    }

    const root: string = await loadPage(startUrl, cachMaxAge);

    const fqdn = startUrl.match(/(https?\:\/\/[\w\.]+)\/?[\w\/]*/);
    const scraper = new AssociationScraper(fqdn[1], undefined, cachMaxAge, filter, 20);
    const teams = await scraper.scrapeAssocList(root, argv['count']);
    console.log(scraper.scrapedTeams.length);
    scraper.save();
}
let DEBUG = false;
let cachMaxAge;

main();
