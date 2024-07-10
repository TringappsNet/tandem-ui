import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Component/Login/Login";
import Registration from "./Component/Registration/Registration";
import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
import ChangePassword from "./Component/ChangePassword/ChangePassword";
import Milestone from "./Component/DealForm/dealForm";
import Dashboard from "./Component/NewDashboard/Dashboard";
import Support from "./Component/Support/Support";
import { AxiosInterceptor } from "./Component/AxiosInterceptor/AxiosInterceptor";
import "./App.css";

const App: React.FC = () => {
  // const [accessToken, setAccessToken] = useState<string | null>(
  //   localStorage.getItem("accessToken")
  // );

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("accessToken");
  //   if (storedToken) {
  //     setAccessToken(storedToken);
  //   }
  // }, []);

  const handleCloseDialog = () => {
    console.log("Dialog closed");
  };

  return (
    <Router>
      <AxiosInterceptor>
        <Routes>
          {/* <Route
            path="/"
            index
            element={accessToken ? <Navigate to="/dashboard" /> : <Login />}
          /> */}
          <Route path="/registerform" element={<Registration />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/change" element={<ChangePassword />} />
          <Route
            path="/dashboard"
            element={
              localStorage.getItem("accessToken") != null ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/mile" element={<Milestone />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/support"
            element={<Support onCloseDialog={handleCloseDialog} />}
          />
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </AxiosInterceptor>
    </Router>
  );
};

export default App;
