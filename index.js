const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;
const SOLIS_URL = process.env.SOLIS_URL;
const USERNAME = process.env.SOLIS_USERNAME;
const PASSWORD = process.env.SOLIS_PASSWORD;

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

    // Get plant capacity
    await page.waitForSelector('.el-table__row .el-table_1_column_8 .cell');
    const plantCapacityElement = await page.$('.el-table__row .el-table_1_column_8 .cell');
    const plantCapacityString = await (
      await plantCapacityElement.getProperty('textContent')
    ).jsonValue();
    const plantCapacity = parseFloat(plantCapacityString.replace('kWp', ''));

    await page.click('.el-table__body-wrapper tr');
    await page.waitForTimeout(5000);

    // Opens in new tab, so move to that
    const pages = await browser.pages();

    const popup = pages[pages.length - 1];
    await popup.setViewport({ width: 1200, height: 1000 });

    // Wait for detail to be available
    await popup.waitForSelector('.toptext-info > div > .fadian-info > div > span:nth-child(2)');

    // Solar power
    const solarPowerElement = await popup.$('.animation > .wrap > .fadian > .content > span');
    const solarPowerString = await (await solarPowerElement.getProperty('textContent')).jsonValue();
    const solarPower = parseFloat(solarPowerString.replace('kW', ''));

    // Solar energy generated
    const solarEnergyGeneratedElement = await popup.$(
      '.toptext-info > div > .fadian-info > div > span:nth-child(2)'
    );
    const solarEnergyGeneratedString = await (
      await solarEnergyGeneratedElement.getProperty('textContent')
    ).jsonValue();
    const solarEnergyGenerated = parseFloat(solarEnergyGeneratedString.replace('kWh', ''));

    // Battery charge level
    const batteryChargeLevelElement = await popup.$(
      '.chongdian > .content > div > .batteryProgress > .colorBox1'
    );
    const batteryChargeLevelString = await (
      await batteryChargeLevelElement.getProperty('textContent')
    ).jsonValue();
    const batteryChargeLevel = parseFloat(batteryChargeLevelString.replace('%', ''));

    // Battery power
    const batteryPowerElement = await popup.$('.animation > .wrap > .chongdian > .content > span');
    const batteryPowerString = await (
      await batteryPowerElement.getProperty('textContent')
    ).jsonValue();
    const batteryPower = parseFloat(batteryPowerString.replace('kW', ''));

    // if charge is goign TO battery, it had this:
    // <div data-v-44bfab40="" class="chongdianqiu" style="background-color: rgb(170, 218, 118); border-color: rgba(170, 218, 118, 0.3);"></div>
    // if charge is going FROM battery it had this:
    // <div data-v-44bfab40="" class="chongdianqiu" style="background-color: rgb(182, 118, 218); border-color: rgba(182, 118, 218, 0.35);"></div>

    // Battery energy charged
    const batteryEnergyChargedElement = await popup.$(
      '.bottomtext-info > div > .chongdian-info > div:nth-child(1) > span:nth-child(2)'
    );
    const batteryEnergyChargedString = await (
      await batteryEnergyChargedElement.getProperty('textContent')
    ).jsonValue();
    const batteryEnergyCharged = parseFloat(batteryEnergyChargedString.replace('kWh', ''));

    // Battery energy discharged
    const batteryEnergyDischargedElement = await popup.$(
      '.bottomtext-info > div > .chongdian-info > div:nth-child(2) > span:nth-child(2)'
    );
    const batteryEnergyDischargedString = await (
      await batteryEnergyDischargedElement.getProperty('textContent')
    ).jsonValue();
    const batteryEnergyDischarged = parseFloat(batteryEnergyDischargedString.replace('kWh', ''));

    // Grid power
    const gridPowerElement = await popup.$('.animation > .wrap > .maidian > .content > span');
    const gridPowerString = await (await gridPowerElement.getProperty('textContent')).jsonValue();
    const gridPower = parseFloat(gridPowerString.replace('kW', ''));

    // Grid energy imported
    const gridEnergyImportedElement = await popup.$(
      '.toptext-info > div > .maidian-info > div:nth-child(1) > span:nth-child(2)'
    );
    const gridEnergyImportedString = await (
      await gridEnergyImportedElement.getProperty('textContent')
    ).jsonValue();
    const gridEnergyImported = parseFloat(gridEnergyImportedString.replace('kWh', ''));

    // Grid energy exported
    const gridEnergyExportedElement = await popup.$(
      '.toptext-info > div > .maidian-info > div:nth-child(2) > span:nth-child(2)'
    );
    const gridEnergyExportedString = await (
      await gridEnergyExportedElement.getProperty('textContent')
    ).jsonValue();
    const gridEnergyExported = parseFloat(gridEnergyExportedString.replace('kWh', ''));

    /*

		If sending to grid, get this element for animation
		 <div data-v-44bfab40="" class="maidianqiu" style="background-color: rgb(95, 145, 203); border-color: rgba(45, 111, 187, 0.2);"></div>

		 css classes (animation and webkit-animation) the name implies the direction
     const houseLoadPower = await (
		 	maidan
		*/

    // House power
    const housePowerElement = await popup.$('.animation > .wrap > .yongdian > .content > span');
    const housePowerString = await (await housePowerElement.getProperty('textContent')).jsonValue();
    const housePower = parseFloat(housePowerString.replace('kW', ''));

    // House energy consumed
    const houseEnergyConsumedElement = await popup.$(
      '.bottomtext-info > div > .yongdian-info > div > span:nth-child(2)'
    );
    const houseEnergyConsumedString = await (
      await houseEnergyConsumedElement.getProperty('textContent')
    ).jsonValue();
    const houseEnergyConsumed = parseFloat(houseEnergyConsumedString.replace('kWh', ''));

    await browser.close();

    if (solarPower === 'NaN') {
      // Puppeteer will put the string value of NaN if it can't get it, which is why we check for the string not isNaN()
      return {};
    } else {
      return {
        scrapedAt: new Date().toISOString(),
        plantCapacity,
        grid: {
          power: gridPower,
          energyImported: gridEnergyImported,
          energyExported: gridEnergyExported,
        },
        solar: {
          power: solarPower,
          energyGenerated: solarEnergyGenerated,
        },
        house: {
          power: housePower,
          energyConsumed: houseEnergyConsumed,
        },
        battery: {
          chargeLevel: batteryChargeLevel,
          power: batteryPower,
          energyCharged: batteryEnergyCharged,
          energyDischarged: batteryEnergyDischarged,
        },
      };
    }
  } catch (e) {
    console.log('Error - ' + e.message);
    await browser.close();
    throw e;
  }
}

async function getData() {
  const now = new Date();
  console.log('Scrape requested at ' + now.toUTCString());

  try {
    const newData = await scrapeData();
    if (newData?.scrapedAt) {
      data = newData;
      console.log('Data scraped at ' + data.scrapedAt);
    } else {
      console.log('Unable to fetch data - using previous data');
    }
  } catch (err) {
    console.log('Error fetching data - using previous data');
  }
}

let data = {};

getData();
setInterval(getData, 60 * 1000);

app.get('/data', (req, res) => {
  return res.json(data);
});

app.listen(PORT, () => {
  console.log(`Solis cloud scraper listening on port ${PORT}`);
});
