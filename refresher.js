const client = require('http');

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('scraper.properties');

const url = properties.get('service.refresh.url');
const refreshIntervalMins = properties.get('refresh.interval-mins');

async function callDataRefresh() {
  console.log('Calling refresh');
  await getRemoteData(url)
    .then((response) => {
      if (response === 'ok') {
        console.log('Data refreshing');
      } else {
        console.log('Unknown response to refresh - [' + response + ']');
      }
    })
    .catch((err) => {
      console.log('Error with refresh call -  [' + err + ']');
    });
}

const getRemoteData = (url) =>
  new Promise((resolve, reject) => {
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err));
  });

callDataRefresh();
setInterval(callDataRefresh, refreshIntervalMins * 60 * 1000);
