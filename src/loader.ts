import axios, { AxiosRequestConfig } from 'axios';
import fs = require('fs');

const edgeUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"

export async function loadPage(url: string, max_age: number = (60 * 60 * 24 * 7), ua: string = edgeUa) {
    const urlAsFileName = url.match(/https?\:\/\/([\w\.]+)(\/?[\w\/\.\?=]*)/);
    if (!urlAsFileName) {
        throw "Invalid URL for pattern";
    }

    const deSlashedPath = urlAsFileName[2].replace("/", "_");
    const fileName = 'page_cache/' + urlAsFileName[1] + deSlashedPath;
    const fStat = fs.statSync(fileName, { bigint: false, throwIfNoEntry: false });

    if (fStat && (fStat.mtimeMs + (max_age * 1000)) > Date.now()) {
        const buf = fs.readFileSync(fileName);
        console.log("pulling content from cache: %s", fileName)
        return (buf.toString());
    }

    const config: AxiosRequestConfig = {}
    if (ua) {
        config.headers = { 'User-Agent': ua }
    }

    const response = await axios.get(url, config);
    if (response.status != 200) {
        console.log("response code not 200... ", response.status);
    }
    fs.writeFileSync(fileName, response.data);
    console.log("retrieved and cached %d bytes from %s to %s ", response.data.length, url, fileName);

    return (response.data);
}
