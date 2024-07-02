import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axiosInstance from "../../AxiosInterceptor/AxiosInterceptor";
import styles from './site-grid.module.css';
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import FullGrid from "../parentGrid/parent-grid";

interface Site {
  id: number;
  addressline1: string;
  addressline2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isNew:Boolean;
}

const config = {
  apiUrl: "/sites",
};


const SiteGrid: React.FC = () => {
  const [rows, setRows] = useState<Site[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Site>({
    id: 0,
    addressline1: "",
    addressline2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    isNew: true,
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await axiosInstance.get(config.apiUrl);
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching Sites:", error);
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
      const response = await axiosInstance.post('sites/site/', formData);
      setRows([...rows, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error adding Site:", error);
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
      const response = await axiosInstance.patch(
        `sites/site/${formData.id}`,
        formData
      );
      setRows(rows.map((row) => (row.id === formData.id ? response.data : row)));
      handleClose();
    } catch (error) {
      console.error("Error updating Site:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`sites/site/${id}`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting Site:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "addressline1", headerName: "addressline1", width: 150, align: "center" },
    { field: "addressline2", headerName: "addressline2", width: 150, align: "center" },
    { field: "state", headerName: "state", width: 200, align: "center" },
    { field: "city", headerName: "city", width: 150, align: "center" },
    { field: "zipcode", headerName: "zipcode", width: 150, align: "center" },
    { field: "country", headerName: "country", width: 100, align: "center" },
    { field: "isNew", headerName: "isNew", width: 100, align: "center" },
   
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "center",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  const handleEditnew = () => {
   
    handleOpen();
  
};

  return (
    <div className={styles.gridContainer}>
           <Button
            variant="contained"
            color="primary"

            style={{ marginRight: 8 , width:'30px',margin:10,position:'relative',float:'right'}}
            onClick={() => handleEditnew()}
          >Add  </Button>

      <FullGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        handleEdit={handleEdit}
        // handleDelete={handleDelete}
        handleAdd={handleAdd}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? "Edit Site" : "Add Site"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="addressline1"
            label="addressline1"
            type="text"
            fullWidth
            value={formData.addressline1}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="addressline2"
            label=" addressline2"
            type="text"
            fullWidth
            value={formData.addressline2}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="state"
            type="state"
            fullWidth
            value={formData.state}
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

export default SiteGrid;