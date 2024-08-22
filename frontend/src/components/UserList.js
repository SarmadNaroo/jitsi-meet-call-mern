// src/components/UserList.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig'; // Use the axios instance

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user._id} onClick={() => onUserSelect(user._id)}>
          {user.username}
        </li>
      ))}
    </ul>
  );
};

export default UserList;
