const connectToCluster = require('./db.server');
require('dotenv').config();

const createDocument = async (collectionName, object) => {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();

    const db = mongoClient.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);

    await collection.insertOne(object);
  } finally {
    mongoClient.close();
  }
};

const findAllDocument = async (collection, queryCriteria) => {
  return await collection.find(queryCriteria).toArray();
};

const readAllDocument = async (collectionName, queryCriteria) => {
  let mongoClient;
  let result;

  try {
    mongoClient = await connectToCluster();

    const db = mongoClient.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);

    result = await findAllDocument(collection, queryCriteria);
  } finally {
    mongoClient.close();
  }

  return result;
};

const findOneDocument = async (collection, queryCriteria) => {
  return await collection.findOne(queryCriteria);
};

const readOneDocument = async (collectionName, queryCriteria) => {
  let mongoClient;
  let result;

  try {
    mongoClient = await connectToCluster();

    const db = mongoClient.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);

    result = await findOneDocument(collection, queryCriteria);
  } finally {
    mongoClient.close();
  }

  return result;
};

const deleteOneDocument = async (collectionName, queryCriteria) => {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();

    const db = mongoClient.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);

    await collection.deleteOne(queryCriteria);
  } finally {
    mongoClient.close();
  }
};

module.exports = {
  createDocument,
  readAllDocument,
  readOneDocument,
  deleteOneDocument,
};
