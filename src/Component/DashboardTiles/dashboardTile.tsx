import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './dashboardTile.module.css';
import BrokerGrid from '../Grids/broker-grid/BrokerGrid';
import 'react-circular-progressbar/dist/styles.css';
import ProgressBar from '@ramonak/react-progress-bar';
import { fetchDeals } from '../Redux/slice/deal/dealsDataSlice';
import { RootState } from '../Redux/reducers';
import { AppDispatch } from '../Redux/store';
import { fetchSites } from '../Redux/slice/site/siteSlice';

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
          <p className={styles.totalDeals}>TOTAL DEALS:</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{deal.totalDeals}</p>
          </p>
          <ProgressBar
            completed={''}
            className={styles.wrapper}
            barContainerClassName={styles.container}
            completedClassName={styles.barCompleted}
          />
          <p className={styles.add_content}>Better than last week (40.5%)</p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>DEALS OPENED</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{deal.dealsOpened}</p>
          </p>
          <ProgressBar
            completed={''}
            className={styles.wrapper}
            barContainerClassName={styles.container}
            completedClassName={styles.barCompleted}
          />
          <p className={styles.add_content}>Better than last week (40.5%)</p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>DEALS IN PROGRESS</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{deal.dealsInProgress}</p>
          </p>
          <ProgressBar
            completed={''}
            className={styles.wrapper}
            barContainerClassName={styles.container}
            completedClassName={styles.barCompleted}
          />
          <p className={styles.add_content}>Better than last week (40.5%)</p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>DEALS CLOSED</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{deal.dealsClosed}</p>
          </p>
          <ProgressBar
            completed={''}
            className={styles.wrapper}
            barContainerClassName={styles.container}
            completedClassName={styles.barCompleted}
          />
          <p className={styles.add_content}>Better than last week (40.5%)</p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>TOTAL COMMISSION</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>${deal.totalCommission}</p>
          </p>
          <ProgressBar
            completed={''}
            className={styles.wrapper}
            barContainerClassName={styles.container}
            completedClassName={styles.barCompleted}
          />
          <p className={styles.add_content}>Better than last week (40.5%)</p>
        </span>
      </div>
      <div>
        <BrokerGrid />
      </div>
    </>
  );
};

export default Main;
