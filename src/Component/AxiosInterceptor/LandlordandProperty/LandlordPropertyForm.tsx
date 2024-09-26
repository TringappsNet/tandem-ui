import React, { useEffect, useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, DialogContent, DialogActions, SelectChangeEvent, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addSite, setSnackbarOpen as setSnackbarOpenSite } from '../../Redux/slice/site/siteSlice';
import { Landlord } from '../../Grids/landlordGrid/Landlord';
import { Site } from '../../Grids/SiteGrid/SiteGrid';
import { RootState } from '../../Redux/reducers';
import { addLandlord, fetchLandlords, setSnackbarOpen as setSnackbarOpenLandlord } from '../../Redux/slice/landlord/landlordSlice';
import { AppDispatch } from '../../Redux/store';
import SnackbarComponent from '../../Snackbar/Snackbar';



const LandlordAndPropertyForm = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchLandlords());
    }, [dispatch])

    // Initial form states
    const initialLandlordState: Landlord = {
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
    };

    const initialPropertyState: Site = {
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
    };

    const [landlordData, setLandlordData] = useState<Landlord>(initialLandlordState);
    const [propertyData, setPropertyData] = useState<Site>(initialPropertyState);

    // Separate form error states for landlord and property
    const [landlordErrors, setLandlordErrors] = useState<Partial<Landlord>>({});
    const [propertyErrors, setPropertyErrors] = useState<Partial<Site>>({});
    const landlorddetails = useSelector((state: RootState) => state.landlord.landlords);
    const snackbarSiteOpen = useSelector(
        (state: RootState) => state.site.snackbarOpen
    );
    const snackbarSiteMessage = useSelector(
        (state: RootState) => state.site.snackbarMessage
    );

    const snackbarLandlordOpen = useSelector(
        (state: RootState) => state.landlord.snackbarOpen
    );
    const snackbarLanlordMessage = useSelector(
        (state: RootState) => state.landlord.snackbarMessage
    );

    // Reset Landlord Form
    const resetLandlordForm = () => {
        setLandlordData(initialLandlordState);
        setLandlordErrors({});
    };

    const handleCloseSnackbarSite = () => {
        dispatch(setSnackbarOpenSite(false));
    };

    const handleCloseSnackbarLandlord = () => {
        dispatch(setSnackbarOpenLandlord(false));
    };
    const snackbarSeverity = (snackbarSiteMessage || snackbarLanlordMessage)?.includes('successfully')
        ? 'success'
        : 'error';

    // Reset Property Form
    const resetPropertyForm = () => {
        setPropertyData(initialPropertyState);
        setPropertyErrors({});
    };

    // Validation and trimming logic for Landlord
    const validateLandlordForm = () => {
        let valid = true;
        const errors: Partial<Landlord> = {};

        if (!landlordData.name) {
            errors.name = 'Landlord name is required';
            valid = false;
        }
        if (!landlordData.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
            valid = false;
        }
        if (!landlordData.email) {
            errors.email = 'Email is required';
            valid = false;
        }
        if (!landlordData.address1) {
            errors.address1 = 'Address Line 1 is required';
            valid = false;
        }
        if (!landlordData.city) {
            errors.city = 'City is required';
            valid = false;
        }
        if (!landlordData.state) {
            errors.state = 'State is required';
            valid = false;
        }
        if (!landlordData.country) {
            errors.country = 'Country is required';
            valid = false;
        }
        if (!landlordData.zipcode) {
            errors.zipcode = 'Zipcode is required';
            valid = false;
        }

        setLandlordErrors(errors);
        return valid;
    };

    // Validation and trimming logic for Property
    const validatePropertyForm = () => {
        let valid = true;
        const errors: Partial<Site> = {};

        if (!propertyData.addressline1) {
            errors.addressline1 = 'Address Line 1 is required';
            valid = false;
        }
        if (!propertyData.city) {
            errors.city = 'City is required';
            valid = false;
        }
        if (!propertyData.state) {
            errors.state = 'State is required';
            valid = false;
        }
        if (!propertyData.country) {
            errors.country = 'Country is required';
            valid = false;
        }
        if (!propertyData.zipcode) {
            errors.zipcode = 'Zipcode is required';
            valid = false;
        }
        if (!propertyData.landlordId) {
            errors.landlordId = 1;
            valid = false;
        }

        setPropertyErrors(errors);
        return valid;
    };

    const trimLandlordData = (data: Landlord) => ({
        ...data,
        name: data.name.trim(),
        phoneNumber: data.phoneNumber.trim(),
        email: data.email.trim(),
        address1: data.address1.trim(),
        address2: data.address2.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
        zipcode: data.zipcode.trim(),
    });

    const trimPropertyData = (data: Site) => ({
        ...data,
        addressline1: data.addressline1.trim(),
        addressline2: data.addressline2.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
        zipcode: data.zipcode.trim(),
    });

    const handleSaveLandlord = () => {
        if (validateLandlordForm()) {
            const trimmedLandlordData = trimLandlordData(landlordData);
            dispatch(addLandlord(trimmedLandlordData));
            resetLandlordForm();

        }
    };

    const handleSaveProperty = () => {
        if (validatePropertyForm()) {
            const trimmedPropertyData = trimPropertyData(propertyData);
            dispatch(addSite(trimmedPropertyData));
            resetPropertyForm();
        }
    };

    return (
        <>
            <Box sx={{
                margin: 0, padding: 0, display: 'flex', gap: 3, paddingTop: 2, '@media (max-width:763px)': {
                    flexDirection: 'column',
                    alignItems: 'center',
                }
            }}>
                {/* Left Column: Landlord Details */}
                <Box sx={{ margin: 0, padding: 0, width: '50%', '@media (max-width:763px)': { width: '100%' } }}>
                    <DialogContent sx={{ padding: 0, margin: 0 }}>
                        <Typography variant='h5' align='center'>Add Landlord</Typography>
                        <TextField
                            margin="dense"
                            name="name"
                            label="Name"
                            fullWidth
                            size="small"
                            autoComplete='off'
                            value={landlordData.name}
                            onChange={(e) => setLandlordData({ ...landlordData, name: e.target.value })}
                            error={!!landlordErrors.name}
                            helperText={landlordErrors.name}
                        />
                        <TextField
                            margin="dense"
                            name="phoneNumber"
                            label="Phone Number"
                            type="number"
                            size="small"
                            fullWidth
                            autoComplete='off'
                            value={landlordData.phoneNumber}
                            onChange={(e) => setLandlordData({ ...landlordData, phoneNumber: e.target.value })}
                            error={!!landlordErrors.phoneNumber}
                            helperText={landlordErrors.phoneNumber}
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            type="email"
                            autoComplete='off'
                            size="small"
                            fullWidth
                            value={landlordData.email}
                            onChange={(e) => setLandlordData({ ...landlordData, email: e.target.value })}
                            error={!!landlordErrors.email}
                            helperText={landlordErrors.email}
                        />
                        <TextField
                            margin="dense"
                            name="address1"
                            label="Address 1"
                            fullWidth
                            autoComplete='off'
                            size="small"
                            value={landlordData.address1}
                            onChange={(e) => setLandlordData({ ...landlordData, address1: e.target.value })}
                            error={!!landlordErrors.address1}
                            helperText={landlordErrors.address1}
                        />
                        <TextField
                            margin="dense"
                            name="address2"
                            label="Address 2"
                            fullWidth
                            autoComplete='off'
                            size="small"
                            value={landlordData.address2}
                            onChange={(e) => setLandlordData({ ...landlordData, address2: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            name="city"
                            label="City"
                            autoComplete='off'
                            size="small"
                            fullWidth
                            value={landlordData.city}
                            onChange={(e) => setLandlordData({ ...landlordData, city: e.target.value })}
                            error={!!landlordErrors.city}
                            helperText={landlordErrors.city}
                        />
                        <TextField
                            margin="dense"
                            name="state"
                            label="State"
                            autoComplete='off'
                            size="small"
                            fullWidth
                            value={landlordData.state}
                            onChange={(e) => setLandlordData({ ...landlordData, state: e.target.value })}
                            error={!!landlordErrors.state}
                            helperText={landlordErrors.state}
                        />
                        <TextField
                            margin="dense"
                            name="country"
                            label="Country"
                            autoComplete='off'
                            size="small"
                            fullWidth
                            value={landlordData.country}
                            onChange={(e) => setLandlordData({ ...landlordData, country: e.target.value })}
                            error={!!landlordErrors.country}
                            helperText={landlordErrors.country}
                        />
                        <TextField
                            margin="dense"
                            name="zipcode"
                            label="Zipcode"
                            type="number"
                            autoComplete='off'
                            size="small"
                            fullWidth
                            value={landlordData.zipcode}
                            onChange={(e) => setLandlordData({ ...landlordData, zipcode: e.target.value })}
                            error={!!landlordErrors.zipcode}
                            helperText={landlordErrors.zipcode}
                        />
                    </DialogContent>

                    <DialogActions sx={{ paddingBottom: 2, paddingRight: 2, '@media (max-width:763px)': { justifyContent: 'space-between' } }}>
                        <Button onClick={resetLandlordForm} size="small" variant="outlined">
                            Reset
                        </Button>
                        <Button onClick={handleSaveLandlord} size="small" variant="contained">
                            Save Landlord
                        </Button>
                    </DialogActions>
                </Box>

                {/* Right Column: Property Details */}
                <Box sx={{ margin: 0, padding: 0, width: '50%', '@media (max-width:763px)': { width: '100%' } }}>
                    <DialogContent sx={{ padding: 0, margin: 0 }}>
                        <Typography variant='h5' align='center'>Add Property</Typography>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="landlord-select-label" size="small">
                                Landlord Name
                            </InputLabel>
                            <Select
                                labelId="landlord-select-label"
                                id="landlord-select"
                                autoComplete='off'
                                size="small"
                                name="landlordId"
                                value={propertyData.landlordId === 0 ? '' : String(propertyData.landlordId)} // Convert to string
                                label="Landlord Name"
                                onChange={(event: SelectChangeEvent<string>) => setPropertyData({ ...propertyData, landlordId: Number(event.target.value) })} // Store as number
                                error={!!propertyErrors.landlordId}
                            >
                                {landlorddetails.map((landlord) => (
                                    <MenuItem key={landlord.id} value={landlord.id.toString()}> {/* Convert to string */}
                                        {landlord.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {propertyErrors.landlordId && <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '.25rem', marginLeft: '.80rem' }}>{propertyErrors.landlordId ? 'Landlord Name is required' : null}</p>}
                        <TextField
                            margin="dense"
                            name="addressline1"
                            label="Address Line 1"
                            fullWidth
                            autoComplete='off'
                            size="small"
                            value={propertyData.addressline1}
                            onChange={(e) => setPropertyData({ ...propertyData, addressline1: e.target.value })}
                            error={!!propertyErrors.addressline1}
                            helperText={propertyErrors.addressline1}
                        />
                        <TextField
                            margin="dense"
                            name="addressline2"
                            label="Address Line 2"
                            fullWidth
                            autoComplete='off'
                            size="small"
                            value={propertyData.addressline2}
                            onChange={(e) => setPropertyData({ ...propertyData, addressline2: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            name="city"
                            label="City"
                            fullWidth
                            autoComplete='off'
                            size="small"
                            value={propertyData.city}
                            onChange={(e) => setPropertyData({ ...propertyData, city: e.target.value })}
                            error={!!propertyErrors.city}
                            helperText={propertyErrors.city}
                        />
                        <TextField
                            margin="dense"
                            name="state"
                            label="State"
                            fullWidth
                            autoComplete='off'
                            size="small"
                            value={propertyData.state}
                            onChange={(e) => setPropertyData({ ...propertyData, state: e.target.value })}
                            error={!!propertyErrors.state}
                            helperText={propertyErrors.state}
                        />
                        <TextField
                            margin="dense"
                            name="country"
                            label="Country"
                            fullWidth
                            autoComplete='off'
                            size="small"
                            value={propertyData.country}
                            onChange={(e) => setPropertyData({ ...propertyData, country: e.target.value })}
                            error={!!propertyErrors.country}
                            helperText={propertyErrors.country}
                        />
                        <TextField
                            margin="dense"
                            name="zipcode"
                            label="Zipcode"
                            type="number"
                            fullWidth
                            autoComplete='off'
                            size="small"
                            value={propertyData.zipcode}
                            onChange={(e) => setPropertyData({ ...propertyData, zipcode: e.target.value })}
                            error={!!propertyErrors.zipcode}
                            helperText={propertyErrors.zipcode}
                        />
                    </DialogContent>

                    <DialogActions sx={{ paddingBottom: 2, paddingRight: 2, '@media (max-width:763px)': { justifyContent: 'space-between' } }}>
                        <Button onClick={resetPropertyForm} size="small" variant="outlined">
                            Reset
                        </Button>
                        <Button onClick={handleSaveProperty} size="small" variant="contained">
                            Save Property
                        </Button>
                    </DialogActions>
                </Box>
            </Box>
            <SnackbarComponent
                open={snackbarSiteOpen || snackbarLandlordOpen}
                message={snackbarSiteMessage || snackbarLanlordMessage || ''}
                onClose={handleCloseSnackbarLandlord || handleCloseSnackbarSite}
                severity={snackbarSeverity}
                style={{ backgroundColor: '#54B471', color: '#FEF9FD' }}
            />
        </>
    );
};

export default LandlordAndPropertyForm;
