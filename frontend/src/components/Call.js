import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketProvider'; // Import SocketContext
import axiosInstance from '../axiosConfig';

const Call = () => {
  const { userId, logout } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);

  useEffect(() => {
    // Fetch the list of users
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    if (socket) {
      // Listen for incoming calls
      socket.on('call', ({ roomName, caller }) => {
        console.log(`Incoming call from ${caller} to join room ${roomName}`);
        setIncomingCall({ roomName, caller });
      });

      // Handle the start of a call (for the caller)
      socket.on('callStarted', ({ roomName }) => {
        console.log(`Call started, joining room ${roomName}`);
        window.location.href = `https://meet.jit.si/${roomName}`; // Automatically join the room
      });

      // Clean up socket listeners when the component unmounts
      return () => {
        socket.off('call');
        socket.off('callStarted');
      };
    }
  }, [socket]);

  // Function to initiate a call
  const startCall = (recipientId) => {
    if (socket) {
      socket.emit('call', { recipientId });
      console.log("startcall clicked");
    }
  };

  // Function to accept an incoming call
  const acceptCall = () => {
    if (incomingCall) {
      console.log(`Accepting call, joining room ${incomingCall.roomName}`);
      window.location.href = `https://meet.jit.si/${incomingCall.roomName}`; // Join the room
    }
  };


  return (
    <div>
      <h2>Username: {username} UserID: {userId} </h2>
      <button onClick={() => logout()}>Logout</button>
      <h3>Select a user to call:</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => startCall(user._id)}>Call</button>
          </li>
        ))}
      </ul>

      {incomingCall && (
        <div>
          <p>Incoming call from {incomingCall.caller}</p>
          <button onClick={acceptCall}>Accept Call</button>
        </div>
      )}
    </div>
  );
};

export default Call;
