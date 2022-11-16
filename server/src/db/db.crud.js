const connectToCluster = require('./db.server.js');
require('dotenv').config();

module.exports = {
  createDocument: async (collectionName, object) => {
    let mongoClient;

    try {
      mongoClient = await connectToCluster();

      const db = mongoClient.db(process.env.DB_NAME);
      const collection = db.collection(collectionName);

      await collection.insertOne(object);
    } finally {
      mongoClient.close();
    }
  },
};
