import React, { useEffect, useState } from 'react';

function RED() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <>
      <p>You're logged in as {user.username}</p>
    </>
  );
}

export default RED;
