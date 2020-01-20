import {
  Browser,
  CoverageEntry,
  HttpMethod,
  Headers,
  ResourceType
} from "puppeteer";
import devices from "puppeteer/DeviceDescriptors";
import { Config } from "./types";
import calculateCoverage from "./calculateCoverage";

interface Request {
  url: string;
  method: HttpMethod;
  headers: Headers;
  redirects: string[];
  resourceType: ResourceType;
  response?: {
    status: number;
    headers: Headers;
  };
}

async function gatherPerfData(config: Config, browser: Browser) {
  const { url, cookies, userAgent, device } = config;
  const requests: Request[] = [];

  const page = await browser.newPage();
  await page.setRequestInterception(true);

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
    const redirects = request.redirectChain().map(req => {
      return req.url();
    });

    requests.push({
      url: request.url(),
      method,
      headers,
      redirects,
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

  // Navigate to page
  await page.goto(url, { timeout: 25000, waitUntil: "networkidle2" });

  // Calculate Code Coverage
  const [jsCoverage, cssCoverage]: [
    CoverageEntry[],
    CoverageEntry[]
  ] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage()
  ]);
  const coverage = calculateCoverage([...jsCoverage, ...cssCoverage]);

  // Performance Entries
  const entries: string = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntries())
  );

  const entryData = JSON.parse(entries).map(
    (entry: PerformanceResourceTiming) => {
      return {
        url: entry.name,
        type: entry.entryType,
        start: entry.startTime,
        duration: entry.duration,
        initiator: entry.initiatorType,
        protocol: entry.nextHopProtocol
      };
    }
  );
  const { timing }: { timing: PerformanceTiming } = await page.evaluate(() =>
    window.performance.toJSON()
  );

  const performance = { entries: entryData, timing };

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

export default gatherPerfData;
