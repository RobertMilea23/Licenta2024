import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3005/users/${userId}`)
      .then(response => setUser(response.data))
      .catch(err => console.log(err));
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {/* Add more user-specific content here */}
    </div>
  );
};

export default UserDashboard;