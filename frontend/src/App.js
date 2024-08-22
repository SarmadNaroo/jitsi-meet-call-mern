import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext.js';
import Login from './components/Login';
import Call from './components/Call';

const App = () => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Login />;
  }

  return (
    <div>
      <Call />
    </div>
  );
};

const AppWithProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProvider;
