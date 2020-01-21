import puppeteer, { Browser } from "puppeteer";
import gatherPerformanceData from "./gatherPerformanceData";
import { Config, SiteData } from "./types";

let browser: Browser;

export async function startBrowser(): Promise<void> {
  browser = await puppeteer.launch();
}

export function stopBrowser(): void {
  browser.close();
}

export async function run(config: Config): Promise<SiteData> {
  const siteData = await gatherPerformanceData(config, browser);

  return siteData;
}