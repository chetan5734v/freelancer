const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userSchema } = require('./database/user');

const uri = 'mongodb://127.0.0.1:27017/dbconnct';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

mongoose.connect(uri).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.error('Database connection failed:', err);
});

const usermodel = mongoose.model("users", userSchema);
console.log('--- SIGNUP hit ---');
// move this outside

async function SIGNUP(req, res) {
    try {
        const { firstName, lastName, username, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check password strength
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const exists = await usermodel.exists({ username });
        if (exists) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user with 5 free tokens
        const newUser = await usermodel.create({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            tokens: 5,
            tokenHistory: [{
                type: 'add',
                amount: 5,
                purpose: 'Welcome bonus - New user signup',
                date: new Date(),
                balance: 5
            }]
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: newUser._id,
                username: newUser.username
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: "User created successfully! You received 5 free tokens to get started.",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                tokens: newUser.tokens
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    SIGNUP
};
