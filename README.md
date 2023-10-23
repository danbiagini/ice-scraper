# Ice Scraper

Project contains a couple tools for scraping web sites:
 - A web site crawler library inspired by https://dev.to/uiii/web-scraping-with-nodejs-and-typescript-the-scraper-part-ffn 
 - Crawler program which scrapes the links found during crawl.
 
I debated pulling one off the shelf but this was more fun.  Added some useful features, such as:
#1 a random delay to hopefully avoid annoying server admins
#2 support a url file
#3 parallel async support with max thread control
#4 generic 2nd & 3rd party link filter support
#5 Plugin scraper support

To run some crawls (need a --url xor --url_file)
```
npx ts-node src/crawl.ts --url_file <file_containing_1_site_url_per_line> --max_depth <max page traversal depth from root> --threads <max async parallel crawls>
```

To run the web application which currently is just a mostly blank site with links for testing the crawling

```
npm start
```

To access the local dev server in GH codespaces (which has a few links to crawl):
```
http://localhost:3000
```

To run some crawls (need a --url xor --url_file)
```
npx ts-node src/crawl.ts --url_file <file_containing_1_site_url_per_line> --max_depth <max page traversal depth from root> --threads <max async parallel crawls>
```

To use a plugin from command line
```
npx ts-node src/crawl.ts --url <url> --max_depth 0 --plugin_file ./ArenaScraper
```


## Building new crawlers and scrapers into the library

The library is designed to handle two types of tasks: 
1. crawling (iterating over a set of pages or links), instantiating a basic link scraper instance for each page,  then serializing the data into a base JSON formatted output.
1. scraping using a page or site specific parser to extract specific page content / DOM to extract data for that page. [^1]

To build the scraper, you'll need to do some experimentation on a page sample.  The easiest way is to use jquery in the browser's javascript console.  Here's a nice [stackoverflow post](https://stackoverflow.com/questions/7474354/include-jquery-in-the-javascript-console) on how to inject jquery on a site (if it doesn't already have it).  Once you have jquery installed, you can use the console to execute jquery selections following the [jquery docs](https://learn.jquery.com/using-jquery-core/selecting-elements/)  

[^1]: the examples use [cheerio](https://cheerio.js.org/) for html scraping, which seems like the best option as of this writing.


## TODO
1. The plugin model has a major issue, it doesn't work with crawling multiple pages since the PluginManager is keyed on page href.  Subsequent pages crawled won't have a plugin associated with the page.
1. Ideally the plugin should be able to return a set of new links to crawl (as opposed to only being able to crawl via the 'base' <a href> scraper)