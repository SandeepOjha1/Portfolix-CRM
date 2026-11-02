const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

dotenv.config({ path: __dirname + '/../.env' });

const clearData = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini_crm';
    await mongoose.connect(connUri);
    console.log(`[Clear] Connected to MongoDB at ${connUri}`);

    const leadsDeleted = await Lead.deleteMany({});
    const activitiesDeleted = await Activity.deleteMany({});

    console.log(`[Clear] Successfully cleared ${leadsDeleted.deletedCount} leads and ${activitiesDeleted.deletedCount} activities.`);
    console.log('[Clear] Database lead count is now 0.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Clear Error]:', error);
    process.exit(1);
  }
};

clearData();
