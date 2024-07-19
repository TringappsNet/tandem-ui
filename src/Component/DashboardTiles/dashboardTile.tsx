import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './dashboardTile.module.css';
import BrokerGrid from '../Grids/broker-grid/BrokerGrid';
import { fetchDeals } from '../Redux/slice/deal/dealsDataSlice';
import { RootState } from '../Redux/reducers';
import { AppDispatch } from '../Redux/store';
import LinearProgress from '@mui/material/LinearProgress';
import { fetchDealDetails } from '../Redux/slice/deal/dealSlice';

const Main: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userdetails = useSelector((state: RootState) => state.auth.user);
  const deals = useSelector((state: RootState) => state.deal.dealDetails);
  const dealData = useSelector((state: RootState) => state.dealData.deal);
  const dealsOpenedPercentage =
    (dealData.dealsOpened / dealData.totalDeals) * 100;
  const dealsInProgressPercentage =
    (dealData.dealsInProgress / dealData.totalDeals) * 100;
  const dealsClosedPercentage =
    (dealData.dealsClosed / dealData.totalDeals) * 100;

  useEffect(() => {
    dispatch(fetchDeals());
    dispatch(fetchDealDetails());
  }, [dispatch]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dealsCreatedLast7Days = deals.filter((deal) => {
    if (!deal.createdAt) return false;
    const createdAt = new Date(deal.dealStartDate);
    return createdAt >= sevenDaysAgo;
  });
  const dealsOpenedLast7Days = deals.filter((deal) => {
    if (!deal.createdAt) return false;
    if (deal.activeStep > 1 && deal.activeStep < 7) {
      const dealStartDate = new Date(deal.dealStartDate);
      return dealStartDate >= sevenDaysAgo;
    }
    return false;
  });

  const dealsClosedLast7Days = deals.filter((deal) => {
    if (deal.activeStep === 7) {
      if (!deal.createdAt) return false;
      const createdAt = new Date(deal.createdAt);
      return createdAt >= sevenDaysAgo;
    }
    return false;
  });

  return (
    <>
      <p className={styles.welcome}>
        <div className={styles.welcomefade}>
          Welcome,{' '}
          {userdetails
            ? `${userdetails.firstName} ${userdetails.lastName} !`
            : 'Guest'}
        </div>
      </p>
      <div className={styles.tagsContainer}>
        <span className={styles.tag}>
          <p className={styles.totalDeals}>TOTAL DEALS:</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{dealData.totalDeals}</p>
          </p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>DEALS OPENED</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{dealData.dealsOpened}</p>
          </p>
          <LinearProgress variant="determinate" value={dealsOpenedPercentage} />
          <p className={styles.add_content}>
            Deals created last week ({dealsCreatedLast7Days.length})
          </p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>DEALS IN PROGRESS</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{dealData.dealsInProgress}</p>
          </p>
          <LinearProgress
            variant="determinate"
            value={dealsInProgressPercentage}
          />
          <p className={styles.add_content}>
            Deals pending from last week ({dealsOpenedLast7Days.length})
          </p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>DEALS CLOSED</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>{dealData.dealsClosed}</p>
          </p>
          <LinearProgress variant="determinate" value={dealsClosedPercentage} />
          <p className={styles.add_content}>
            Deals closed last week ({dealsClosedLast7Days.length})
          </p>
        </span>

        <span className={styles.tag}>
          <p className={styles.totalDeals}>TOTAL COMMISSION</p>
          <p className={styles.deals}>
            <p className={styles.totalDeal}>${dealData.totalCommission}</p>
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
