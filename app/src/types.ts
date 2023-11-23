export type FieldName = |
  "solarPower" |
  "solarEnergyGenerated" |
  "batteryChargeLevel" | 
  "batteryPower" |
  "batteryEnergyCharged" |
  "batteryEnergyDischarged" |
  "gridPower" |
  "gridEnergyImported" |
  "gridEnergyExported" |
  "housePower" |
  "houseEnergyConsumed";

export type Unit = "kW" | "kWh" | "%";

export type ScrapedData = {
  [key in FieldName]: {
    selector: string;
    unit: Unit;
    value: number | null;
    scrapedAt: string | null;
    error: string | null;
  };
};
