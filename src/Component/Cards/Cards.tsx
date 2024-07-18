import React, { useEffect, useState } from 'react';
import styles from './Cards.module.css';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/reducers';
import {
  deleteDeal,
  fetchBrokerDealDetails,
  fetchDealDetails,
} from '../Redux/slice/deal/dealSlice';
import { openDealForm } from '../Redux/slice/deal/dealFormSlice';
import { AppDispatch } from '../Redux/store';
import ConfirmationModal from '../AlertDialog/AlertDialog';
import { setCurrentDeal } from '../Redux/slice/deal/currentDeal';
import { Deal } from '../Interface/DealFormObject';
import { fetchBrokerDeals } from '../Redux/slice/deal/dealsDataSlice';


const Cards: React.FC = () => {
  const userdetails = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const dealsData = useSelector((state: RootState) => state.deal.dealDetails);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [dealId, setDealId] = useState<number | null>(null);
  const deal = useSelector((state: RootState) => state.dealData.deal);

  useEffect(() => {
    if (userdetails.isAdmin === true) {
      dispatch(fetchDealDetails());
    } else if (userdetails.isAdmin === false) {
      dispatch(fetchBrokerDeals(userdetails.user?.id || 0))
      dispatch(fetchBrokerDealDetails(userdetails.user?.id || 0));
    }
  }, [dispatch, userdetails]);

  const editDealForm = (deal: Deal) => {
    dispatch(setCurrentDeal(deal));
    dispatch(openDealForm());
  };

  const deleteDealHandler = (dealId: number | null) => {
    if (dealId !== null) {
      dispatch(deleteDeal(dealId));
      setDeleteConfirmation(false);
    }
  };

  const getStatusButtonClass = (status: string | null) => {
    switch (status) {
      case 'Completed':
        return styles.statusButtonFinished;
      case 'In-Progress':
        return styles.statusButtonInProgress;
      case 'Started':
        return styles.statusButtonStarted;
      default:
        return '';
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(false);
  };

  const handleDelete = (id: number) => {
    setDealId(id);
    setDeleteConfirmation(true);
  };

  const filteredDeals = dealsData.filter((deal: Deal) => {
    const matchesSearch =
      deal.brokerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.id?.toString().includes(searchTerm);
    const matchesStatus = filterStatus ? deal.status === filterStatus : true;
    return matchesSearch && matchesStatus && deal.id !== null;
  });

  return (
    <>

      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by property name, status, or deal ID"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="">All Status</option>
          <option value="Started">Started</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      {(!userdetails.isAdmin) && <div className={styles.tailscontainer}>
        <p className={styles.totadeals}><span>TOTAL DEALS</span> <span>{deal.totalDeals}</span></p>
        <p className={styles.delasopened}><span>DEALS STARTED</span><span>{deal.dealsOpened}</span></p>
        <p className={styles.dealsinprogress}><span>DEALS IN PROGRESS</span><span>{deal.dealsInProgress}</span></p>
        <p className={styles.dealsclosed}><span>DEALS COMPLETED</span><span>{deal.dealsClosed}</span></p>
        <p className={styles.totalcommission}><span>TOTAL COMMISSION</span><span>{deal.totalCommission}</span></p>
      </div>
      }
      <div className={styles.cardList}>
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal: Deal) => (
            <div key={deal.id} className={styles.card}>
              <div>
                {userdetails.isAdmin && (
                  <div className={styles.icons}>
                    <div className={styles.hide}>
                      <FiEdit
                        onClick={() => editDealForm(deal)}
                        className={styles.editHide}
                      />
                    </div>
                    <FiTrash
                      onClick={() => deal.id !== null && handleDelete(deal.id)}
                    />
                  </div>
                )}
                <div className={styles.cardTitle}>
                  <div className={styles.nameHeader}>
                    <div className={styles.name}>{deal.propertyName}</div>
                  </div>

                  {/* {userdetails?.roleId === 2 && (
                    <div className={styles.hide}>
                      <FiEdit onClick={() => editDealForm(deal)} />
                    </div>
                  )} */}
                </div>
                <hr className={styles.line} />
                <div className={styles.nameHeader}>DEAL #{deal.id}</div>
              </div>
              <div className={styles.statusLine}>
                <div className={styles.statuscontainer}>
                  <div
                    className={`${styles.statusButton} ${getStatusButtonClass(
                      deal.status
                    )}`}
                  >
                    {deal.status}
                  </div>
                </div>
              </div>
              <div className={styles.statusLine}>
                <div className={styles.timestamp}>
                  Last updated on: {deal.updatedAt?.split('T')[0] || 'Unknown'}
                </div>
                <div className={styles.circle} title={deal.brokerName}>
                  {deal.brokerName && deal.brokerName.split(' ').length >= 2 ? (
                    <p>
                      {deal.brokerName.split(' ')[0][0]}
                      {deal.brokerName.split(' ')[1][0]}
                    </p>
                  ) : (
                    <p>NA</p>
                  )}
                </div>
              </div>
              <div>
                <hr
                  className={`${styles.statuslinecolor} ${getStatusButtonClass(
                    deal.status
                  )}`}
                />
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noDealsFound}>No Deals Found</div>
        )}
      </div>
      <ConfirmationModal
        show={deleteConfirmation}
        onHide={cancelDelete}
        onConfirm={() => deleteDealHandler(dealId)}
        title="Deal Delete"
        message="Are you sure you want to delete this deal?"
        cancelText="Cancel"
        confirmText="Delete"
        cancelVariant="secondary"
        confirmVariant="danger"
      />
    </>
  );
};

export default Cards;
