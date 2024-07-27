import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import {
  fetchLandlords,
  addLandlord,
  updateLandlord,
  deleteLandlord,
  setSnackbarOpen,
} from '../../Redux/slice/landlord/landlordSlice';
import styles from './landlord-grid.module.css';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import FullGrid from '../parentGrid/parent-grid';
import ConfirmationModal from '../../AlertDialog/AlertDialog';
import CloseIcon from '@mui/icons-material/Close';
import { RootState } from '../../Redux/reducers';
import SnackbarComponent from '../../Snackbar/Snackbar';
import { FiEdit, FiTrash } from 'react-icons/fi';


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

const LandlordGrid: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [formData, setFormData] = useState<Landlord>({
    id: 0,
    name: '',
    phoneNumber: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    isNew: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<Landlord>>({});
  const dispatch = useDispatch<AppDispatch>();
  const landlords = useSelector((state: RootState) => state.landlord.landlords);
  const snackbarOpen = useSelector(
    (state: RootState) => state.landlord.snackbarOpen
  );
  const snackbarMessage = useSelector(
    (state: RootState) => state.landlord.snackbarMessage
  );
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: landlords.length,
    page: 0,
  });

  useEffect(() => {
    dispatch(fetchLandlords());
  }, [dispatch]);

  useEffect(() => {
    setPaginationModel(prev => ({ ...prev, pageSize: landlords.length }));
  }, [landlords]);

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
      [name]: '',
    }));
  };

  const handleAdd = () => {
    if (validateForm()) {
      dispatch(addLandlord(formData));
      handleClose();
    }
  };

  const handleEdit = (id: number) => {
    const landlord = landlords.find((landlord) => landlord.id === id);
    if (landlord) {
      setFormData(landlord);
      handleOpen();
    }
  };

  const handleEditNew = (data: boolean) => {
    if (data) {
      handleOpen();
      setFormData({
        id: 0,
        name: '',
        phoneNumber: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        isNew: true,
      });
    }
  };

  const handleUpdate = () => {
    if (validateForm()) {
      dispatch(updateLandlord(formData));
      handleClose();
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmation(true);
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteLandlord(deleteId));
    setDeleteConfirmation(false);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 140 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'email', headerName: 'Email', width: 183 },
    { field: 'address1', headerName: 'AddressLine1', width: 160 },
    { field: 'address2', headerName: 'AddressLine2', width: 140 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'country', headerName: 'Country', width: 140 },
    { field: 'zipcode', headerName: 'Zipcode', width: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      disableExport: true,
      width: 100,
      renderCell: (params) => (
        <>
          <FiEdit
            style={{ marginRight: 28, cursor: 'pointer' }}
            onClick={() => handleEdit(params.row.id)}
          />
          <FiTrash
            style={{ cursor: 'pointer' }}
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
      errors.name = 'Name is required';
      valid = false;
    }

    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone Number is required';
      valid = false;
    } else if (!/\d/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone Number must be only digits';
      valid = false;
    } else if (formData.phoneNumber.length > 15) {
      errors.phoneNumber = 'Mobile Number length should not exceed 15 digits';
      valid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      valid = false;
    }

    if (!formData.address1) {
      errors.address1 = 'Address is required';
      valid = false;
    }

    if (!formData.city) {
      errors.city = 'City is required';
      valid = false;
    }

    if (!formData.state) {
      errors.state = 'State is required';
      valid = false;
    }

    if (!formData.country) {
      errors.country = 'Country is required';
      valid = false;
    }

    if (!formData.zipcode) {
      errors.zipcode = 'Zipcode is required';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const cancelDelete = () => {
    setDeleteConfirmation(false);
  };

  const handleCloseSnackbar = () => {
    dispatch(setSnackbarOpen(false));
  };

  // Determine the severity based on the snackbar message
  const snackbarSeverity = snackbarMessage?.includes('successfully')
    ? 'success'
    : 'error';

  return (
    <div className={styles.gridContainer}>
      <Button
        variant="contained"
        color="primary"
        style={{
          marginRight: 8,
          width: '200px',
          position: 'relative',
          float: 'right',
          background: 'linear-gradient(58deg, rgb(35 39 43) 0%, rgb(45, 53, 60) 35%, rgb(32 46 59) 100%)'
        }}
        onClick={() => handleEditNew(true)}
      >
        Add Landlord
      </Button>

      <FullGrid
        sx={{
          height: 'calc(100vh - 8rem)'
        }}
        rows={landlords}
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

      <Dialog open={open} onClose={handleClose} sx={{ width: 1 }}>
        <DialogTitle style={{ height: 50, fontSize: '1rem', letterSpacing: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', textTransform: 'uppercase' }}>
          {formData.id ? 'Edit Landlord' : 'Add Landlord'}

          <IconButton
            aria-label="close"
            onClick={() => {
              handleClose();
            }}
            sx={{
              padding: 0
            }}
          >
            <CloseIcon sx={{ color: '#fff' }} />
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
            size="small"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            autoComplete="new-password"
          />
          <TextField
            margin="dense"
            name="phoneNumber"
            label="Phone Number"
            type="number"
            size="small"
            fullWidth
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
            autoComplete="new-password"
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            size="small"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            autoComplete="new-password"
          />
          <TextField
            margin="dense"
            name="address1"
            label="Address 1"
            type="text"
            size="small"
            fullWidth
            value={formData.address1}
            onChange={handleChange}
            error={!!formErrors.address1}
            helperText={formErrors.address1}
            autoComplete="new-password"
          />
          <TextField
            margin="dense"
            name="address2"
            label="Address2"
            type="text"
            size="small"
            fullWidth
            value={formData.address2}
            onChange={handleChange}
            error={!!formErrors.address2}
            helperText={formErrors.address2}
            autoComplete="new-password"
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            size="small"
            fullWidth
            value={formData.city}
            onChange={handleChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
            autoComplete="new-password"
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            size="small"
            fullWidth
            value={formData.state}
            onChange={handleChange}
            error={!!formErrors.state}
            helperText={formErrors.state}
            autoComplete="new-password"
          />
          <TextField
            margin="dense"
            name="country"
            label="Country"
            type="text"
            size="small"
            fullWidth
            value={formData.country}
            onChange={handleChange}
            error={!!formErrors.country}
            helperText={formErrors.country}
            autoComplete="new-password"
          />
          <TextField
            margin="dense"
            name="zipcode"
            label="Zipcode"
            type="number"
            size="small"
            fullWidth
            value={formData.zipcode}
            onChange={handleChange}
            error={!!formErrors.zipcode}
            helperText={formErrors.zipcode}
            autoComplete="new-password"
          />
        </DialogContent>
        <DialogActions sx={{ paddingBottom: 2, paddingRight: 2 }}>
          <Button
            onClick={handleClose}
            size='small'
            variant="contained"
            className={styles.btncancel}>
            Cancel
          </Button>
          {formData.id ? (
            <Button
              onClick={handleUpdate}
              variant="contained"
              size='small'
              className={styles.btnadded}
            >
              Update
            </Button>
          ) : (
            <Button onClick={handleAdd}
              variant="contained"
              size='small'
              className={styles.btnadded}
            >
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage || ''}
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        style={{ backgroundColor: '#54B471', color: '#FEF9FD' }}
      />
    </div>
  );
};

export default LandlordGrid;
