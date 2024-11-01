import { ScrapedData } from "./types";

export const scrapedData: ScrapedData = {
  solarPower: {
    selector:
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(1) > span",
    unit: "kW",
    value: null,
    scrapedAt: null,
    error: null,
  },
  solarEnergyGenerated: {
    selector:
      "#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(1) > div.capsule.capsule-l.capsule-pv > div > p.info-val",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
  batteryChargeLevel: {
    selector:
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(4) > div.battery-icon-box > div > p.battery-soc",
    unit: "%",
    value: null,
    scrapedAt: null,
    error: null,
  },
  batteryPower: {
    selector:
      "#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(4) > span",
    unit: "kW",
    value: null,
    scrapedAt: null,
    error: null,
  },
  batteryEnergyCharged: {
    selector:
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(4) > div.capsule.capsule-l.capsule-discharge > div:nth-child(2) > p.info-val.data-blur",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
  batteryEnergyDischarged: {
    selector:
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(4) > div.capsule.capsule-l.capsule-discharge > div:nth-child(3) > p.info-val.data-blur",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
  gridPower: {
    selector:
      "#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(2) > span",
    unit: "kW",
    value: null,
    scrapedAt: null,
    error: null,
  },
  gridEnergyImported: {
    selector:
      "#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > p.info-val",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
  gridEnergyExported: {
    selector:
      "#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(3) > p.info-val",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
  housePower: {
    selector:
      "#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(5) > span",
    unit: "kW",
    value: null,
    scrapedAt: null,
    error: null,
  },
  houseEnergyConsumed: {
    selector:
      "#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(5) > div > div > p.info-val",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
};
