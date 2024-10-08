import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  IconButton,
  Icon,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import {
  fetchBrokers,
  addBroker,
  updateBroker,
  setSnackbarOpen,
  setActiveBroker,
} from '../../Redux/slice/user/userSlice';
import { fetchBrokers as fetchingbrokerdetails } from '../../Redux/slice/broker/brokerSlice'
import FullGrid from '../parentGrid/parent-grid';
import { FiEdit } from 'react-icons/fi';
import { MdDoNotDisturb } from "react-icons/md";
import ConfirmationModal from '../../AlertDialog/AlertDialog';
import SendInvite from '../../SendInvite/SendInvite';
import {
  closeSendInvite,
  openSendInvite,
} from '../../Redux/slice/auth/sendInviteSlice';
import { RootState } from '../../Redux/reducers';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import SnackbarComponent from '../../Snackbar/Snackbar';
import styles from './InviteBroker.module.css'

interface Site {
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
  isNew: boolean;
  createdBy: number;
}

const InviteBroker: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeactivateConfiramtion] = useState<boolean>(false);
  const [deleteId, setDeactivateId] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<Partial<Site>>({});
  const dispatch = useDispatch<AppDispatch>();
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const inviteOpen = useSelector((state: RootState) => state.sendInvite.open);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const brokers = useSelector((state: RootState) => state.inviteBroker.brokers);
  const [formData, setFormData] = useState<Site>({
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
    isNew: true,
    createdBy: 0,
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: brokers.length,
    page: 0,
  });

  const snackbarOpen = useSelector(
    (state: RootState) => state.inviteBroker.snackbarOpen
  );
  const snackbarMessage = useSelector(
    (state: RootState) => state.inviteBroker.snackbarMessage
  );

  useEffect(() => {
    dispatch(fetchBrokers());
    dispatch(fetchingbrokerdetails());
  }, [dispatch]);

  useEffect(() => {
    setPaginationModel(prev => ({ ...prev, pageSize: brokers.length }));
  }, [brokers]);

  const handleOpen = () => setOpen(true);

  const trimFormData = (data: Site) => ({
    ...data,
    email: data.email.trim(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    mobile: data.mobile.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    country: data.country.trim(),
    zipcode: data.zipcode.trim(),
  });

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
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
      isNew: true,
      createdBy: 0,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    let valid = true;
    const errors: Partial<Site> = {};

    if (!formData.firstName) {
      errors.firstName = 'First Name is required';
      valid = false;
    }

    if (!formData.lastName) {
      errors.lastName = 'Last Name is required';
      valid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      valid = false;
    }

    if (!formData.mobile) {
      errors.mobile = 'Mobile Number is required';
      valid = false;
    } else if (!/\d/.test(formData.mobile)) {
      errors.mobile = 'Mobile Number must be only digits';
      valid = false;
    } else if (formData.mobile.length > 15) {
      errors.mobile = 'Mobile Number length should not exceed 15 digits';
      valid = false;
    }
    if (!formData.address) {
      errors.address = 'Address is required';
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


    if (!formData.zipcode) {
      errors.zipcode = 'Zipcode is required';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const cancelDelete = () => {
    setDeactivateConfiramtion(false);
  };

  const handleAdd = () => {
    if (validateForm()) {
      const trimmedData = trimFormData(formData);
      dispatch(addBroker(trimmedData));
      handleClose();
    }
  };

  const handleEdit = (id: number) => {
    const broker = brokers.find((broker) => broker.id === id);
    if (broker) {
      setFormData(broker);
      handleOpen();
    }
  };

  const handleUpdate = () => {
    if (validateForm()) {
      const trimmedData = trimFormData(formData);
      dispatch(updateBroker(trimmedData));
      handleClose();
    }
  };

  const handleDeactivate = (id: number) => {
    setDeactivateConfiramtion(true);
    setDeactivateId(id);
  };

  const handleConfirmDeactivate = () => {
    const payload = { isActive: false }
    dispatch(setActiveBroker(deleteId, payload));
    setDeactivateConfiramtion(false);
    dispatch(fetchingbrokerdetails());
  };

  const handleOpenPopup = (componentName: string) => {
    setSelectedComponent(componentName);
    setOpenPopup(true);

    if (componentName === 'SendInvite') {
      dispatch(openSendInvite());
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedComponent(null);

    if (selectedComponent === 'SendInvite') {
      dispatch(closeSendInvite());
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(setSnackbarOpen(false));
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'firstName', width: 140 },
    { field: 'lastName', headerName: 'lastName', width: 150 },
    { field: 'email', headerName: 'email', width: 250, },
    // { field: 'roleName', headerName: 'Role', width: 120 },
    { field: 'mobile', headerName: 'mobile', width: 150 },
    { field: 'address', headerName: 'address', width: 200, },
    { field: 'city', headerName: 'City', width: 140, },
    { field: 'state', headerName: 'state', width: 140, },
    { field: 'zipcode', headerName: 'Zipcode', width: 100, },
    // { field: 'country', headerName: 'Country', width: 120 },
    { field: 'isActive', headerName: 'isActive', width: 90, },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      disableExport: true,
      renderCell: (params) => (
        <>
          <FiEdit
            style={{ marginRight: 28, cursor: 'pointer' }}
            onClick={() => handleEdit(params.row.id)}
          />
          <MdDoNotDisturb
            style={{ cursor: 'pointer' }}
            onClick={() => handleDeactivate(params.row.id)}
          />
        </>
      ),
    },
  ];

  // Determine the severity based on the snackbar message
  const snackbarSeverity = snackbarMessage?.includes('successfully')
    ? 'success'
    : 'error';

  return (
    <div>
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
        onClick={() => handleOpenPopup('SendInvite')}
      >
        send invite
      </Button>

      <Dialog open={openPopup} sx={{ padding: 0, margin: 0 }} maxWidth="lg">
        <DialogTitle sx={{ padding: 0 }}>
          <Icon
            aria-label="close"
            onClick={handleClosePopup}
            sx={{
              position: 'absolute',
              right: 18,
              top: 8,
              zIndex: 999,
              fontSize: 30,
              cursor: 'pointer',
            }}
          >
            <CloseIcon />
          </Icon>
        </DialogTitle>

        <DialogContent sx={{ padding: 0 }}>
          {inviteOpen && selectedComponent === 'SendInvite' && (
            <SendInvite onCloseDialog={handleClosePopup} />
          )}
        </DialogContent>
      </Dialog>

      <FullGrid
        sx={{
          height: 'calc(100vh - 8rem)'
        }}
        rows={brokers}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />

      <ConfirmationModal
        show={deleteConfirmation}
        onHide={cancelDelete}
        onConfirm={handleConfirmDeactivate}
        title="Deactivate User"
        message="Are you sure you want to deactivate this user?"
        cancelText="Cancel"
        confirmText="Deactivate"
        cancelVariant="secondary"
        confirmVariant="danger"
      />

      <Dialog open={open} onClose={handleClose} sx={{ width: 1 }}>
        <DialogTitle className="dialogtitle" style={{ height: 50, fontSize: '1rem', letterSpacing: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', textTransform: 'uppercase' }}>
          {formData.id ? 'Edit Broker Details' : 'Add Property'}

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
            margin="dense"
            name="firstName"
            label="firstName"
            type="text"
            size='small'
            autoComplete='off'
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
            size='small'
            autoComplete='off'
            fullWidth
            value={formData.lastName}
            onChange={handleChange}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="email"
            type="text"
            size='small'
            autoComplete='off'
            disabled
            title='You cannot edit this Field'
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="dense"
            name="mobile"
            label="mobile"
            type="number"
            size='small'
            autoComplete='off'
            fullWidth
            value={formData.mobile}
            onChange={handleChange}
            error={!!formErrors.mobile}
            helperText={formErrors.mobile}
          />
          <TextField
            margin="dense"
            name="address"
            label="address"
            type="text"
            size='small'
            autoComplete='off'
            fullWidth
            value={formData.address}
            onChange={handleChange}
            error={!!formErrors.address}
            helperText={formErrors.address}
          />
          <TextField
            margin="dense"
            name="state"
            label="state"
            type="text"
            size='small'
            autoComplete='off'
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
            size='small'
            autoComplete='off'
            fullWidth
            value={formData.city}
            onChange={handleChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
          />
          {/* <TextField
            margin="dense"
            name="country"
            label="Country"
            type="text"
            size='small'
            autoComplete='off'
            fullWidth
            value={formData.country}
            onChange={handleChange}
            error={!!formErrors.country}
            helperText={formErrors.country}
          /> */}
          <TextField
            margin="dense"
            name="zipcode"
            label="Zipcode"
            type="number"
            size='small'
            autoComplete='off'
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
            color="success"
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

export default InviteBroker;
