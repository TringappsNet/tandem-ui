import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import FullGrid from '../parentGrid/parent-grid';
import { RootState } from '../../Redux/reducers';
import { AppDispatch } from '../../Redux/store';
import { fetchBrokers } from '../../Redux/slice/broker/brokerSlice';

const BrokerGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const brokers = useSelector((state: RootState) => state.broker.brokers);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 100,
    page: 0,
  });

  useEffect(() => {
    dispatch(fetchBrokers());
  }, [dispatch]);

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Tandem Users', width: 170 },
    { field: 'roleName', headerName: 'Role', width: 130 },
    { field: 'mobile', headerName: 'Mobile', width: 150 },
    { field: 'totalDeals', headerName: 'Total Deals', width: 150 },
    { field: 'dealsOpened', headerName: 'Deals Opened', width: 150 },
    { field: 'dealsInProgress', headerName: 'Deals In-Progress', width: 170 },
    { field: 'dealsClosed', headerName: 'Deals Closed', width: 150 },
    { field: 'totalPotentialCommission', headerName: 'Total Potential Commission', width: 170 },
  ];

  return (
    <div>
      <FullGrid
        sx={{
          height: 'calc(100vh - 15rem)',
        }}
        rows={brokers}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </div>
  );
};

export default BrokerGrid;