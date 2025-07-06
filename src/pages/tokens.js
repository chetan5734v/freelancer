import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';

function TokenDashboard() {
  const [userTokens, setUserTokens] = useState(0);
  const [tokenHistory, setTokenHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please sign in to view your tokens.');
      navigate('/signin');
      return;
    }

    fetchTokenData();
  }, [navigate]);

  const fetchTokenData = async () => {
    try {
      const user = getCurrentUser();

      // Fetch token balance
      const balanceResponse = await api.post('/tokens/balance', {
        username: user.username
      });
      setUserTokens(balanceResponse.data.tokens);

      // Fetch token history
      const historyResponse = await api.post('/tokens/history', {
        username: user.username
      });
      setTokenHistory(historyResponse.data.history);

    } catch (error) {
      console.error('Error fetching token data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseTokens = async (packageName) => {
    try {
      setPurchasing(true);
      const user = getCurrentUser();

      const response = await api.post('/tokens/purchase', {
        username: user.username,
        package: packageName
      });

      alert(`Successfully purchased ${response.data.tokensAdded} tokens!`);
      fetchTokenData(); // Refresh data
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      alert('Failed to purchase tokens. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const tokenPackages = [
    { name: 'basic', tokens: 10, price: 5, popular: false },
    { name: 'standard', tokens: 25, price: 10, popular: true },
    { name: 'premium', tokens: 50, price: 18, popular: false },
    { name: 'pro', tokens: 100, price: 30, popular: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading token data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label="Tokens">🪙</span>
                My Tokens
              </h1>
              <p className="text-gray-600 mt-2">Manage your FreelanceVerse tokens</p>
            </div>
            <button
              onClick={() => navigate('/homepage')}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Balance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Token balance">🪙</div>
            <h2 className="text-4xl font-bold text-blue-600 mb-2">{userTokens}</h2>
            <p className="text-xl text-gray-600">Available Tokens</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>• 1 token = Apply for a job</p>
              <p>• 1 token = Post a job</p>
            </div>
          </div>
        </div>

        {/* Token Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokenPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`bg-white rounded-lg border-2 p-6 relative ${pkg.popular ? 'border-blue-500' : 'border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {pkg.tokens}
                  </div>
                  <p className="text-gray-600 mb-4">Tokens</p>
                  <div className="text-2xl font-bold text-gray-900 mb-4">
                    ${pkg.price}
                  </div>
                  <button
                    onClick={() => handlePurchaseTokens(pkg.name)}
                    disabled={purchasing}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${pkg.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      } disabled:opacity-50`}
                  >
                    {purchasing ? 'Processing...' : 'Purchase'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
          </div>

          {tokenHistory.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4" role="img" aria-label="No history">📋</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No transactions yet</h3>
              <p className="text-gray-500">Your token transaction history will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tokenHistory.slice().reverse().map((transaction, index) => (
                <div key={index} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'add' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                      <span className="text-xl" role="img" aria-label={transaction.type}>
                        {transaction.type === 'add' ? '➕' : '➖'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.purpose}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()} at{' '}
                        {new Date(transaction.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'add' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {transaction.type === 'add' ? '+' : '-'}{transaction.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Balance: {transaction.balance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TokenDashboard;
