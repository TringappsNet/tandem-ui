import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Login from './Component/Login/Login';
import Dashboard from './Component/Dashboarad/Dashboard';
import './App.css';
import Registration from './Component/Registration/Registration';

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const handleLoginSuccess = (token: string) => {
    setAccessToken(token);
  };

  return (
    <SnackbarProvider maxSnack={4}>
      <Router>
        <Routes>
          <Route path="/" element={accessToken ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/registerform" element={<Registration />} />
          <Route path="/dashboard" element={accessToken ? <Dashboard accessToken={accessToken} /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </SnackbarProvider>

  );
};

export default App;