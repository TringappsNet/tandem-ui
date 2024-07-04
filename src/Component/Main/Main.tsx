import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
import axiosInstance from "../AxiosInterceptor/AxiosInterceptor";
import BrokerGrid from "../Grids/broker-grid/broker-grid";

type Deal = {
    totalDeals: number;
    dealsOpened: number;
    dealsInProgress: number;
    dealsClosed: number;
    totalCommission: number;
};

const Main: React.FC = () => {
    const [deal, setDeal] = useState<Deal | null>(null);

    const fetchDeals = async () => {
        try {
          const response = await axiosInstance.get("/deals");
          console.log(response.data);
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
                {deal && (
                    <React.Fragment>
                        <span className={styles.tag}>Total Deals: {deal.totalDeals}</span>
                        <span className={styles.tag}>
                            Deals Opened: {deal.dealsOpened}
                        </span>
                        <span className={styles.tag}>
                            Deals In Progress: {deal.dealsInProgress}
                        </span>
                        <span className={styles.tag}>
                            Deals Closed: {deal.dealsClosed}
                        </span>
                        <span className={styles.tag}>
                            Total Commission: {deal.totalCommission}
                        </span>
                    </React.Fragment>
                )}
            </div>
            {/* <br></br> */}
            <h1 className={styles.b_title}>
                Brokers
            </h1>
            {/* <br></br> */}
            <div>
                <BrokerGrid />
            </div>
        </>
    );
}
export default Main;
