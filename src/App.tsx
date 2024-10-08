import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './Component/Login/Login';
import Registration from './Component/Registration/Registration';
import ForgotPassword from './Component/ForgotPassword/ForgotPassword';
import ChangePassword from './Component/ChangePassword/ChangePassword';
import Dashboard from './Component/Dashboard/Dashboard';
import Support from './Component/Support/Support';
import { AxiosInterceptor } from './Component/AxiosInterceptor/AxiosInterceptor';
import PrivateRoute from './Component/PrivateRoute/PrivateRoute';
import './App.css';
import { Provider } from 'react-redux';
import store from './Component/Redux/store/index';


const RegistrationRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const hasInviteToken = new URLSearchParams(window.location.search).get('inviteToken');
  return hasInviteToken ? element : <Navigate to="/" replace />;
};

const ChangePassowrdRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const hasInviteToken = new URLSearchParams(window.location.search).get('resetToken');
  return hasInviteToken ? element : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const handleCloseDialog = () => {
    console.log('Dialog closed');
  };

  return (
    <Provider store={store}>
      <Router>
        <AxiosInterceptor>
          <Routes>
            <Route
              path="/"
              element={accessToken ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/registerform"
              element={
                <RegistrationRoute element={<Registration />} />
              }
            />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/change"
              element={
                <ChangePassowrdRoute element={<ChangePassword />} />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/support"
                element={<Support onCloseDialog={handleCloseDialog} />}
              />
              <Route path="/*" element={<Dashboard />} />
            </Route>
          </Routes>
        </AxiosInterceptor>
      </Router>
    </Provider>
  );
};

export default App;
