import React, { useState, useEffect, ChangeEvent } from "react";
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
import styles from "./landlord-grid.module.css";
import FullGrid from "../parentGrid/parent-grid";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";

interface Landlord {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

const config = {
  apiUrl: "/landlords",
};

const LandlordGrid: React.FC = () => {
  const [rows, setRows] = useState<Landlord[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Landlord>({
    id: 0,
    name: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  useEffect(() => {
    fetchLandlords();
  }, []);

  const fetchLandlords = async () => {
    try {
      const response = await axiosInstance.get(config.apiUrl);
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching landlords:", error);
    }
  };

  const handleOpen = () => setOpen(true);
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
      console.error("Error adding landlord:", error);
    }
  };

  const handleEdit = (id: number) => {
    const row = rows.find((row) => row.id === id);
    if (row) {
      setFormData(row);
      handleOpen();
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${config.apiUrl}/${formData.id}`, formData);
      setRows(rows.map((row) => (row.id === formData.id ? response.data : row)));
      handleClose();
    } catch (error) {
      console.error("Error updating landlord:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${config.apiUrl}/${id}`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting landlord:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150, align: "center", headerAlign: "center" },
    { field: "phoneNumber", headerName: "Phone Number", width: 150, align: "center", headerAlign: "center" },
    { field: "email", headerName: "Email", width: 200, align: "center", headerAlign: "center" },
    { field: "address1", headerName: "Address 1", width: 150, align: "center", headerAlign: "center" },
    { field: "address2", headerName: "Address 2", width: 150, align: "center", headerAlign: "center" },
    { field: "city", headerName: "City", width: 100, align: "center", headerAlign: "center" },
    { field: "state", headerName: "State", width: 100, align: "center", headerAlign: "center" },
    { field: "country", headerName: "Country", width: 100, align: "center", headerAlign: "center" },
    { field: "zipcode", headerName: "Zipcode", width: 100, align: "center", headerAlign: "center" },
  ];

  return (
    <div className={styles.gridContainer}> 
      <FullGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        className={styles.gridContainer} 
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? "Edit Landlord" : "Add Landlord"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phoneNumber"
            label="Phone Number"
            type="text"
            fullWidth
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
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
            name="address1"
            label="Address 1"
            type="text"
            fullWidth
            value={formData.address1}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address2"
            label="Address 2"
            type="text"
            fullWidth
            value={formData.address2}
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

export default LandlordGrid;