const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  const client = await page.target().createCDPSession();
  await await client.send("Network.clearBrowserCookies");
  await page.goto("https://github.com/tao101", {
    waitUntil: "networkidle2",
  });

  await page.screenshot({ path: "test.png", fullPage: true });
  await browser.close();
})();
