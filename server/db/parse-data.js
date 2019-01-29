const csv = require('csvtojson');
const request = require('request');
const parse = require('csv-parse');
const stringify = require('csv-stringify');
const transform = require('stream-transform');
const fsxtra = require('fs-extra-promise');
const EventEmitter = require('events');
const fs = require('fs');
const { fork } = require('child_process');

class MyEmitter extends EventEmitter {}
const event = new MyEmitter();


const constants = require('../constants');
const connection = require('./connection');

function createPopulationJSON() {
  const extractFields = [
    'NAME',
    'STNAME',
    'POPESTIMATE2010',
    'POPESTIMATE2011',
    'POPESTIMATE2012',
    'POPESTIMATE2013',
    'POPESTIMATE2014',
    'POPESTIMATE2015',
    'POPESTIMATE2016',
    'POPESTIMATE2017',
  ];

  const outputFields = [
    'CITY',
    'STNAME',
    'POPESTIMATE2010',
    'POPESTIMATE2011',
    'POPESTIMATE2012',
    'POPESTIMATE2013',
    'POPESTIMATE2014',
    'POPESTIMATE2015',
    'POPESTIMATE2016',
    'POPESTIMATE2017',
    'state_id',
  ];

  const csvOptions = {
    colParser: { 'ZIP code': 'string' },
    checkType: true,
    noheader: false,
    ignoreColumns: /(ignore)/,
  };

  const destinationFilename = 'population.json';
  process.stdout.write(`Fetching data from ${constants.POPULATION_DATA_CSV_FILE_LOCATION}\n\n\n`);

  request.get(constants.POPULATION_DATA_CSV_FILE_LOCATION)
    .pipe(parse({
      delimiter: ',',
      columns: true,
    }))
    .pipe(transform(data => extractFields.map(nm => data[nm])))
    .pipe(transform((data) => {
      const dArr = data.toString().split(',');
      const city = dArr[0].trim().replace(/\s+/g, '_').toLowerCase();
      const state = dArr[1].trim().replace(/\s+/g, '_').toLowerCase();

      if (city === state) {
        data.push(state);
      }
      return data;
    }))
    .pipe(stringify({
      delimiter: ',',
      relax_column_count: true,
      skip_empty_lines: true,
      header: true,
      columns: outputFields,
    }))
    .pipe(csv(csvOptions))
    .pipe(transform((data) => {
      const indexString = '{ "index": {} }';
      return `${indexString}\n${data}`;
    }))
    .on('data', () => process.stdout.write('.'))
    .pipe(fsxtra.createWriteStream(`${__dirname}/data/${destinationFilename}`))
    .on('finish', () => event.emit('populationComplete', () => process.stdout.write(`${destinationFilename} successfully created`)))
    .on('error', err => console.error(err));
}

function createComplaintJSON() {
  let limit = 1;
  let datas = [];
  let step = 1;
  const size = 50000;

  const extractFields = [
    'Date received',
    'Product',
    'Sub-product',
    'Issue',
    'Sub-issue',
    'Consumer complaint narrative',
    'Company public response',
    'Company',
    'State',
    'ZIP code',
    'Tags',
    'Consumer consent provided?',
    'Submitted via',
    'Date sent to company',
    'Company response to consumer',
    'Timely response?',
    'Consumer disputed?',
    'Complaint ID',
  ];

  // const outputFields = [
  //   'Date received',
  //   'Product',
  //   'Sub-product',
  //   'Issue',
  //   'Sub-issue',
  //   'Consumer complaint narrative',
  //   'Company public response',
  //   'Company',
  //   'State',
  //   'ZIP code',
  //   'Tags',
  //   'Consumer consent provided?',
  //   'Submitted via',
  //   'Date sent to company',
  //   'Company response to consumer',
  //   'Timely response?',
  //   'Consumer disputed?',
  //   'Complaint ID',
  //   'product_id',
  //   'subproduct_id',
  // ];

  const outputFields = extractFields.map(field => field.toLowerCase().replace(/\s+/g, '_'));
  outputFields.push('product_id');
  outputFields.push('subproduct_id');


  const csvOptions = {
    colParser: { 'ZIP code': 'string' },
    checkType: true,
    noheader: false,
    ignoreColumns: /(ignore)/,
  };

  const destinationFilename = 'complaints.json';
  process.stdout.write(`Fetching data from ${constants.CONSUMER_COMPLAINT_CSV_FILE_LOCATION}\n\n\n`);

  request.get(constants.CONSUMER_COMPLAINT_CSV_FILE_LOCATION)
    .pipe(parse({
      delimiter: ',',
      columns: true,
    }))
    .pipe(transform(data => extractFields.map(nm => data[nm])))
    .pipe(transform((data) => {
      const dArr = data.toString().split(',');
      let subProductIdIndex = 2;
      let productValue = dArr[1];
      if (productValue === 'Credit reporting') {
        productValue = `${productValue}${dArr[2]}${dArr[3]}`;
        subProductIdIndex = 4;
      }

      const productId = productValue.trim().replace(/\s+/g, '_').toLowerCase();
      const subproductId = dArr[subProductIdIndex].trim().replace(/\s+/g, '_').toLowerCase();

      data.push(productId);
      data.push(subproductId);
      return data;
    }))
    .pipe(stringify({
      delimiter: ',',
      relax_column_count: true,
      skip_empty_lines: true,
      header: true,
      columns: outputFields,
    }))
    .pipe(csv(csvOptions))
    .pipe(transform((data) => {
      const indexString = '{ "index": {} }';
      return `${indexString}\n${data}`;
    }))
    .on('data', (data) => {
      limit += 1;
      datas.push(data);
      process.stdout.write('.');

      if (limit > size) {
        limit = 1;
        fsxtra.writeFile(`${__dirname}/data/${destinationFilename}.${step}.json`, datas.join(''));
        console.log(`${__dirname}/data/${destinationFilename}.${step}.json was created.`);

        step += 1;
        datas = [];
      }
      return data;
    })
    .on('end', () => {
      if (limit > 0) {
        fsxtra.writeFile(`${__dirname}/data/${destinationFilename}.${step}.json`, datas.join(''));
        console.log(`${__dirname}/data/${destinationFilename}.${step}.json was created.`);
        console.log(`theBigJSONFile was divided into ${step} files.`);
      }
    })
    .on('finish', () => event.emit('complaintsComplete', () => process.stdout.write(`${destinationFilename} successfully created`)))
    .on('error', err => console.log(err));
}

async function parseAndLoadData() {
  try {
    console.log('Preparing to fetch, transform and load data.  This might take several minutes...'); // eslint-disable-line no-console
    const dbUp = await connection.checkConnection();
    if (dbUp) {
      await connection.resetIndices();

      fsxtra.mkdir(`${__dirname}/data/`);

      createPopulationJSON();
      createComplaintJSON();

      event.on('populationComplete', () => {
        console.log('Preparing to bulk load population data'); // eslint-disable-line no-console
        connection.client.bulk({
          maxRetries: 5,
          index: connection.indices.population.index,
          type: connection.indices.population.type,
          body: fs.readFileSync(`${__dirname}/data/population.json`, 'utf-8'),
        });
      });

      event.on('complaintsComplete', () => {
        console.log('complain processing finish event fired and received...');
        // const loadFork = fork('./load-data.js');
        const loadFork = fork(`${__dirname}/load-data.js`);
        loadFork.send('loadFork');
        loadFork.on('message', (msg) => {
          console.log('result from the loadFork call: ');
          console.log(msg);
          process.exit(0);
        });
      });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// module.exports = parseAndLoadData;
parseAndLoadData();
