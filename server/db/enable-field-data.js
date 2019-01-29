const connection = require('./connection');

async function enableFieldData() {
  const promises = [];
  promises.push(connection.enableFieldData('state_id', 'population'));
  promises.push(connection.enableFieldData('product_id', 'consumers'));
  promises.push(connection.enableFieldData('state', 'consumers'));
  await Promise.all(promises);
}

enableFieldData();
