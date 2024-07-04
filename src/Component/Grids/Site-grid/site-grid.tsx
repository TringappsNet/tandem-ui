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
import { MdEdit, MdDelete } from 'react-icons/md';
import ConfirmationModal from "../../AlertDialog/AlertDialog";

interface Site {
  id: number;
  addressline1: string;
  addressline2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isNew:Boolean;
  createdBy:number;
}

const config = {
  apiUrl: "/sites",
};


const SiteGrid: React.FC = () => {
  const [rows, setRows] = useState<Site[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
 
  const [formData, setFormData] = useState<Site>({
    id: 0,
    addressline1: "",
    addressline2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    isNew: true,
    createdBy: 0,
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 12,
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
    if (name === "address") {
      const [addressline1, addressline2] = value.split(", ");
      setFormData((prevFormData) => ({
        ...prevFormData,
        addressline1: addressline1 || "",
        addressline2: addressline2 || "",
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const cancelDelete = () => {
    setDeleteConfirmation(false);
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
       
        const updateBy:any = localStorage.getItem('auth');
    const user_id = JSON.parse(updateBy);

        if (updateBy) { 
            


            const updatedFormData = {
                ...formData,
                updatedBy: user_id.user.id

            };
            

            const response = await axiosInstance.put(
                `sites/site/${updatedFormData.id}`,
                updatedFormData
            );

            setRows(rows.map((row) => (row.id === updatedFormData.id ? response.data : row)));


            handleClose();

        } 


    } catch (error) {
        console.error("Error updating Site:", error);
    }
};

const handleDelete = async (id: number) => {
  setDeleteConfirmation(true);
  setDeleteId(id);
};

  const handleConfirmDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`sites/site/${deleteId}`);
      setRows(rows.filter((row) => row.id !== deleteId));
      setDeleteConfirmation(false);

    } catch (error) {
      console.error("Error deleting Site:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "address",
      headerName: "Address",
      width: 400,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          {params.row.addressline1}{params.row.addressline2}
        </>
      ),
    },
    
    { field: "state", headerName: "State", width: 200, align: "center",    headerAlign: 'center',
    },
    { field: "city", headerName: "City", width: 200, align: "center",    headerAlign: 'center',
    },
    { field: "zipcode", headerName: "Zipcode", width: 200, align: "center",    headerAlign: 'center',
    },
    { field: "country", headerName: "Country", width: 200, align: "center",    headerAlign: 'center',
      
    },
    // { field: "isNew", headerName: "isNew", width: 100, align: "center",    headerAlign: 'center',
    // },
   
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      align: "center",
      headerAlign: 'center',

      renderCell: (params) => (
        <>
        <MdEdit
          style={{ color: 'blue', marginRight: 8, cursor: 'pointer' }}
          onClick={() => handleEdit(params.row.id)}
        />
        <MdDelete
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() => handleDelete(params.row.id)}
        />
      </>
      )
    },
  ];
  const handleEditNew = ( data :Boolean) => {
    if (data) {
                 handleOpen();
    setFormData({
      id: 0,
      addressline1: "",
      addressline2: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      isNew: true,
      createdBy: 0,
    });
    handleOpen();
  }
};

  return (
    <div className={styles.gridContainer}>
          <Button
  variant="contained"
  color="primary"
  style={{ marginRight: 8 , width:'200px',position:'relative',float:'right',backgroundColor:'#262280'}}
  onClick={() => handleEditNew(true)}
>Add Property</Button>

      <FullGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        // handleEdit={handleEdit}
        // handleDelete={handleDelete}
        // handleAdd={handleAdd}
      />

<ConfirmationModal
        show={deleteConfirmation}
        onHide={cancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Row"
        message="Are you sure you want to delete this row?"
        cancelText="Cancel"
        confirmText="Delete"
        cancelVariant="secondary"
        confirmVariant="danger"
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

