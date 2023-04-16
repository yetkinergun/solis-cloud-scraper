const puppeteer = require('puppeteer');
const express = require('express');
const FIELD_CONFIG = require('./fieldConfig.js');

const app = express();

const SOLIS_URL = 'https://soliscloud.com';
const USERNAME = process.env.SOLIS_USERNAME;
const PASSWORD = process.env.SOLIS_PASSWORD;
const PORT = 8080;

const scrapedFields = {};
const erroredFields = {};

const validateScrapedValue = (fieldName, newValue) => {
  if (fieldName !== 'batteryChargeLevel') {
    return newValue;
  }

  // batteryChargeLevel returns 0% intermittently on SolisCloud
  // ignore large drops from >15% down to 0%
  const oldValue = scrapedFields[fieldName];
  if (newValue === 0 && oldValue >= 15) {
    return oldValue;
  }

  return newValue;
};

const scrapeField = async (page, fieldName, selector, unit) => {
  const element = await page.$(selector);
  try {
    const textContent = await element.getProperty('textContent');
    const resultString = await textContent.jsonValue();
    const resultFloat = parseFloat(resultString.replace(unit, ''));
    const validatedResult = validateScrapedValue(fieldName, resultFloat);
    scrapedFields[fieldName] = validatedResult;
  } catch (error) {
    erroredFields[fieldName] = error.message;
  }
};

const scrapeData = async () => {
  console.log('Scrape requested at ' + new Date().toUTCString());

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
    } catch (error) {
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
    await page.waitForTimeout(5000);

    // Click on plant overview
    await page.click('.el-table__body-wrapper tr');
    await page.waitForTimeout(5000);

    // Move to new tab
    const pages = await browser.pages();
    const newPage = pages[pages.length - 1];
    await newPage.setViewport({ width: 1200, height: 1000 });

    // Wait for detail to be available
    await newPage.waitForSelector('.toptext-info > div > .fadian-info > div > span:nth-child(2)');

    // Scrape fields
    const fieldNames = Object.keys(FIELD_CONFIG);
    const promises = fieldNames.map((fieldName) => {
      const { selector, unit } = FIELD_CONFIG[fieldName];

      return new Promise((resolve, reject) =>
        resolve(scrapeField(newPage, fieldName, selector, unit))
      );
    });

    await Promise.all(promises);

    if (Object.keys(scrapedFields).length > 0) {
      scrapedFields.scrapedAt = new Date().toISOString();
      console.log('SUCCESS: Data scraped at ' + scrapedFields.scrapedAt);
    } else {
      console.log('ERROR: Failed to fetch data...');
    }
  } catch (error) {
    console.log('ERROR: ' + error.message);
  } finally {
    await browser.close();
  }
};

scrapeData();
setInterval(scrapeData, 60 * 1000);

app.get('/data', (req, res) => {
  return res.json({
    scrapedFields,
    erroredFields,
  });
});

app.listen(PORT, () => {
  console.log(`Solis cloud scraper listening on port ${PORT}`);
});
