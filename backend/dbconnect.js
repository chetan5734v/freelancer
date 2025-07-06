const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dbconnct';

mongoose.connect(uri).then(() => {
    console.log('✅ Database connected successfully to:', uri.includes('mongodb.net') ? 'MongoDB Atlas' : 'Local MongoDB');
}).catch((err) => {
    console.error('❌ Database connection failed:', err);
});

