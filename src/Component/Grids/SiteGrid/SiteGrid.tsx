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
  fetchSites,
  addSite,
  updateSite,
  deleteSite,
  setSnackbarOpen,
  setSnackbarMessage,
} from '../../Redux/slice/site/siteSlice';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import FullGrid from '..//parentGrid/parent-grid';
import { FiEdit, FiTrash } from 'react-icons/fi'; import ConfirmationModal from '../../AlertDialog/AlertDialog';
import CloseIcon from '@mui/icons-material/Close';
import './site-grid.module.css';
import { RootState } from '../../Redux/reducers';
import SnackbarComponent from '../../Snackbar/Snackbar';
import styles from './site-grid.module.css'
import { fetchBrokers } from '../../Redux/slice/broker/brokerSlice';
import { fetchLandlords } from '../../Redux/slice/landlord/landlordSlice';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

export interface Site {
  id: number;
  landlordId: number;
  addressline1: string;
  addressline2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isNew: boolean;
  createdBy: number;
}

const SiteGrid: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<Partial<Site>>({});
  const dispatch = useDispatch<AppDispatch>();
  const sites = useSelector((state: RootState) => state.site.sites);
  const userdetails = useSelector((state: RootState) => state.auth.user);
  const landlorddetails = useSelector((state: RootState) => state.landlord.landlords);
  const snackbarOpen = useSelector(
    (state: RootState) => state.site.snackbarOpen
  );
  const snackbarMessage = useSelector(
    (state: RootState) => state.site.snackbarMessage
  );

  const [formData, setFormData] = useState<Site>({
    id: 0,
    landlordId: 0,
    addressline1: '',
    addressline2: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    isNew: true,
    createdBy: 0,
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sites.length,
    page: 0,
  });

  useEffect(() => {
    dispatch(fetchSites());
    dispatch(fetchBrokers());
    dispatch(fetchLandlords());
  }, [dispatch]);

  useEffect(() => {
    setPaginationModel(prev => ({ ...prev, pageSize: sites.length }));
  }, [sites]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const trimFormData = (data: Site) => ({
    ...data,
    addressline1: data.addressline1.trim(),
    addressline2: data.addressline2.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    country: data.country.trim(),
    zipcode: data.zipcode.trim(),
  });


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>
  ) => {
    const { name, value } = e.target;

    if (name === 'address' && typeof value === 'string') {
      const [addressline1, addressline2] = value.split(', ');
      setFormData((prevFormData) => ({
        ...prevFormData,
        addressline1: addressline1 || '',
        addressline2: addressline2 || '',
      }));
    } else if (name === 'landlordId') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        landlordId: Number(value),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      landlordId: 0,
      addressline1: '',
      addressline2: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      isNew: true,
      createdBy: 0,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    let valid = true;
    const errors: Partial<Site> = {};

    if (!formData.addressline1) {
      errors.addressline1 = 'Address Line 1 is required';
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
    if (!formData.landlordId) {
      errors.landlordId = 1;
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const cancelDelete = () => {
    setDeleteConfirmation(false);
  };

  const handleAdd = () => {
    if (validateForm()) {
      const trimmedData = trimFormData(formData);
      dispatch(addSite(trimmedData));
      handleClose();
    }
  };

  const handleEdit = (id: number) => {
    const site = sites.find((site) => site.id === id);
    if (site) {
      setFormData(site);
      handleOpen();
    }
  };

  const handleUpdate = () => {
    if (validateForm()) {
      const user_id = userdetails?.id;

      if (user_id) {
        const trimmedData = trimFormData(formData);
        const updatedFormData = {
          ...trimmedData,
          updatedBy: user_id,
        };

        dispatch(updateSite(updatedFormData));
        handleClose();
      }
    }
  };
  const handleDelete = (id: number) => {
    setDeleteConfirmation(true);
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteSite(deleteId));
    setDeleteConfirmation(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'landlordId',
      headerName: 'Landlord Name',
      width: 180,
      valueGetter: (params) => {
        const landlord = landlorddetails.find(
          (landlord) => landlord.id === params
        );
        return landlord ? landlord.name : 'Unknown';
      },
    },
    { field: 'addressline1', headerName: 'AddressLine1', width: 220 },
    { field: 'addressline2', headerName: 'AddressLine2', width: 220 },
    { field: 'city', headerName: 'City', width: 180 },
    { field: 'state', headerName: 'State', width: 180 },
    { field: 'country', headerName: 'Country', width: 180 },
    { field: 'zipcode', headerName: 'Zipcode', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      disableExport: true,
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

  const handleEditNew = (data: boolean) => {
    if (landlorddetails.length === 0) {
      dispatch(setSnackbarMessage('You cannot add a property without landlords. Please add landlords to proceed.'));
      dispatch(setSnackbarOpen(true));
      setTimeout(() => {
        navigate('/landlord');
      }, 3500)
    } else if (data) {
      resetForm();
      handleOpen();
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(setSnackbarOpen(false));
  };

  // Determine the severity based on the snackbar message
  const snackbarSeverity = snackbarMessage?.includes('successfully')
    ? 'success'
    : 'error';

  return (
    <div>
      <Button
        variant="contained"
        style={{
          marginRight: 8,
          width: '200px',
          position: 'relative',
          float: 'right',
          background: 'linear-gradient(58deg, rgb(35, 39, 43) 0%, rgb(45, 53, 60) 35%, rgb(32, 46, 59) 100%)'
        }}
        onClick={() => handleEditNew(true)}
      >
        Add Property
      </Button>

      <FullGrid
        sx={{
          height: 'calc(100vh - 8rem)'
        }}
        rows={sites}
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
        <DialogTitle className="dialogtitle" style={{ height: 50, fontSize: '1rem', letterSpacing: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', textTransform: 'uppercase' }}>
          {formData.id ? 'Edit Property' : 'Add Property'}
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" size="small">
              Landlord Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              name="landlordId"
              value={formData.landlordId === 0 ? '' : formData.landlordId}
              label="Landlord Name"
              onChange={handleChange}
            >
              {landlorddetails.map((landlord) => (
                <MenuItem key={landlord.id} value={landlord.id}>
                  {landlord.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formErrors.landlordId && <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '.25rem', marginLeft: '.80rem' }}>{formErrors.landlordId ? 'Landlord Name is required' : null}</p>}
          <TextField
            autoFocus
            margin="dense"
            name="addressline1"
            label="addressline1"
            type="text"
            size="small"
            autoComplete="new-password"
            fullWidth
            value={formData.addressline1}
            onChange={handleChange}
            error={!!formErrors.addressline1}
            helperText={formErrors.addressline1}
          />
          <TextField
            margin="dense"
            name="addressline2"
            label="addressline2"
            type="text"
            autoComplete="new-password"
            size="small"
            fullWidth
            value={formData.addressline2}
            onChange={handleChange}
            error={!!formErrors.addressline2}
            helperText={formErrors.addressline2}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            autoComplete="new-password"
            type="text"
            size="small"
            fullWidth
            value={formData.city}
            onChange={handleChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
          />
          <TextField
            margin="dense"
            name="state"
            label="state"
            type="text"
            autoComplete="new-password"
            size="small"
            fullWidth
            value={formData.state}
            onChange={handleChange}
            error={!!formErrors.state}
            helperText={formErrors.state}
          />

          <TextField
            margin="dense"
            name="country"
            label="Country"
            type="text"
            size="small"
            autoComplete="new-password"
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
            size="small"
            autoComplete="new-password"
            fullWidth
            value={formData.zipcode}
            onChange={handleChange}
            error={!!formErrors.zipcode}
            helperText={formErrors.zipcode}
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
          <Button
            onClick={formData.id ? handleUpdate : handleAdd}
            variant="contained"
            size='small'
            className={styles.btnadded}
          >
            {formData.id ? 'Update' : 'Add'}
          </Button>
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

export default SiteGrid;
