import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import axiosInstance from "../../AxiosInterceptor/AxiosInterceptor";
import FullGrid from "../parentGrid/parent-grid";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";

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
}


const config = {
  apiUrl: "/brokers",
};

const BrokerGrid: React.FC = () => {
  const [rows, setRows] = useState<User[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    isActive: true,
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    try {
      const response = await axiosInstance.get(config.apiUrl);
      const brokers = response.data.map((broker: any) => {
        const fullName = `${broker.user.firstName} ${broker.user.lastName}`;
        return {
          id: broker.user.id,
          email: broker.user.email,
          fullName: fullName,
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
        };
      });

      setRows(brokers);
    } catch (error) {
      console.error("Error fetching broker names:", error);
    }
  };

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(config.apiUrl, formData);
      setRows([...rows, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // const handleEdit = (id: number) => {
  //   const row = rows.find((row) => row.id === id);
  //   if (row) {
  //     setFormData(row);
  //     handleOpen();
  //   }
  // };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${config.apiUrl}/${formData.id}`, formData);
      setRows(rows.map((row) => (row.id === formData.id ? response.data : row)));
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // const handleDelete = async (id: number) => {
  //   try {
  //     await axios.delete(`${config.apiUrl}/${id}`);
  //     setRows(rows.filter((row) => row.id !== id));
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //   }
  // };

  const columns: GridColDef[] = [
    { field: "fullName", headerName: "Name", width: 150, align: "center", headerAlign: "center" },
    { field: "mobile", headerName: "Mobile", width: 150, align: "center", headerAlign: "center" },
    { field: "totalDeals", headerName: "Total Deals", width: 150, align: "center", headerAlign: "center" },
    { field: "dealsOpened", headerName: "Deals Opened", width: 150, align: "center", headerAlign: "center" },
    { field: "dealsInProgress", headerName: "Deals In-Progress", width: 150, align: "center", headerAlign: "center" },
    { field: "dealsClosed", headerName: "Deals Closed", width: 150, align: "center", headerAlign: "center" },
    { field: "totalCommission", headerName: "Total Commission", width: 150, align: "center", headerAlign: "center" },
    { field: "isActive", headerName: "Active", width: 150, align: "center", headerAlign: "center" },
  ];

  return (
    <div>
      <FullGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        // handleEdit={handleEdit}
        // handleAdd={handleAdd}
        // handleDelete={handleDelete}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? "Edit User" : "Add User"}</DialogTitle>
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
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={formData.id ? handleUpdate : handleAdd} color="primary">
            {formData.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BrokerGrid;
