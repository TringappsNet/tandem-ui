import React, { useState, useEffect, ChangeEvent } from 'react';
import { TextField, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { axiosInstance } from '../../AxiosInterceptor/AxiosInterceptor';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

import FullGrid from '../MainGrid/MainGrid';

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
}

interface BrokerData extends Omit<User, 'roleId'> {
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
  const [rows, setRows] = useState<BrokerData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    isActive: true,
    roleId: 1,
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 3,
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
      });

      setRows(brokers);
    } catch (error) {
      console.error('Error fetching broker names:', error);
    }
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Name', width: 170 },
    { field: 'roleName', headerName: 'Role', width: 120 },
    { field: 'mobile', headerName: 'Mobile', width: 150 },
    { field: 'totalDeals', headerName: 'Total Deals', width: 130 },
    { field: 'dealsOpened', headerName: 'Deals Opened', width: 130 },
    { field: 'dealsInProgress', headerName: 'Deals In-Progress', width: 150 },
    { field: 'dealsClosed', headerName: 'Deals Closed', width: 130 },
    { field: 'totalCommission', headerName: 'Total Commission', width: 150 },
  ];

  return (
    <div>
      <FullGrid
        className=""
        sx={{
          height: 410,
        }}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="mobile"
            label="Mobile"
            type="text"
            fullWidth
            value={formData.mobile}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            value={formData.city}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            value={formData.state}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="country"
            label="Country"
            type="text"
            fullWidth
            value={formData.country}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="zipcode"
            label="Zipcode"
            type="text"
            fullWidth
            value={formData.zipcode}
            onChange={handleChange}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrokerGrid;
