import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, MenuItem, TextField, Box, StepConnector } from '@mui/material';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import { Deal } from '../Interface/DealFormObject';
import { useDispatch } from 'react-redux';
// import { RootState } from '../Redux/reducers/index';
import { setDealDetails } from '../Redux/slice/dealSlice';
import styles from './Milestone.module.css';

const steps = [
    { label: 'Tandem', fields: [{ type: 'dropdown', label: 'propertyName', options: ['Land', 'Land1'] }, { type: 'dropdown', label: 'brokerName', options: [] }, { type: 'date', label: 'dealStartDate' }] },
    { label: 'Proposal', fields: [{ type: 'date', label: 'proposalDate' }] },
    { label: 'LOI Execute', fields: [{ type: 'date', label: 'loiExecuteDate' }] },
    { label: 'Lease Signed', fields: [{ type: 'date', label: 'leaseSignedDate' }] },
    { label: 'Notice to Proceed', fields: [{ type: 'date', label: 'noticeToProceedDate' }] },
    { label: 'Commercial Operation', fields: [{ type: 'date', label: 'commercialOperationDate' }] },
    { label: 'Potential Commission', fields: [{ type: 'date', label: 'potentialCommissionDate' }, { type: 'text', label: 'potentialCommission' }] },
];

// interface IMilestoneProps {
//     selectedDeal: Deal | undefined;
// }

const DealForm = () => {
    const dispatch = useDispatch();
    // const dealDetails = useSelector((state: RootState) => state.deal.dealDetails);

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<Deal>({
        id: null,
        brokerName: '',
        propertyName: '',
        dealStartDate: '',
        proposalDate: '',
        loiExecuteDate: '',
        leaseSignedDate: '',
        noticeToProceedDate: '',
        commercialOperationDate: '',
        potentialcommissiondate: '',
        potentialCommission: null,
        status: '',
        activeStep: 0,
    });
    const [brokerOptions, setBrokerOptions] = useState<string[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [isFirstSave, setIsFirstSave] = useState(true); // Track if it's the first save
    const [saveSuccess, setSaveSuccess] = useState(false); // Track save success

    useEffect(() => {
        fetchBrokers();
    }, []);

    // useEffect(() => {
    //     if (props.selectedDeal) {
    //         setFormData(props.selectedDeal);
    //         setActiveStep(props.selectedDeal.activeStep || 0);
    //         setIsFirstSave(false);
    //     }
    // }, [props.selectedDeal]);

    const fetchBrokers = async () => {
        try {
            const response = await axiosInstance.get('/brokers');
            const brokers = response.data.map((broker: any) => `${broker.user.firstname} ${broker.user.lastname}`);
            setBrokerOptions(brokers);
            if (response.data.length > 0) {
                setUserId(response.data[0].user.id);
            }
        } catch (error) {
            console.error('Error fetching broker names:', error);
        }
    };

    const handleNext = () => {
        if (saveSuccess) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSaveSuccess(false);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Ensure date fields are formatted correctly
        if (name.endsWith('Date')) {
            // Format the date to yyyy-MM-dd if it's a date field
            const formattedDate = value.split('T')[0]; // Extract yyyy-MM-dd from ISO format

            setFormData((prevData) => ({
                ...prevData,
                [name]: formattedDate,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const saveFormData = () => {
        const status = getStatus(activeStep);
        const payload = {
            ...formData,
            activeStep: activeStep + 1,
            status,
            createdBy: userId,
            updatedBy: userId,
            isNew: isFirstSave,
        };

        try {
            localStorage.setItem('dealdetails', JSON.stringify(payload));
            setSaveSuccess(true);
            setIsFirstSave(false);

        } catch (error) {
            console.error('Error saving form data:', error);
            setSaveSuccess(false);
        }

        // Dispatch action to update dealDetails in Redux store
        dispatch(setDealDetails(payload));
    };

    const getStatus = (step: number) => {
        if (step === 0) return 'Started';
        if (step > 0 && step < 6) return 'In-Progress';
        if (step === 6) return 'Completed';
        return '';
    };

    const renderField = (field: any, index: number) => {
        const { label, type, options } = field;

        switch (type) {
            case 'dropdown':
                return (
                    <TextField
                        key={index}
                        select
                        label={label}
                        name={label}
                        value={formData[label as keyof Deal] || ''}
                        onChange={handleChange}
                        sx={{ width: 200 }}
                        margin="normal"
                        size="small"
                    >
                        {label === 'brokerName'
                            ? brokerOptions.map((option, idx) => (
                                <MenuItem key={idx} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                            : options.map((option: string, idx: number) => (
                                <MenuItem key={idx} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                    </TextField>
                );
            case 'date':
                return (
                    <TextField
                        key={index}
                        type="date"
                        label={label}
                        name={label}
                        value={formData[label as keyof Deal]?.toLocaleString().split('T')[0] || ''}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                        sx={{ width: 200 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                );
            case 'text':
                return (
                    <TextField
                        key={index}
                        type="text"
                        label={label}
                        name={label}
                        value={formData[label as keyof Deal] || ''}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                        sx={{ width: 200 }}
                    />
                );
            default:
                return null;
        }
    };

    function isFormValid() {
        const currentFields = steps[activeStep].fields;
        for (const field of currentFields) {
            if (!formData[field.label as keyof Deal]) {
                return false;
            }
        }
        return true;
    }

    return (
        <div className={styles.dealcontainer}>
            <Box sx={{ width: 1, marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Stepper activeStep={activeStep} alternativeLabel connector={<StepConnector />} sx={{ width: 1 }}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ width: '100%', marginTop: '30px', display: 'flex', flexDirection: 'column', padding: '30px' }}>
                    {activeStep === steps.length ? (
                        <Box>
                            <Typography variant="h3" sx={{ textAlign: 'center', color: 'green' }}>
                                Deal is Completed
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                    <Button disabled={activeStep === 0} onClick={handleBack} sx={{ width: 100 }}>
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        sx={{ width: 100 }}
                                        disabled={!saveSuccess || !isFormValid()}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {steps[activeStep].fields.map((field, index) => renderField(field, index))}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={saveFormData}
                                    sx={{ width: 100, marginTop: 2 }}
                                    disabled={!isFormValid()}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>

    );
};

export default DealForm;
