import { FieldConfig } from "./types";

export const FIELD_CONFIG: FieldConfig = {
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
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.echarts-electrovalence-energy-box.gl-content2 > div > div > div.energy-balance > div.stored-energy-box > div.energy-data > div:nth-child(1) > div:nth-child(1) > div.gl-content-item-content > span > span",
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
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(4) > span",
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
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(2) > span",
    unit: "kW",
    value: null,
    scrapedAt: null,
    error: null,
  },
  gridEnergyImported: {
    selector:
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(2) > div > div:nth-child(2) > p.info-val.data-blur",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
  gridEnergyExported: {
    selector:
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.echarts-electrovalence-energy-box.gl-content2 > div > div > div.energy-balance > div.stored-energy-box > div.echarts-box > div.energy-balance-echarts-data > div:nth-child(2) > div.value-percent-box > span:nth-child(1)",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
  housePower: {
    selector:
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(5) > span",
    unit: "kW",
    value: null,
    scrapedAt: null,
    error: null,
  },
  houseEnergyConsumed: {
    selector:
      "#general-situation > div:nth-child(1) > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div.flow-diagram-box > div:nth-child(2) > div > div.energy-storage > div:nth-child(5) > div > div > p.info-val.data-blur",
    unit: "kWh",
    value: null,
    scrapedAt: null,
    error: null,
  },
};
