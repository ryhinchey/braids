const fileType = require("file-type");
const { getReqFromIds, pause, calculateCoverage } = require("./utils");
const cookies = require("./cookies");

async function gatherPerfData(site, browser) {
  const requests = [];

  const page = await browser.newPage();
  await page.setRequestInterception(true);

  /* Cookies
    await page.setCookie(...cookies);
  /*
  
  /* Device Emulation
    const devices = require('puppeteer/DeviceDescriptors');
    const iPhone = devices[ 'iPhone 8' ];
    await page.emulate(iPhone);
  */

  /* Set User Agent
    await page.setUserAgent(
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    );
  */

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
    /* Request Blocking
        if (reqUrl.includes("maxymiser")) {
          console.log(reqUrl);
          console.log("blocking maxymiser");
          request.abort();
        } 
    */
    const method = request.method();
    const headers = request.headers();
    const resourceType = request.resourceType();
    const redirects = request.redirectChain().map(req => {
      return req.url();
    });

    let postData;
    if (method === "POST") {
      postData = request.postData();
    }

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
        //console.log(`ERROR IN RESPONSE CALLBACK, ${e}`);
      }
    }
  });

  // Start Code Coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ]);

  // Navigate to page
  await page.goto(site, { timeout: 25000, waitUntil: "networkidle2" });

  // Calculate Code Coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage()
  ]);
  const coverage = calculateCoverage([...jsCoverage, ...cssCoverage]);

  // Performance Entries
  const entries = await page.evaluate(() =>
    JSON.stringify(performance.getEntries())
  );
  const entryData = JSON.parse(entries).map(entry => {
    return {
      url: entry.name,
      type: entry.entryType,
      start: entry.startTime,
      duration: entry.duration,
      initiator: entry.initiatorType,
      protocol: entry.nextHopProtocol
    };
  });
  const { timing } = await page.evaluate(() => performance.toJSON());
  const performance = { entries: entryData, timing };

  // Page title
  const title = await page.title();

  // Screenshot
  await page.screenshot({
    path: "./test_data/image.jpg",
    type: "jpeg",
    fullPage: true
  });

  await page.close();

  return {
    site,
    title,
    performance,
    coverage,
    requests
  };
}

module.exports = gatherPerfData;
