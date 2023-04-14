module.exports = {
  solarPower: {
    selector: '.animation > .wrap > .fadian > .content > span',
    unit: 'kW',
  },
  solarEnergyGenerated: {
    selector: '.toptext-info > div > .fadian-info > div > span:nth-child(2)',
    unit: 'kWh',
  },
  batteryChargeLevel: {
    selector: '.chongdian > .content > div > .batteryProgress > .colorBox1',
    unit: '%',
  },
  batteryPower: {
    selector: '.animation > .wrap > .chongdian > .content > span',
    unit: 'kW',
  },
  batteryEnergyCharged: {
    selector: '.bottomtext-info > div > .chongdian-info > div:nth-child(1) > span:nth-child(2)',
    unit: 'kWh',
  },
  batteryEnergyDischarged: {
    selector: '.bottomtext-info > div > .chongdian-info > div:nth-child(2) > span:nth-child(2)',
    unit: 'kWh',
  },
  gridPower: {
    selector: '.animation > .wrap > .maidian > .content > span',
    unit: 'kW',
  },
  gridEnergyImported: {
    selector: '.toptext-info > div > .maidian-info > div:nth-child(1) > span:nth-child(2)',
    unit: 'kWh',
  },
  gridEnergyExported: {
    selector: '.toptext-info > div > .maidian-info > div:nth-child(2) > span:nth-child(2)',
    unit: 'kWh',
  },
  housePower: {
    selector: '.animation > .wrap > .grid-side > .content > span',
    unit: 'kW',
  },
  houseEnergyConsumed: {
    selector: '.animation > .wrap > .grid-side > .use-power > span:nth-child(2)',
    unit: 'kWh',
  },
};
