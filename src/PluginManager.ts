import path from 'path';
import { readdirSync } from 'fs';
import { Page } from './SiteCrawler';

export class PluginManager {
    private _plugins: Map<string, ScrapePlugin> = new Map<string, ScrapePlugin>();
    
    async load(plugin: ScrapePlugin, url: string) {
      this._plugins.set(url, plugin);
      await plugin.init();
    }

    async loadFile(file: string, url: string) {
        let Plugin = await import(file);
        let plugin = new Plugin.default();
        await this.load(plugin as ScrapePlugin, url);
        return plugin;
    }

    async loadDir(dir: string, url: string) {
        let files = readdirSync(dir);
        for (let file of files) {
          // The current working is used to resolve the path to the plugins directory.
            this.loadFile(path.join(process.cwd(), dir, file), url)
        }
    }

    async scrape(page: Page, html: string) {
        const p = this._plugins.get(page.href)
        if (p) {
            p.scrape(page, html);
        }
    }

    serialize() {
        let o = new Map<string, Object>();
        this._plugins.forEach(plug => {
            o.set(plug.name, {
                version: plug.version,
                data: plug.serialize()
            })
        });
        return o;
    }
}

export abstract class ScrapePlugin {
    abstract name: string;
    abstract version: string;

    constructor() {
        console.log("ScrapePlugin constructor");
    }

    abstract init(): void;
    abstract stop(): void;
    abstract scrape(p: Page, html: string): Promise<void>;
    abstract serialize(): Object;

}
