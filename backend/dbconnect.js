const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/dbconnct';

mongoose.connect(uri).then(() => {
    console.log('✅ Database connected successfully');
}).catch((err) => {
    console.error('❌ Database connection failed:', err);
});

