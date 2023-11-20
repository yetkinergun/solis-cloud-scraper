module.exports = {
  solarPower: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(1) > span',
    unit: 'kW',
  },
  solarEnergyGenerated: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(1) > div.capsule.capsule-l.capsule-pv > div > p.info-val',
    unit: 'kWh',
  },
  batteryChargeLevel: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(4) > div.battery-icon-box > div > p.battery-num',
    unit: '%',
  },
  batteryPower: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(4) > span',
    unit: 'kW',
  },
  batteryEnergyCharged: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(4) > div.capsule.capsule-l.capsule-discharge > div:nth-child(2) > p.info-val',
    unit: 'kWh',
  },
  batteryEnergyDischarged: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(4) > div.capsule.capsule-l.capsule-discharge > div:nth-child(3) > p.info-val',
    unit: 'kWh',
  },
  gridPower: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(2) > span',
    unit: 'kW',
  },
  gridEnergyImported: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > p.info-val',
    unit: 'kWh',
  },
  gridEnergyExported: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(3) > p.info-val',
    unit: 'kWh',
  },
  housePower: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(5) > span',
    unit: 'kW',
  },
  houseEnergyConsumed: {
    selector: '#general-situation > div > div.main > div.station-content > div.left-box > div.energy-storage-animation.gl-content2 > div:nth-child(2) > div > div > div:nth-child(5) > div > div > p.info-val',
    unit: 'kWh',
  },
};
