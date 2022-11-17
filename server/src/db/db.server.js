const { MongoClient } = require('mongodb');
require('dotenv').config();

const connectToCluster = async () => {
  let mongoClient;

  try {
    mongoClient = new MongoClient(process.env.DB_CONNECTION_STRING);
    await mongoClient.connect();

    return mongoClient;
  } catch (error) {
    process.exit();
  }
};

module.exports = connectToCluster;
