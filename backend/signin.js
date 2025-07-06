const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userSchema } = require('./database/user');
require('./dbconnect'); // Use centralized database connection

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const usermodel = mongoose.model('users', userSchema);
async function SIGNIN(req, res) {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find the user
    const user = await usermodel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log("User authenticated successfully:", {
        username: user.username,
        _id: user._id.toString(),
      });

      res.status(200).json({
        message: "Authentication successful",
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } else {
      // Invalid password
      return res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  SIGNIN,
};