import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
import { axiosInstance } from "../AxiosInterceptor/AxiosInterceptor";
import BrokerGrid from "../Grids/broker-grid/BrokerGrid";
import { RootState } from "../Redux/reducers";
import {  useSelector } from "react-redux";
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";import 'react-circular-progressbar/dist/styles.css';
import logo1 from "../../assests/rup.png";
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

                 <div className={styles.welcomefade}>
                 Welcome, {" "}

                 {userdetails
                  ? `${userdetails.firstName} ${userdetails.lastName} !`
                  : "Guest"}
                 </div>
              
              </p>



          <span className={styles.tag}>
            <p className={styles.totalDeals}>
            Total Deals:

            </p>

            <p className={styles.deals}> 
              <p className={styles.totalDeal}>
                {deal.totalDeals}</p>


                   <p style={{ width: 50, height: 50 }}>

                    <CircularProgressbarWithChildren  value={deal.totalDeals} styles={buildStyles({
                            textColor: "red",
                            pathColor: "rose",
                          })} >
                    <div style={{ fontSize: 10, marginTop: -1 }} >
                    <strong>{deal.totalDeals}%</strong> 

                    </div>

                    </CircularProgressbarWithChildren>

                  </p>
            </p>
         
          </span>


          <span className={styles.tag}>
            <p className={styles.totalDeals}>
            Deals Opened:

            </p>
            {/* <p className={styles.design}>
            </p> */}
            
            <p className={styles.deals}> 
              <p className={styles.totalDeal}>
                {deal.dealsOpened}</p>
                   <p style={{ width: 50, height: 50 }}>
                    <CircularProgressbarWithChildren   value={deal.dealsOpened} styles={buildStyles({
                            textColor: "red",
                            pathColor: "rose",
                          })}
                        >
                    <div style={{ fontSize: 10, marginTop: -1 }} >

                    <strong>{deal.dealsOpened}%</strong> 
                    </div>

                    </CircularProgressbarWithChildren>

                  </p>
                  
            </p>
            
          </span>
        


          <span className={styles.tag}>
            <p className={styles.totalDeals}>
            Deals In Progress
            </p>

            <p className={styles.deals}> 
              <p className={styles.totalDeal}>
                {deal.dealsInProgress}</p>
                   <p style={{ width: 50, height: 50 }}>
                    <CircularProgressbarWithChildren  value={deal.dealsInProgress} styles={buildStyles({
                            textColor: "red",
                            pathColor: "rose",
                          })} >
                    <div style={{ fontSize: 10, marginTop: -1 }} >

                    <strong>{deal.dealsInProgress}%</strong> 
                    </div>

                    </CircularProgressbarWithChildren>

                  </p>
            </p>
         
          </span>




          <span className={styles.tag}>
            <p className={styles.totalDeals}>
            Deals Closed            </p>

            <p className={styles.deals}> 
              <p className={styles.totalDeal}>
                {deal.dealsClosed}</p>
                   <p style={{ width: 50, height: 50 }}>
                    <CircularProgressbarWithChildren  value={deal.dealsClosed} styles={buildStyles({
                            textColor: "red",
                            pathColor: "rose",
                          })} >
                    <div style={{ fontSize: 10, marginTop: -1 }} >

                    <strong>{deal.dealsClosed}%</strong> 
                    </div>

                    </CircularProgressbarWithChildren>

                  </p>
            </p>
         
          </span>

        

        
          <span className={styles.tag}>
            <p className={styles.totalDeals}>
            Total Commission         </p>

            <p className={styles.deals}> 
              <p className={styles.totalDeal}>
                ${deal.totalCommission}</p>
                   <p style={{ width: 50, height: 50 }}>
                    <div >
                    <div style={{ fontSize: 10, marginTop: -1 }} >

                    {/* <strong>{deal.totalCommission}$</strong>  */}
                    <img className={styles.img} src={logo1} alt="img "></img>
                    </div>

                    </div>

                  </p>
            </p>
         
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
