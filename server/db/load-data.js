const fs = require('fs');
const { promisify } = require('util');
const connection = require('./connection');

const readfile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

async function loadAsync(file) {
  const consumerJSON = await readfile(`${__dirname}/data/${file}`, 'utf-8');
  return new Promise((resolve, reject) => {
    connection.client.bulk({
      maxRetries: 5,
      index: connection.indices.consumers.index,
      type: connection.indices.consumers.type,
      body: consumerJSON,
    }, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

async function iterateAndLoadFiles(files) {
  let count = files.length - 1;
  let processed = 0;
  try {
    while (count > -1) {
      console.log(`count: ${count}`);
      const filename = files[count];
      const done = await loadAsync(filename); // eslint-disable-line no-await-in-loop
      processed += done.items.length;
      console.log(`processed filename: ${filename}: ${done.items.length} records. ${processed} processed so far.`);
      count -= 1;
    }
    return processed;
  } catch (err) {
    console.error('iterateAndLoadFiles error: ', err);
    throw err;
  }
}
process.on('message', async () => {
  try {
    const files = await readdir(`${__dirname}/data/`, 'utf-8');
    console.log('ok got files!: ');
    console.log(files);
    files.splice(files.indexOf('population.json'));
    const returnMessage = await iterateAndLoadFiles(files);
    if (returnMessage) {
      process.send(returnMessage);
    }
  } catch (err) {
    throw err;
  }
});

process.on('error', (err) => {
  console.error('processing error: ', err);
  process.exit(1);
});
