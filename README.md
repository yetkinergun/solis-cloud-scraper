# Solis Cloud Scraper

A dockerised nodejs app that scrapes data from Solis Cloud every minute.

## How to run

- Clone repo
- Create a `.env` file in the root directory:

```
SOLIS_URL=https://soliscloud.com
SOLIS_USERNAME=your-solis-cloud-login@domain.com
SOLIS_PASSWORD=your-solis-cloud-password
```

- Run `docker-compose up -d`
- Access data from `http://localhost:8080/data`

## Data scraped

* Today's solar energy generated
* Current solar power
* Current battery charge level
* Current battery power
* Today's battery charging
* Today's battery discharging
* Today's energy import from grid
* Today's energy export to grid
* Current grid power
* Current house load power
