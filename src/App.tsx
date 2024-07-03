import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Component/Login/Login';
import Registration from './Component/Registration/Registration';
import './App.css';
import ForgotPassword from './Component/ForgotPassword/ForgotPassword';
import ChangePassword from './Component/ChangePassword/ChangePassword';
import Milestone from '../src/Component/Milestone/Milestone';
import Cards from './Component/Cards/Cards';
import Dashboard from '../src/Component/NewDashboard/Dashboard';
// import Profile from './Component/Profile/profile';


const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));

  // const handleLoginSuccess = (token: string) => {
  //   setAccessToken(token);
  //   localStorage.setItem('accessToken', token);
  // };

  // const handleLogout = () => {
  //   setAccessToken(null);
  //   localStorage.removeItem('accessToken');
  // };

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
        <Route path="/" index element={accessToken ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/registerform" element={<Registration />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/change" element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard /> } />
        <Route path="/mile" element={<Milestone />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cards" element={<Cards />} />
        {/* <Route path="/profile" element={<Profile />} /> */}



      </Routes>
    </Router>
  );
};

export default App;
