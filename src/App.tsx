import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Component/Login/Login';
import DashboardComp from './Component/Dashboard/DashboardComp';
import './App.css';
import Registration from './Component/Registration/Registration';
import ForgotPassword from './Component/ForgotPassword/ForgotPassword';
import DealForm from './Component/Milestone/Milestone';
import ChangePassword from './Component/ChangePassword/ChangePassword';
import Cards from './Component/Dashboard/Cards';

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
    // const storedToken = "aces"
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
        <Route path="/milestone" element={<DealForm />} />
        <Route path="/change" element={<ChangePassword />} />
        <Route path="/dashboard" element={accessToken ? <DashboardComp accessToken={accessToken} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/cards" element={<Cards onLogout={handleLogout} />} />

      </Routes>
    </Router>
  );
};

export default App;
