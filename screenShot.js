const puppeteer = require('puppeteer');

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

  let index = 0;
  for (const {cappture, originalUrl} of data) {
    index++;

    html.push('<li>',
        `<p>Cappture: <a href="${cappture}">${cappture}</a></p>`,
        `<p>Original URL: <a href="${originalUrl}">${originalUrl}</a></p>`,
    );
    try {
      // cleaning cookies just in case we alredy accepted the use of cookies before
      const client = await page.target().createCDPSession();
      await client.send('Network.clearBrowserCookies');
      console.log(originalUrl);

      await page.goto(
          originalUrl,
          {
            //waiting until the page fully loades before doing anything
            waitUntil: 'domcontentloaded',
          },
      );

      console.log('trying to find button');
      //gree is the word in the popup Agree
      const buttons = await page.$x('//a[contains(., \'gree\')]');
      console.log(buttons);
      if (buttons.length > 0) {
        console.log('found button');
        await buttons[0].click();
      }

      await page.screenshot({path: `res/${index}.png`, fullPage: true});

      html.push(
          `<p>ScreenshotWithoutPopup: <a href="${index}.png"><img src="${index}.png" alt="ScreenshotWithoutPopup" width="300px"></a></p>`,
          `</li>`,
      );
    } catch (e) {
      console.log(originalUrl);
      console.log(e);
      html.push(
          `<p>ScreenshotWithoutPopup: ${e}</p>`,
          `</li>`,
      );
    }

  }

  await browser.close();

  html.push('</ul>');
  fs.writeFileSync('res/result.html', html.join(''));
})();
