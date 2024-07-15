import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './dashboardTile.module.css';
import BrokerGrid from '../../Grids/broker-grid/BrokerGrid';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import logo1 from '../../../assests/rup.png';
import { fetchDeals } from '../../Redux/slice/deal/dealsDataSlice';
import { RootState } from '../../Redux/reducers';
import { AppDispatch } from '../../Redux/store';
import { fetchSites } from '../../Redux/slice/site/siteSlice';

const Main: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userdetails = useSelector((state: RootState) => state.auth.user);
  const deal = useSelector((state: RootState) => state.dealData.deal);

  useEffect(() => {
    dispatch(fetchDeals());
    dispatch(fetchSites());
  }, [dispatch]);

  return (
    <>
      <div className={styles.tagsContainer}>
        <p className={styles.welcome}>
          <div className={styles.welcomefade}>
            Welcome,{' '}
            {userdetails
              ? `${userdetails.firstName} ${userdetails.lastName} !`
              : 'Guest'}
          </div>
        </p>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>Total Deals:</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{deal.totalDeals}</p>
            <p style={{ width: 50, height: 50 }}>
            <CircularProgressbarWithChildren
                value={10}
                text={`${deal.totalDeals}%`}
                styles={buildStyles({
                  textColor: '#fff',
                  pathColor: '#3f98e8', // Blue theme color
                  trailColor: 'rgba(255, 255, 255, 0.1) !important',
                  backgroundColor: 'transparent',
                  // trailWidth: 10, // Increase trail width
                })}
              >
                <div style={{ fontSize: 10, marginTop: -1 }}>
                  <strong>{deal.totalDeals}%</strong>
                </div>
              </CircularProgressbarWithChildren>
            </p>
          </p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>Deals Opened:</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{deal.dealsOpened}</p>
            <p style={{ width: 50, height: 50 }}>
              <CircularProgressbarWithChildren
                value={deal.dealsOpened}
                styles={buildStyles({
                  textColor: 'red',
                  pathColor: 'rose',
                })}
              >
                <div style={{ fontSize: 10, marginTop: -1 }}>
                  <strong>{deal.dealsOpened}%</strong>
                </div>
              </CircularProgressbarWithChildren>
            </p>
          </p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>Deals In Progress</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{deal.dealsInProgress}</p>
            <p style={{ width: 50, height: 50 }}>
              <CircularProgressbarWithChildren
                value={deal.dealsInProgress}
                styles={buildStyles({
                  textColor: 'red',
                  pathColor: 'rose',
                })}
              >
                <div style={{ fontSize: 10, marginTop: -1 }}>
                  <strong>{deal.dealsInProgress}%</strong>
                </div>
              </CircularProgressbarWithChildren>
            </p>
          </p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>Deals Closed</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{deal.dealsClosed}</p>
            <p style={{ width: 50, height: 50 }}>
              <CircularProgressbarWithChildren
                value={deal.dealsClosed}
                styles={buildStyles({
                  textColor: 'red',
                  pathColor: 'rose',
                })}
              >
                <div style={{ fontSize: 10, marginTop: -1 }}>
                  <strong>{deal.dealsClosed}%</strong>
                </div>
              </CircularProgressbarWithChildren>
            </p>
          </p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>Total Commission</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>${deal.totalCommission}</p>
            <p style={{ width: 50, height: 50 }}>
              <div>
                <div style={{ fontSize: 10, marginTop: -1 }}>
                  <img className={styles.img} src={logo1} alt="img "></img>
                </div>
              </div>
            </p>
          </p>
        </span>
      </div>
      <div>
        <BrokerGrid />
      </div>
    </>
  );
};

export default Main;
