import { startBrowser, stopBrowser, getBrowser } from "./index";

test("startBrowser will start puppeteer and set the browser value to it", async () => {
  expect(getBrowser()).toBeUndefined();
  await startBrowser();
  expect(getBrowser()).toBeDefined();
  stopBrowser();
});

test("stopBrowser will stop the browser", async () => {
  expect(getBrowser()).toBeUndefined();
  await startBrowser();
  expect(getBrowser()).toBeDefined();
  stopBrowser();
  expect(getBrowser()).toBeUndefined();
});
