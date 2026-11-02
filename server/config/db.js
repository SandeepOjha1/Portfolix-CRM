const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini_crm';
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    console.error(`[MongoDB] Ensure MongoDB service is running on 127.0.0.1:27017 or provide MONGODB_URI in .env`);
    // Do not kill the process immediately so health/status checks can respond with informative message
  }
};

module.exports = connectDB;
