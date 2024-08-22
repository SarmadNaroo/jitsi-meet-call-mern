import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext'; // Adjust import path as needed

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userId) {
      const socketConnection = io('http://localhost:5000', {
        query: { userId }
      });
      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
