import React, { useState, useEffect, ChangeEvent } from 'react';
import { axiosInstance } from '../../AxiosInterceptor/AxiosInterceptor';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

import FullGrid from '../parentGrid/parent-grid';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isActive: boolean;
  roleId: number;
  fullName: string;
  totalDeals: number;
  dealsOpened: number;
  dealsInProgress: number;
  dealsClosed: number;
  totalCommission: number;
  roleName: string;
}


const config = {
  getUrl: '/brokers',
};

const BrokerGrid: React.FC = () => {
  const [rows, setRows] = useState<User[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 100,
    page: 0,
  });

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    try {
      const response = await axiosInstance.get(config.getUrl);
      const brokers = response.data.map((broker: any) => {
        const fullName = `${broker.user.firstName} ${broker.user.lastName}`;
        const roleName = broker.roleId === 1 ? 'Admin' : 'Broker';
        return {
          id: broker.user.id,
          email: broker.user.email,
          fullName: fullName,
          firstName: broker.user.firstName,
          lastName: broker.user.lastName,
          mobile: broker.user.mobile,
          address: broker.user.address,
          city: broker.user.city,
          state: broker.user.state,
          country: broker.user.country,
          zipcode: broker.user.zipcode,
          isActive: broker.user.isActive,
          totalDeals: broker.totalDeals,
          dealsOpened: broker.dealsOpened,
          dealsInProgress: broker.dealsInProgress,
          dealsClosed: broker.dealsClosed,
          totalCommission: broker.totalCommission,
          roleName: roleName,
        };
      }
    );

      setRows(brokers);
    } catch (error) {
      console.error('Error fetching broker names:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Name', width: 170 },
    { field: 'roleName', headerName: 'Role', width: 130 },
    { field: 'mobile', headerName: 'Mobile', width: 150 },
    { field: 'totalDeals', headerName: 'Total Deals', width: 150 },
    { field: 'dealsOpened', headerName: 'Deals Opened', width: 150 },
    { field: 'dealsInProgress', headerName: 'Deals In-Progress', width: 170 },
    { field: 'dealsClosed', headerName: 'Deals Closed', width: 150 },
    { field: 'totalCommission', headerName: 'Total Commission', width: 170 },
  ];

  return (
    <div>
      <FullGrid
        sx={{
          height: 'calc(100vh - 15rem)',
        }}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </div>
  );
};

export default BrokerGrid;
