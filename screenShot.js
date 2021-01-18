const puppeteer = require("puppeteer");

/**
 *
 * @type []
 */
const data = require('./data.json');
const fs = require('fs');
let html = ['<ul>'];

(async () => {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  data.map( async ({cappture, originalUrl}, index) => {
    try {
      // cleaning cookies just in case we alredy accepted the use of cookies before
      const client = await page.target().createCDPSession();
      await client.send("Network.clearBrowserCookies");
      console.log(originalUrl);

      await page.goto(
          originalUrl,
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

      let imgPath = `res/${index}.png`;
      await page.screenshot({path: imgPath, fullPage: true});

      html.push('<li>',
          `<p>Cappture: <a href="${cappture}">${cappture}</a></p>`,
          `<p>Original URL: <a href="${originalUrl}">${originalUrl}</a></p>`,
          `<p>ScreenshotWithoutPopup: <img src="${imgPath}" alt="ScreenshotWithoutPopup"></p>`,
          `</li>`,
      );
    } catch (e) {
      console.log(originalUrl);
      console.log(e);
    }

  });

  await browser.close();

  html.push('</ul>');
  fs.writeFileSync('res/result.html', html.join(''));
})();
