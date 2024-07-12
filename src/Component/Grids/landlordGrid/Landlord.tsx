import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { axiosInstance } from "../../AxiosInterceptor/AxiosInterceptor";
import styles from "./landlord-grid.module.css";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import FullGrid from "../MainGrid/MainGrid";
import { MdEdit, MdDelete } from "react-icons/md";
import ConfirmationModal from "../../AlertDialog/AlertDialog";
import CloseIcon from "@mui/icons-material/Close";

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
  isNew: boolean;
}

const config = {
  apiUrl: "/landlords",
};

const LandlordGrid: React.FC = () => {
  const [rows, setRows] = useState<Landlord[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
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
    isNew: true,
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 12,
    page: 0,
  });
  const [formErrors, setFormErrors] = useState<Partial<Landlord>>({});

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleAdd = async () => {
    if (validateForm()) {
      try {
        const response = await axiosInstance.post(
          "landlords/landlord/",
          formData
        );
        setRows([...rows, response.data]);
        handleClose();
      } catch (error) {
        console.error("Error adding landlord:", error);
      }
    }
  };

  const handleEdit = (id: number) => {
    const row = rows.find((row) => row.id === id);
    if (row) {
      setFormData(row);
      handleOpen();
    }
  };

  const handleEditNew = (data: boolean) => {
    if (data) {
      handleOpen();
      setFormData({
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
        isNew: true,
      });
    }
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      try {
        const response = await axiosInstance.patch(
          `landlords/landlord/${formData.id}`,
          formData
        );
        setRows(
          rows.map((row) => (row.id === formData.id ? response.data : row))
        );
        handleClose();
      } catch (error) {
        console.error("Error updating landlord:", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteConfirmation(true);
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`landlords/landlord/${deleteId}`);
      setRows(rows.filter((row) => row.id !== deleteId));
      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting landlord:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 100 },
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "address1", headerName: "AddressLine1", width: 140 },
    { field: "address2", headerName: "AddressLine2", width: 140 },
    { field: "city", headerName: "City", width: 100 },
    { field: "state", headerName: "State", width: 100 },
    { field: "country", headerName: "Country", width: 100 },
    { field: "zipcode", headerName: "Zipcode", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,

      renderCell: (params) => (
        <>
          <MdEdit
            style={{ color: "blue", marginRight: 28, cursor: "pointer" }}
            onClick={() => handleEdit(params.row.id)}
          />
          <MdDelete
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(params.row.id)}
          />
        </>
      ),
    },
  ];

  const validateForm = () => {
    let valid = true;
    const errors: Partial<Landlord> = {};

    if (!formData.name) {
      errors.name = "Name is required";

      valid = false;
    }

    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone Number must be 10 digits";
      valid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
      valid = false;
    }

    if (!formData.address1) {
      errors.address1 = "Address is required";
      valid = false;
    }

    if (!formData.city) {
      errors.city = "City is required";
      valid = false;
    }

    if (!formData.state) {
      errors.state = "State is required";
      valid = false;
    }

    if (!formData.country) {
      errors.country = "Country is required";
      valid = false;
    }

    if (!formData.zipcode) {
      errors.zipcode = "Zipcode is required";
      valid = false;
    } else if (!/^\d{5}$/.test(formData.zipcode)) {
      errors.zipcode = "Zipcode must be 5 digits";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const cancelDelete = () => {
    setDeleteConfirmation(false);
  };

  return (
    <div className={styles.gridContainer}>
      <Button
        variant="contained"
        color="primary"
        style={{
          marginRight: 8,
          width: "200px",
          position: "relative",
          float: "right",
          backgroundColor: "#262280",
        }}
        onClick={() => handleEditNew(true)}
      >
        Add Landlord
      </Button>

      <FullGrid
        sx={{
          height: 450,
        }}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
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
        <DialogTitle >
          {formData.id ? "Edit Landlord" : "Add Landlord"}
          <IconButton
            aria-label="close"
            onClick={() => {
              handleClose();
            }}
            sx={{
              position: "absolute",
              right: 20,
              top: 10,

              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon sx={{ color: "#999" }} />
          </IconButton>
        </DialogTitle>
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
            error={!!formErrors.name}
            helperText={formErrors.name}
            autoComplete="off"

          />
          <TextField
            margin="dense"
            name="phoneNumber"
            label="Phone Number"
            type="number"
            fullWidth
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
            autoComplete="off"

          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            autoComplete="off"

          />
          <TextField
            margin="dense"
            name="address1"
            label="Address 1"
            type="text"
            fullWidth
            value={formData.address1}
            onChange={handleChange}
            error={!!formErrors.address1}
            helperText={formErrors.address1}
            autoComplete="off"

          />

          <TextField
            margin="dense"
            name="address2"
            label="Address2"
            type="text"
            fullWidth
            value={formData.address2}
            onChange={handleChange}
            error={!!formErrors.address2}
            helperText={formErrors.address2}
            autoComplete="off"

          />

          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            value={formData.city}
            onChange={handleChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
            autoComplete="off"

          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            value={formData.state}
            onChange={handleChange}
            error={!!formErrors.state}
            helperText={formErrors.state}
            autoComplete="off"

          />
          <TextField
            margin="dense"
            name="country"
            label="Country"
            type="text"
            fullWidth
            value={formData.country}
            onChange={handleChange}
            error={!!formErrors.country}
            helperText={formErrors.country}
            autoComplete="off"

          />
          <TextField
            margin="dense"
            name="zipcode"
            label="Zipcode"
            type="number"
            fullWidth
            value={formData.zipcode}
            onChange={handleChange}
            error={!!formErrors.zipcode}
            helperText={formErrors.zipcode}
            autoComplete="off"

          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {formData.id ? (
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          ) : (
            <Button onClick={handleAdd} color="primary">
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LandlordGrid;
