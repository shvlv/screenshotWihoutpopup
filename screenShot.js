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
  await page.goto(
    "https://www.politico.eu/article/us-regulator-authorizes-first-coronavirus-vaccine-for-emergency-use/",
    {
      waitUntil: "domcontentloaded",
    }
  );

  console.log("trying to find button");
  const buttons = await page.$x("//a[contains(., 'ccept')]");
  console.log(buttons);
  if (buttons.length > 0) {
    console.log("found button");
    await buttons[0].click();
  }

  await page.screenshot({ path: "politico.png", fullPage: true });
  await browser.close();
})();
