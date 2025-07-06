const { UserModel } = require('./database/user');

// Get user's token balance
async function GET_USER_TOKENS(req, res) {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      tokens: user.tokens || 0
    });
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    res.status(500).json({ message: 'Error fetching token balance' });
  }
}

// Deduct tokens from user account
async function DEDUCT_TOKENS(username, amount, purpose) {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    if ((user.tokens || 0) < amount) {
      throw new Error('Insufficient tokens');
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      {
        $inc: { tokens: -amount },
        $push: {
          tokenHistory: {
            type: 'deduct',
            amount: amount,
            purpose: purpose,
            date: new Date(),
            balance: (user.tokens || 0) - amount
          }
        }
      },
      { new: true }
    );

    console.log(`Deducted ${amount} tokens from ${username} for ${purpose}`);
    return updatedUser.tokens;
  } catch (error) {
    console.error('Error deducting tokens:', error);
    throw error;
  }
}

// Add tokens to user account
async function ADD_TOKENS(username, amount, purpose) {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      {
        $inc: { tokens: amount },
        $push: {
          tokenHistory: {
            type: 'add',
            amount: amount,
            purpose: purpose,
            date: new Date(),
            balance: (user.tokens || 0) + amount
          }
        }
      },
      { new: true }
    );

    console.log(`Added ${amount} tokens to ${username} for ${purpose}`);
    return updatedUser.tokens;
  } catch (error) {
    console.error('Error adding tokens:', error);
    throw error;
  }
}

// Check if user has enough tokens
async function CHECK_TOKEN_BALANCE(username, requiredTokens) {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return false;
    }

    return (user.tokens || 0) >= requiredTokens;
  } catch (error) {
    console.error('Error checking token balance:', error);
    return false;
  }
}

// Get token transaction history
async function GET_TOKEN_HISTORY(req, res) {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      currentTokens: user.tokens || 0,
      history: user.tokenHistory || []
    });
  } catch (error) {
    console.error('Error fetching token history:', error);
    res.status(500).json({ message: 'Error fetching token history' });
  }
}

// Purchase tokens (mock implementation - integrate with payment gateway)
async function PURCHASE_TOKENS(req, res) {
  try {
    const { username, package: tokenPackage } = req.body;

    if (!username || !tokenPackage) {
      return res.status(400).json({ message: 'Username and package are required' });
    }

    // Token packages
    const packages = {
      basic: { tokens: 10, price: 5 },
      standard: { tokens: 25, price: 10 },
      premium: { tokens: 50, price: 18 },
      pro: { tokens: 100, price: 30 }
    };

    if (!packages[tokenPackage]) {
      return res.status(400).json({ message: 'Invalid token package' });
    }

    const selectedPackage = packages[tokenPackage];

    // Here you would integrate with a payment gateway
    // For now, we'll simulate successful payment

    const newBalance = await ADD_TOKENS(
      username,
      selectedPackage.tokens,
      `Purchased ${tokenPackage} package`
    );

    res.json({
      message: 'Tokens purchased successfully',
      tokensAdded: selectedPackage.tokens,
      newBalance: newBalance,
      package: tokenPackage,
      price: selectedPackage.price
    });
  } catch (error) {
    console.error('Error purchasing tokens:', error);
    res.status(500).json({ message: 'Error purchasing tokens' });
  }
}

module.exports = {
  GET_USER_TOKENS,
  DEDUCT_TOKENS,
  ADD_TOKENS,
  CHECK_TOKEN_BALANCE,
  GET_TOKEN_HISTORY,
  PURCHASE_TOKENS
};
