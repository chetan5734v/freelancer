const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    tokens: {
        type: Number,
        default: 5 // New users get 5 free tokens
    },
    tokenHistory: [{
        type: {
            type: String,
            enum: ['add', 'deduct'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        purpose: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        balance: {
            type: Number,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {
    userSchema,
    UserModel
};