import * as puppeteer from "puppeteer";
import gatherPerformanceData from "./gatherPerformanceData";
import { Config } from "./types";

let browser: puppeteer.Browser;

export async function startBrowser() {
  browser = await puppeteer.launch();
}

export function stopBrowser() {
  browser.close();
}

export async function run(config: Config) {
  const siteData = await gatherPerformanceData(config, browser);

  return siteData;
}
