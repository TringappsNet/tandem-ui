import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Login from './Component/Login/Login';
import Dashboard from './Component/Dashboarad/Dashboard';
import './App.css';
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
          {/* <Route path="/registerform" element={<Registration />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </SnackbarProvider>

  );
};

export default App;