require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI?.trim() || 'mongodb://127.0.0.1:27017/the_jsons';

    if (!process.env.MONGODB_URI) {
      console.warn(
        [
          'MONGODB_URI is not set. Falling back to local MongoDB:',
          `  ${uri}`,
          'To use the shared cluster, create `server/.env` and set MONGODB_URI.',
        ].join('\n')
      );
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.warn(
      [
        "Continuing without a database connection.",
        "Auth and data endpoints will fail until MongoDB is reachable.",
      ].join("\n")
    );
  }
};

module.exports = connectDB;