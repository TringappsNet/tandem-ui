import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  IconButton,
  Icon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { axiosInstance } from "../../AxiosInterceptor/AxiosInterceptor";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import FullGrid from "../MainGrid/MainGrid";
import { MdEdit, MdDelete } from "react-icons/md";
import ConfirmationModal from "../../AlertDialog/AlertDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/store/index";
import { RootState } from "../../Redux/reducers";
import SendInvite from "../../SendInvite/SendInvite";
import {
  closeSendInvite,
  openSendInvite,
} from "../../Redux/slice/auth/sendInviteSlice";
// import './site-grid.module.css';

interface Site {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isNew: boolean;
  createdBy: number;
}

const config = {
  apiUrl: "/brokers/all-users",
};

const InviteBroker: React.FC = () => {
  const [rows, setRows] = useState<Site[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<Partial<Site>>({});
  const dispatch = useDispatch<AppDispatch>();
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const inviteOpen = useSelector((state: RootState) => state.sendInvite.open);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<Site>({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
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
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

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

  const resetForm = () => {
    setFormData({
      id: 0,
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      isNew: true,
      createdBy: 0,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    let valid = true;

    const errors: Partial<Site> = {};
    if (!formData.email) {
      errors.email = "Email is required";
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

  const handleAdd = async () => {
    try {
      if (validateForm()) {
        const response = await axiosInstance.post(
          "brokers/all-users/",
          formData
        );
        setRows([...rows, response.data]);
        handleClose();
      }
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
    if (validateForm()) {
      try {
        const response = await axiosInstance.put(
          `brokers/broker/${formData.id}`,
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
      await axiosInstance.delete(`brokers/broker/${deleteId}`);
      setRows(rows.filter((row) => row.id !== deleteId));
      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting Site:", error);
    }
  };

  const handleOpenPopup = (componentName: string) => {
    setSelectedComponent(componentName);
    setOpenPopup(true);

    if (componentName === "SendInvite") {
      dispatch(openSendInvite());
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedComponent(null);

    if (selectedComponent === "SendInvite") {
      dispatch(closeSendInvite());
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "email", width: 140 },
    { field: "firstName", headerName: "firstName", width: 110 },

    { field: "lastName", headerName: "lastName", width: 110 },
    { field: "mobile", headerName: "mobile", width: 110 },
    { field: "address", headerName: "address", width: 110 },

    { field: "city", headerName: "City", width: 110 },
    { field: "state", headerName: "state", width: 120 },

    { field: "zipcode", headerName: "Zipcode", width: 120 },
    { field: "country", headerName: "Country", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,

      renderCell: (params) => (
        <>
          <MdEdit
            style={{ color: "blue", marginRight: 8, cursor: "pointer" }}
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

  return (
    <div>
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
        onClick={() => handleOpenPopup("SendInvite")}
      >
        send invite
      </Button>

      <Dialog open={openPopup} sx={{ padding: 0, margin: 0 }} maxWidth="lg">
        <DialogTitle sx={{ padding: 0 }}>
          <Icon
            aria-label="close"
            onClick={handleClosePopup}
            sx={{
              position: "absolute",
              right: 18,
              top: 8,
              zIndex: 999,
              fontSize: 30,
              cursor: "pointer",
            }}
          >
            <CloseIcon />
          </Icon>
        </DialogTitle>

        <DialogContent sx={{ padding: 0 }}>
          {inviteOpen && selectedComponent === "SendInvite" && (
            <SendInvite onCloseDialog={handleClosePopup} />
          )}
        </DialogContent>
      </Dialog>

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
        <DialogTitle className="dialogtitle">
          {formData.id ? "Edit Property" : "Add Property"}

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
            name="email"
            label="email"
            type="text"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="dense"
            name="firstName"
            label="firstName"
            type="text"
            fullWidth
            value={formData.firstName}
            onChange={handleChange}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="lastName"
            type="text"
            fullWidth
            value={formData.lastName}
            onChange={handleChange}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />
          <TextField
            margin="dense"
            name="mobile"
            label="mobile"
            type="text"
            fullWidth
            value={formData.mobile}
            onChange={handleChange}
            error={!!formErrors.mobile}
            helperText={formErrors.mobile}
          />

          <TextField
            margin="dense"
            name="state"
            label="state"
            type="text"
            fullWidth
            value={formData.state}
            onChange={handleChange}
            error={!!formErrors.state}
            helperText={formErrors.state}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={formData.id ? handleUpdate : handleAdd}
            color="primary"
          >
            {formData.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InviteBroker;
