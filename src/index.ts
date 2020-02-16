import url from "url";
import puppeteer, { Browser } from "puppeteer";
import gatherPerformanceData from "./gatherPerformanceData";
import { Config, SiteData } from "./types";

let browser: Browser;

export function getBrowser(): Browser {
  return browser;
}

export async function startBrowser(): Promise<void> {
  browser = await puppeteer.launch();
}

export function stopBrowser(): void {
  browser.close();
  browser = undefined;
}

export async function run(config: Config): Promise<SiteData> {
  url.parse(config.url);

  const siteData = await gatherPerformanceData(config, browser.wsEndpoint());
  return siteData;
}
