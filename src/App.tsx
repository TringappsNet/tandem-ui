import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Component/Login/Login';
import Dashboard from './Component/Dashboarad/Dashboard';
import './App.css';
import Registration from './Component/Registration/Registration';
import ForgotPassword from './Component/ForgotPassword/ForgotPassword';
import StepperComponent from './Component/Milestone/Milestone';

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));

  const handleLoginSuccess = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  return (
      <Router>
        <Routes>
          <Route path="/" element={accessToken ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/registerform" element={<Registration />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/milestone" element={<StepperComponent />} />
          <Route path="/dashboard" element={accessToken ? <Dashboard accessToken={accessToken} onLogout={handleLogout} /> : <Navigate to="/" />} />
          </Routes>
      </Router>
  );
};

export default App;
