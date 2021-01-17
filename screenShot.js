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
  // cleaning cookies just in case we alredy accepted the use of cookies before
  const client = await page.target().createCDPSession();
  await await client.send("Network.clearBrowserCookies");

  await page.goto(
    "https://www.politico.eu/article/us-regulator-authorizes-first-coronavirus-vaccine-for-emergency-use/",
    {
      //waiting until the page fully loades before doing anything
      waitUntil: "domcontentloaded",
    }
  );

  console.log("trying to find button");
  //gree is the word in the popup Agree
  const buttons = await page.$x("//a[contains(., 'gree')]");
  console.log(buttons);
  if (buttons.length > 0) {
    console.log("found button");
    await buttons[0].click();
  }

  await page.screenshot({ path: "politico after.png", fullPage: true });
  await browser.close();
})();
