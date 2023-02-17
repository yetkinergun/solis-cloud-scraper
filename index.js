const puppeteer = require('puppeteer');
const express = require('express');
const FIELD_CONFIG = require('./fieldConfig.js');

const app = express();

const PORT = process.env.PORT || 8080;
const SOLIS_URL = process.env.SOLIS_URL;
const USERNAME = process.env.SOLIS_USERNAME;
const PASSWORD = process.env.SOLIS_PASSWORD;

const scrapedData = {};

const scrapeField = async (page, fieldName, selector, unit) => {
  const element = await page.$(selector);
  const resultString = await (await element.getProperty('textContent')).jsonValue();
  const resultFloat = parseFloat(resultString.replace(unit, ''));
  scrapedData[fieldName] = resultFloat;
};

async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-zygote', '--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1000 });
    await page.goto(SOLIS_URL);
    await page.reload();
    await page.waitForTimeout(5000);

    try {
      await page.click('.username input');
    } catch (err) {
      console.log('Reloading page as empty');
      await page.goto(SOLIS_URL);
    }

    // Fill in username and password
    await page.type('.username input', USERNAME);
    await page.click('.username_pwd.el-input input');
    await page.type('.username_pwd.el-input input', PASSWORD);

    // Click privacy policy
    await page.evaluate(() => {
      document.querySelector('.remember .el-checkbox__original').click();
    });

    // Click login button
    await page.click('.login-btn button');

    // Wait for page load then click on the table to go to plant overview
    await page.waitForTimeout(5000);

    await page.click('.el-table__body-wrapper tr');
    await page.waitForTimeout(5000);

    // Opens in new tab, so move to that
    const pages = await browser.pages();

    const popup = pages[pages.length - 1];
    await popup.setViewport({ width: 1200, height: 1000 });

    // Wait for detail to be available
    await popup.waitForSelector('.toptext-info > div > .fadian-info > div > span:nth-child(2)');

    const fieldNames = Object.keys(FIELD_CONFIG);
    const promises = fieldNames.map((fieldName) => {
      const { selector, unit } = FIELD_CONFIG[fieldName];

      return new Promise((resolve, reject) =>
        resolve(scrapeField(popup, fieldName, selector, unit))
      );
    });

    await Promise.all(promises);

    await browser.close();

    if (Object.keys(scrapedData).length > 0) {
      scrapedData.scrapedAt = new Date().toISOString();
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log('Error - ' + e.message);
    await browser.close();
    throw e;
  }
}

async function getData() {
  console.log('Scrape requested at ' + new Date().toUTCString());

  try {
    const success = await scrapeData();
    if (success) {
      console.log('Data scraped at ' + scrapedData.scrapedAt);
    } else {
      console.log('Unable to fetch data - using previous data');
    }
  } catch (err) {
    console.log('Error fetching data - using previous data');
  }
}

getData();
setInterval(getData, 60 * 1000);

app.get('/data', (req, res) => {
  return res.json(scrapedData);
});

app.listen(PORT, () => {
  console.log(`Solis cloud scraper listening on port ${PORT}`);
});
