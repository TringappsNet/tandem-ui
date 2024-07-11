import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
import { axiosInstance } from "../AxiosInterceptor/AxiosInterceptor";
import BrokerGrid from "../Grids/broker-grid/BrokerGrid";
import { RootState } from "../Redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";import 'react-circular-progressbar/dist/styles.css';

type Deal = {
  totalDeals: number;
  dealsOpened: number;
  dealsInProgress: number;
  dealsClosed: number;
  totalCommission: number;
};

const Main: React.FC = () => {
  const userdetails = useSelector((state: RootState) => state.auth.user);

  const [deal, setDeal] = useState<Deal>({
    totalDeals: 0,
    dealsOpened: 0,
    dealsInProgress: 0,
    dealsClosed: 0,
    totalCommission: 0,
  });

  const fetchDeals = async () => {
    try {
      const response = await axiosInstance.get("/deals/dealsData");
      const deal: Deal = {
        totalDeals: response.data.totalDeals,
        dealsOpened: response.data.dealsOpened,
        dealsInProgress: response.data.dealsInProgress,
        dealsClosed: response.data.dealsClosed,
        totalCommission: response.data.totalCommission,
      };
      setDeal(deal);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <>
      <div className={styles.tagsContainer}>


<p className={styles.welcome}>
                 Welcome, {" "}
                {userdetails
                  ? `${userdetails.firstName} ${userdetails.lastName} !`
                  : "Guest"}
              </p>

        <span className={styles.tag}>Total Deals: {deal.totalDeals}
        <div style={{ width: 55, height: 55 }}>
  <CircularProgressbarWithChildren  value={deal.totalDeals} styles={buildStyles({
          textColor: "red",
          pathColor: "rose",
        })} >
  <div style={{ fontSize: 10, marginTop: -1 }} >

  <strong>{deal.totalDeals}%</strong> 
  </div>

  </CircularProgressbarWithChildren>

</div>
        </span>
        
        <span className={styles.tag}>Deals Opened: {deal.dealsOpened}
        <div style={{ width: 55, height: 55 }}>
        <CircularProgressbarWithChildren  value={deal.dealsOpened} >
  <div style={{ fontSize: 10, marginTop: -1 }}>

  <strong>{deal.totalDeals}%</strong> 
  </div>

  </CircularProgressbarWithChildren></div>
        </span>
        <span className={styles.tag}>
          Deals In Progress: {deal.dealsInProgress}
          <div style={{ width: 55, height: 55 }}>
          <CircularProgressbarWithChildren  value={deal.dealsInProgress} >
  <div style={{ fontSize: 10, marginTop: -1 }}>

  <strong>{deal.dealsInProgress}%</strong> 
  </div>

  </CircularProgressbarWithChildren></div>
        </span>
        <span className={styles.tag}>Deals Closed: {deal.dealsClosed}
        <div style={{ width: 55, height: 55 }}>
        <CircularProgressbarWithChildren  value={deal.dealsClosed} >
  <div style={{ fontSize: 10, marginTop: -1 }}>

  <strong>{deal.dealsClosed}%</strong> 
  </div>

  </CircularProgressbarWithChildren></div>
        </span>
        <span className={styles.tag}>
          Total Commission: {deal.totalCommission}
          <div style={{ width: 55, height: 55 }}>
          <CircularProgressbarWithChildren  value={deal.totalCommission} >
  <div style={{ fontSize: 10, marginTop: -1 }}>

  <strong>{deal.totalCommission}%</strong> 
  </div>

  </CircularProgressbarWithChildren></div>
        </span>
      </div>
      <h1 className={styles.b_title}>Users</h1>
      <div>
        <BrokerGrid />
      </div>
    </>
  );
};

export default Main;
