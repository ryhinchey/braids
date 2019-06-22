const puppeteer = require("puppeteer");
const fs = require("fs");
const gatherPerfData = require("./gatherPerfData");

const amex = "https://www.americanexpress.com/us/credit-cards/";
const chase = "https://www.chase.com/credit-cards";

puppeteer.launch().then(async browser => {
  const americanexpress = await gatherPerfData(amex, browser);
  // const chasecreditcards = await gatherPerfData(chase, browser);
  fs.writeFileSync(
    "test_data/data.json",
    JSON.stringify(americanexpress, null, 2)
  );
  browser.close();
  process.exit();
});
