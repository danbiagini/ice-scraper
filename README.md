# Ice Scraper

A web site crawler inspired by https://dev.to/uiii/web-scraping-with-nodejs-and-typescript-the-scraper-part-ffn 

I debated pulling one off the shelf but this was more fun.  Added some useful features, such as:
#1 a random delay to hopefully avoid annoying server admins
#2 support a url file
#3 parallel async support with max thread control
#4 generic 2nd & 3rd party link filter support

To run this web application which currently is just a mostly blank site with links for testing the crawling

```
npm start
```

To run some crawls:
```
npx ts-node src/crawl.ts --url_file <file_containing_1_site_url_per_line> --max_depth <max page traversal depth from root> --threads <max async parallel crawls>
