const elasticsearch = require('elasticsearch');
const rp = require('request-promise');
const logger = require('../logger');

const port = 9200;
const host = process.env.ES_HOST || 'localhost';
const client = new elasticsearch.Client({ host: { host, port } });

const indices = {
  population: {
    index: 'cities',
    type: 'population',
  },
  consumers: {
    index: 'consumers',
    type: 'complaints',
  },
};

// Check elasticsearch connection status
async function checkConnection() {
  let health;
  logger.info('Connecting to elasticsearch....');
  try {
    health = await client.cluster.health({}); // eslint-disable-line no-await-in-loop
    logger.info(health);
    return health;
  } catch (err) {
    logger.error('Connection failed!', err);
    throw err;
  }
}

/** Clear the index, recreate it, and add mappings */
function resetIndices() {
  logger.info('Resetting elasticsearch indicies....');
  Object.keys(indices).forEach(async (key) => {
    const { index } = indices[key];
    if (await client.indices.exists({ index })) {
      await client.indices.delete({ index });
    }
    await client.indices.create({ index });
  });
}


async function enableFieldData(field, index) {
  try {
    logger.info(`Enabling ${field} field data for ${index} index`);
    let uri = `http://${host}:${port}/`;

    if (index === 'population') {
      uri += 'cities/_mapping/population';
    } else if (index === 'consumers') {
      uri += 'consumers/_mapping/complaints';
    } else {
      throw new Error('Unspecified or unknown index');
    }

    const optionPartial = {
      method: 'PUT',
      json: true,
      uri,
    };

    const esReqBody = {
      properties: {
        [field]: {
          type: 'text',
          fielddata: true,
        },
      },
    };

    const options = Object.assign(optionPartial, { body: esReqBody });
    await rp(options);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  client,
  host,
  port,
  indices,
  checkConnection,
  resetIndices,
  enableFieldData,
};

// resetIndices();
