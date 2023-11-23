import express from "express";
import puppeteer, { Page } from "puppeteer";
import { scrapedData } from "./scrapedData.js";
import { FieldName, Unit } from "./types.js";

const app = express();

const SOLIS_URL = process.env.SOLIS_URL;
const USERNAME = process.env.SOLIS_USERNAME;
const PASSWORD = process.env.SOLIS_PASSWORD;
const PORT = 8080;

const FIELD_NAMES = Object.keys(scrapedData) as FieldName[];

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
    headless: true,
    args: ["--no-zygote", "--no-sandbox", "--window-size=1920,1080"],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  try {
    if (!USERNAME || !PASSWORD) {
      throw new Error("ERROR: Login credentials not provided.");
    } else if (!SOLIS_URL) {
      throw new Error("ERROR: Solis Cloud URL not provided.");
    }

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
    await page.type(".username input", USERNAME);
    await page.click(".username_pwd.el-input input");
    await page.type(".username_pwd.el-input input", PASSWORD);

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
    await page.click(".el-table__body-wrapper tr");
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

    if (FIELD_NAMES.map((fieldName) => scrapedData[fieldName].value).some((value) => value != null)) {
      console.log("SUCCESS: Data scraped at " + new Date().toISOString());
    } else {
      console.log("ERROR: Failed to scrape data...");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`ERROR: ${errorMessage}`);

    FIELD_NAMES.forEach((fieldName) => {
      scrapedData[fieldName].value = null;
      scrapedData[fieldName].scrapedAt = null;
      scrapedData[fieldName].error = `ERROR: ${errorMessage}`;
    });
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
