import puppeteer, { Browser, LaunchOptions } from "puppeteer";
import gatherPerformanceData from "./gatherPerformanceData";
import { Config, SiteData } from "./types";

let browser: Browser;

export function getBrowser(): Browser {
  return browser;
}

export async function startBrowser(
  launchOptions: LaunchOptions = {}
): Promise<void> {
  browser = await puppeteer.launch(launchOptions);
}

export function stopBrowser(): void {
  browser.close();
  browser = undefined;
}

export async function run(config: Config): Promise<SiteData> {
  try {
    if (typeof config.url !== "string") {
      throw new Error("config.url must be a string");
    }

    const siteData = await gatherPerformanceData(config, browser.wsEndpoint());
    return siteData;
  } catch (error) {
    console.error(error);
  }
}
