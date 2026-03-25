import { connect } from "mongoose";

const mongo_Url = process.env.MONGODB_URL;
if (!mongo_Url) console.log("MongoDB URL not found");

let cache = global.mongoose;
if (!cache) {
  cache = global.mongoose = {
    connection: null,
    promise: null,
  };
}

const connectDB = async () => {
  if (cache.connection) return cache.connection;
  if (!cache.promise) {
    cache.promise = connect(mongo_Url!).then((c) => c.connection);
  }

  try {
    cache.connection = await cache.promise;
  } catch (error) {
    console.error(error);
  }

  return cache.connection;
};

export default connectDB;
