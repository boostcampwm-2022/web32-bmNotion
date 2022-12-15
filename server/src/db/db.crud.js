const connectToCluster = require('./db.server');
const dbConfig = require('../db.config.json');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const taskQueue = [];

const createDocument = async (collectionName, object) => {
  let mongoClient;
  let result;

  try {
    mongoClient = await connectToCluster();

    const db = mongoClient.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);

    result = await collection.insertOne(object);
  } finally {
    mongoClient.close();
  }

  return result;
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

const updateOneDocument = async (collectionName, queryCriteria, queryInDocument) => {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();

    const db = mongoClient.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);

    await collection.updateOne(queryCriteria, queryInDocument);
  } finally {
    mongoClient.close();
  }
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

const saveTaskBulk = (task) => {
  taskQueue.push(task);
};

const writeBulk = async (collectionName, bulks) => {
  let mongoClient;

  try {
    mongoClient = await connectToCluster();

    const db = mongoClient.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);

    await collection.bulkWrite(bulks);
  } finally {
    mongoClient.close();
  }
};

const readQueue = () => {
  setInterval(async () => {
    if (taskQueue.length === 0) return;
    const taskQueueCopy = taskQueue.splice(0);
    const queries = taskQueueCopy.reduce((pre, cur)=>{
      const now = new Date().toUTCString();
      const setInfoBulk = {
        updateOne: {
          filter: {
            _id: ObjectId(cur.pageid),
          },
          update: {
            $set: { lasteditedtime: now },
            $addToSet: { participants: cur.userid },
          },
        },
      };
      return [...pre, setInfoBulk, ...cur.query];
    }, []);
    await writeBulk(dbConfig.COLLECTION_PAGE, queries);
    taskQueueCopy.forEach((task) => {
      task.sse.emit(task.pageid, task.tasks, task.userid, task.title)
    });
    console.log(taskQueueCopy);
  },1000);
} ;

module.exports = {
  createDocument,
  readAllDocument,
  readOneDocument,
  deleteOneDocument,
  updateOneDocument,
  writeBulk,
  saveTaskBulk,
  readQueue,
};
