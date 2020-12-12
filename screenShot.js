const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.goto(
    "https://news.sky.com/story/brexit-britain-should-be-very-worried-about-no-deal-with-eu-ex-europol-chief-warns-12159138"
  );
  await page.$eval("button", async function (el) {
    el.click();
  });

  await page.screenshot({ path: "skynews.png", fullPage: true });
  await browser.close();
})();
