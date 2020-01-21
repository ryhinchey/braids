import {
  Browser,
  CoverageEntry
} from "puppeteer";
import devices from "puppeteer/DeviceDescriptors";
import { Config, Request, SiteData } from "./types";
import calculateCoverage from "./calculateCoverage";



async function gatherPerformanceData(config: Config, browser: Browser): Promise<SiteData> {
  const { url, cookies, userAgent, device } = config;
  const requests: Request[] = [];

  const page = await browser.newPage();

  if (cookies) {
    await page.setCookie(...cookies);
  }

  if (device) {
    const deviceToEmulate = devices[device];

    if (!deviceToEmulate) {
      throw new Error('Please specify a valid device to emulate: https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js');
    }

    await page.emulate(deviceToEmulate);
  }

  if (userAgent) {
    await page.setUserAgent(userAgent);
  }

  // create CDP session - https://github.com/aslushnikov/getting-started-with-cdp#using-puppeteers-cdpsession
  const client = await page.target().createCDPSession();
  await client.send("Network.enable");

  /* Emulate Network Conditions
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0
  });
  */

  // Page request event handler
  page.on("request", request => {
    const method = request.method();
    const headers = request.headers();
    const resourceType = request.resourceType();

    requests.push({
      url: request.url(),
      method,
      headers,
      resourceType
    });

    request.continue();
  });

  // Page response event handler
  page.on("response", async response => {
    const url = response.url();
    const existingRequest = requests.find(req => req.url === url);
    if (existingRequest) {
      try {
        const status = response.status();
        const headers = response.headers();

        const resp = {
          status,
          headers
        };

        existingRequest.response = resp;
      } catch (e) {
        console.log(`Error in response callback, ${e}`);
      }
    }
  });

  // Start Code Coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ]);

  await page.setRequestInterception(true);

  // Navigate to page
  await page.goto(url, { timeout: 25000, waitUntil: "networkidle2" });

  // // Calculate Code Coverage
  const [jsCoverage, cssCoverage]: [
    CoverageEntry[],
    CoverageEntry[]
  ] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage()
  ]);

  const coverage = calculateCoverage([...jsCoverage, ...cssCoverage]);

  // Performance Entries
  const entries: PerformanceEntryList = await page.evaluate(() =>
    JSON.parse(JSON.stringify(window.performance.getEntries()))
  );

  const { timing }: { timing: PerformanceResourceTiming } = await page.evaluate(() =>
    window.performance.toJSON()
  );

  const performance = { entries, timing };

  // Page title
  const title = await page.title();

  await page.close();

  return {
    url,
    title,
    performance,
    coverage,
    requests
  };
}

export default gatherPerformanceData;
