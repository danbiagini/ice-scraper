import axios, { AxiosRequestConfig } from 'axios';
import fs = require('fs');

const DEBUG = false;
const edgeUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"

function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
export function urlToFileName(url: string): string {
    const urlAsFileName = url.match(/https?\:\/\/([\w\.]+)(\/?[\w\/\.\?=\-]*)/);
    if (!urlAsFileName) {
        throw "Invalid URL for pattern";
    }
    return (urlAsFileName[1] + urlAsFileName[2].replace(/\//g, "_"));
}

export async function loadPage(url: string, max_age_secs: number = (60 * 60 * 24 * 7), ua: string = edgeUa, delay_net_secs: number = 0) {

    const fileName = 'page_cache/' + urlToFileName(url);
    const fStat = fs.statSync(fileName, { bigint: false, throwIfNoEntry: false });

    if (fStat && (fStat.mtimeMs + (max_age_secs * 1000)) > Date.now()) {
        const buf = fs.readFileSync(fileName);
        if (DEBUG) console.log("pulling content from cache: %s", fileName)
        return (buf.toString());
    }

    const config: AxiosRequestConfig = {}
    if (ua) {
        config.headers = { 'User-Agent': ua }
    }

    if (delay_net_secs) {
        console.log(`${Date()}: sleeping ${delay_net_secs} seconds`);
        await sleep(delay_net_secs * 1000);
    }

    let page = "";
    try {
        const response = await axios.get(url, config);
        if (response.status != 200) {
            console.log("response code not 200... ", response.status);
        }
        page = response.data;
    } catch (error) {
        console.error("Error retrieving %s: %s", url, error);
    }

    if (page.length == 0) {
        return page;
    } else if (max_age_secs != 0) {
        try {
            fs.writeFileSync(fileName, page);
            if (DEBUG) console.log("retrieved and cached %d bytes from %s to %s ", page.length, url, fileName);
        } catch (error) {
            console.log("Error %s writing %d byes from %s to %s", error, page.length, url, fileName);
        }
    } else {
        if (DEBUG) console.log("retrieved %d bytes from %s", page.length, url);
    }

    return (page);
}
