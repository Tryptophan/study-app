// Connect to mongodb using API user
import { MongoClient } from 'mongodb';

console.log('Mongo host: [%s], mongo port: [%s], api db: [%s].', process.env.MONGO_HOST, process.env.MONGO_PORT, process.env.MONGO_API_DB);
const url = 'mongodb://' + process.env.MONGO_API_USER + ':' + process.env.MONGO_API_PASS  + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_API_DB;

var db = null;

const mongo = {
  connect: (callback) => {
    MongoClient.connect(url, (err, client) => {
      if (err) return callback(err);

      db = client.db(process.env.MONGO_API_DB, (err) => {
        if (err) return callback(err);
        console.log('Connected and authenticated to mongodb.');
      });

      callback(null);
    });
  },
  getDb: () => {
    return db;
  }
};

export default mongo;
