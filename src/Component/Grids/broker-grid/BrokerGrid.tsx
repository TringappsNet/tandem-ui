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
    { field: 'fullName', headerName: 'Tandem Users', width: 200, align:'left', headerAlign:'center' },
    { field: 'roleName', headerName: 'Role', width: 150, align:'center', headerAlign:'center' },
    { field: 'mobile', headerName: 'Mobile', width: 150, align:'center', headerAlign:'center' },
    { field: 'totalDeals', headerName: 'Total Deals', width: 170, align:'center', headerAlign:'center' },
    { field: 'dealsOpened', headerName: 'Deals Opened', width: 170, align:'center', headerAlign:'center' },
    { field: 'dealsInProgress', headerName: 'Deals In-Progress', width: 180, align:'center', headerAlign:'center'},
    { field: 'dealsClosed', headerName: 'Deals Closed', width: 150, align:'center', headerAlign:'center' },
    { field: 'totalPotentialCommission', headerName: 'Total Potential Commission', width: 250, align:'center', headerAlign:'center' },
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