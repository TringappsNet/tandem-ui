import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
import { axiosInstance } from "../AxiosInterceptor/AxiosInterceptor";
import BrokerGrid from "../Grids/broker-grid/BrokerGrid";
import { RootState } from "../Redux/reducers";
import { useDispatch, useSelector } from "react-redux";

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

        <span className={styles.tag}>Total Deals: {deal.totalDeals}</span>
        <span className={styles.tag}>Deals Opened: {deal.dealsOpened}</span>
        <span className={styles.tag}>
          Deals In Progress: {deal.dealsInProgress}
        </span>
        <span className={styles.tag}>Deals Closed: {deal.dealsClosed}</span>
        <span className={styles.tag}>
          Total Commission: {deal.totalCommission}
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
