import express from "express";
import puppeteer, { Page } from "puppeteer";
import { FIELD_CONFIG } from "./fieldConfig.js";
import { FieldName, Unit } from "./types.js";

const app = express();

const { SOLIS_URL, SOLIS_USERNAME, SOLIS_PASSWORD } = process.env;
const PORT = 8080;

const FIELD_NAMES = Object.keys(FIELD_CONFIG) as FieldName[];
const SCRAPE_ERROR_LIMIT = 20; // report errors after 20 consecutive scrape failures
const scrapedData = { ...FIELD_CONFIG };
let scrapeErrorCount = 0;

const validateScrapedValue = (fieldName: FieldName, newValue: number) => {
  if (fieldName !== "batteryChargeLevel") {
    return newValue;
  }

  // batteryChargeLevel returns 0% intermittently on SolisCloud
  // ignore large drops from >15% down to 0%
  const oldValue = scrapedData[fieldName].value;
  if (newValue === 0 && oldValue != null && oldValue >= 15) {
    return oldValue;
  }

  return newValue;
};

const scrapeField = async (page: Page, fieldName: FieldName, selector: string, unit: Unit) => {
  try {
    const element = await page.$(selector);
    if (!element) {
      throw new Error("ERROR: Element not found.");
    }
    const textContent = await element.getProperty("textContent");
    const resultString = await textContent.jsonValue();
    if (!resultString) {
      throw new Error("ERROR: Could not get serialized text content.");
    }
    const resultFloat = parseFloat(resultString.replace(unit, ""));
    const validatedResult = validateScrapedValue(fieldName, resultFloat);
    scrapedData[fieldName].value = validatedResult;
    scrapedData[fieldName].scrapedAt = new Date().toISOString();
    scrapedData[fieldName].error = null;
  } catch (error) {
    scrapedData[fieldName].value = null;
    scrapedData[fieldName].scrapedAt = null;
    scrapedData[fieldName].error = error instanceof Error ? error.message : String(error);
  }
};

const scrapeData = async () => {
  console.log("Scrape requested at " + new Date().toUTCString());

  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "production",
    args: ["--no-zygote", "--no-sandbox", "--window-size=1920,1080"],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  try {
    const page = await browser.newPage();
    await page.goto(SOLIS_URL);
    await page.reload();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      await page.click(".username input");
    } catch (error) {
      await page.goto(SOLIS_URL);
    }

    // Fill in username and password
    await page.type(".username input", SOLIS_USERNAME);
    await page.click(".username_pwd.el-input input");
    await page.type(".username_pwd.el-input input", SOLIS_PASSWORD);

    // Click privacy policy
    await page.evaluate(() => {
      const element = document.querySelector(".remember .el-checkbox__original");

      if (element instanceof HTMLElement) {
        element.click();
      }
    });

    // Click login button
    await Promise.all([
      page.click(".login-btn button"),
      new Promise((resolve) => setTimeout(resolve, 1000)),
      page.waitForNavigation(),
    ]);

    // Close maintenance dialog if it's there
    await Promise.all([
      page.evaluate(() => {
        const element = document.querySelector(".el-dialog__headerbtn");

        if (element instanceof HTMLElement) {
          element.click();
        }
      }),
      new Promise((resolve) => setTimeout(resolve, 1000)),
      page.waitForNavigation(),
    ]);

    // Click on plant overview
    const clickableElementSelector = ".el-table__body tr:first-child td:nth-child(2)";
    await page.waitForSelector(clickableElementSelector);
    await page.click(clickableElementSelector);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Move to new tab
    const pages = await browser.pages();
    const newPage = pages[pages.length - 1];

    // Wait for detail to be available
    await newPage.waitForSelector(scrapedData[FIELD_NAMES[0]].selector);

    // Scrape fields
    const promises = FIELD_NAMES.map((fieldName) => {
      const { selector, unit } = scrapedData[fieldName];
      return new Promise((resolve) => resolve(scrapeField(newPage, fieldName, selector, unit)));
    });

    await Promise.all(promises);

    if (FIELD_NAMES.map((fieldName) => scrapedData[fieldName].value).every((value) => value != null)) {
      scrapeErrorCount = 0;
      console.log("SUCCESS: Data scraped at " + new Date().toISOString());
    } else {
      console.log("ERROR: Failed to scrape data...");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`ERROR: ${errorMessage}`);
    scrapeErrorCount++;

    if (scrapeErrorCount >= SCRAPE_ERROR_LIMIT) {
      FIELD_NAMES.forEach((fieldName) => {
        scrapedData[fieldName].value = null;
        scrapedData[fieldName].scrapedAt = null;
        scrapedData[fieldName].error = `ERROR: ${errorMessage}`;
      });
    }
  } finally {
    await browser.close();
  }
};

app.get("/data", (_req, res) => {
  return res.json(scrapedData);
});

app.listen(PORT, () => {
  console.log(`Solis cloud scraper listening on port ${PORT}`);
});

scrapeData();
setInterval(scrapeData, 60 * 1000);
