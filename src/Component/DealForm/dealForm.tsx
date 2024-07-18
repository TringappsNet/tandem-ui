import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNewDeal,
  updateDealDetails,
  fetchDealDetails,
} from '../Redux/slice/deal/dealSlice';
import { closeDealForm } from '../Redux/slice/deal/dealFormSlice';
import { Deal } from '../Interface/DealFormObject';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  MenuItem,
  TextField,
  Box,
  StepConnector,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  // StepIcon,
  // colors,
} from '@mui/material';
import styles from './dealForm.module.css';
import { RootState } from '../Redux/reducers';

import { AppDispatch } from '../Redux/store/index';
import {
  clearCurrentDeal,
  setCurrentDeal,
} from '../Redux/slice/deal/currentDeal';
import { fetchSites } from '../Redux/slice/site/siteSlice';

import { fetchBrokers } from '../Redux/slice/broker/brokerSlice';
// import { purple } from '@mui/material/colors';

const steps = [
  {
    label: 'Tandem',
    fields: [
      { type: 'dropdown', label: 'propertyName', options: [] },
      { type: 'dropdown', label: 'brokerName', options: [] },
      { type: 'date', label: 'dealStartDate' },
    ],
  },
  { label: 'Proposal', fields: [{ type: 'date', label: 'proposalDate' }] },
  { label: 'LOI Execute', fields: [{ type: 'date', label: 'loiExecuteDate' }] },
  {
    label: 'Lease Signed',
    fields: [{ type: 'date', label: 'leaseSignedDate' }],
  },
  {
    label: 'Notice to Proceed',
    fields: [{ type: 'date', label: 'noticeToProceedDate' }],
  },
  {
    label: 'Commercial Operation',
    fields: [{ type: 'date', label: 'commercialOperationDate' }],
  },
  {
    label: 'Potential Commission',
    fields: [
      { type: 'date', label: 'potentialCommissionDate' },
      { type: 'text', label: 'potentialCommission' },
    ],
  },
  { label: 'Completed', fields: [] },
];

interface DealFormProps {
  deal?: Deal;
}

const DealForm: React.FC<DealFormProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentDeal = useSelector(
    (state: RootState) => state.currentDeal.currentDeal
  );
  const open = useSelector((state: RootState) => state.dealForm.open);
  const sites = useSelector((state: RootState) => state.site.sites);
  const brokers = useSelector((state: RootState) => state.broker.brokers);
  const deals = useSelector((state: RootState) => state.deal.dealDetails);
  // const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  // const user = useSelector((state: RootState) => state.auth.user);

  const [activeStep, setActiveStep] = useState(currentDeal?.activeStep || 0);

  const [formData, setFormData] = useState<Deal>({
    id: currentDeal?.id || null,
    brokerName: currentDeal?.brokerName || '',
    propertyName: currentDeal?.propertyName || '',
    dealStartDate: currentDeal?.dealStartDate || '',
    proposalDate: currentDeal?.proposalDate || '',
    loiExecuteDate: currentDeal?.loiExecuteDate || '',
    leaseSignedDate: currentDeal?.leaseSignedDate || '',
    noticeToProceedDate: currentDeal?.noticeToProceedDate || '',
    commercialOperationDate: currentDeal?.commercialOperationDate || '',
    potentialCommissionDate: currentDeal?.potentialCommissionDate || '',
    potentialCommission: currentDeal?.potentialCommission || 0,
    status: currentDeal?.status || '',
    activeStep: currentDeal?.activeStep ?? 0,
    createdBy: currentDeal?.createdBy || 0,
    updatedBy: currentDeal?.updatedBy || 0,
    isNew: currentDeal?.isNew || true,
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchBrokers());
    dispatch(fetchSites());
    dispatch(fetchDealDetails());
  }, [dispatch]);

  useEffect(() => {
    if (brokers.length > 0) {
      setUserId(brokers[0].id);
    }
  }, [brokers]);

  const handleNext = () => {
    if (saveSuccess) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSaveSuccess(false);
    }
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name.endsWith('Date')) {
      const formattedDate = value.split('T')[0];
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

    console.log(`Changed ${name} to:`, value); // For debugging
  };

  const saveFormData = () => {
    const status = getStatus(activeStep);
    const brokerId =
      brokers.find((broker) => broker.name === formData.brokerName)?.id || null;
    const payload = {
      ...formData,
      activeStep: activeStep + 1,
      status,
      brokerId,
      createdBy: userId || 0,
      updatedBy: userId || 0,
    };

    try {
      dispatch(setCurrentDeal(payload));
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving form data:', error);
      setSaveSuccess(false);
    }
  };

  const dispatchFormDataOnClose = async () => {
    try {
      if (currentDeal) {
        if (currentDeal.id) {
          dispatch(updateDealDetails(currentDeal));
          dispatch(clearCurrentDeal());
        } else {
          dispatch(createNewDeal(currentDeal));
          dispatch(clearCurrentDeal());
        }
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const getStatus = (step: number) => {
    if (step === 0) return 'Started';
    if (step > 0 && step < 6) return 'In-Progress';
    if (step === 6) return 'Completed';
    return '';
  };

  const renderField = (
    field: { label: string; type: string; options?: string[] },
    index: number
  ) => {
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
            sx={{ width: 300 }}
            margin="normal"
            size="small"
          >
            {label === 'brokerName'
              ? brokers
                  .filter((broker) => !broker.isAdmin)
                  .map((broker, idx) => (
                    <MenuItem key={idx} value={broker.name}>
                      {broker.name}
                    </MenuItem>
                  ))
              : label === 'propertyName'
              ? sites
                  .filter(
                    (site) =>
                      !deals.some(
                        (deal) =>
                          deal.propertyName ===
                          `${site.addressline1}, ${site.addressline2}`
                      )
                  )
                  .map((site, idx) => (
                    <MenuItem
                      key={idx}
                      value={`${site.addressline1}, ${site.addressline2}`}
                    >
                      {`${site.addressline1}, ${site.addressline2}`}
                    </MenuItem>
                  ))
              : options?.map((option: string, idx: number) => (
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
            value={
              formData[label as keyof Deal]?.toLocaleString().split('T')[0] ||
              ''
            }
            onChange={handleChange}
            margin="normal"
            size="small"
            sx={{ width: 300 }}
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
            sx={{ width: 300 }}
          />
        );
      default:
        return null;
    }
  };

  function isFormValid() {
    if (activeStep >= steps.length) return false;
    const currentFields = steps[activeStep]?.fields || [];
    for (const field of currentFields) {
      if (!formData[field.label as keyof Deal]) {
        return false;
      }
    }
    return true;
  }

  const renderSummary = () => {
    const events = [
      { label: 'Deal Start', date: formData.dealStartDate },
      { label: 'Proposal', date: formData.proposalDate },
      { label: 'LOI Execute', date: formData.loiExecuteDate },
      { label: 'Lease Signed', date: formData.leaseSignedDate },
      { label: 'Notice to Proceed', date: formData.noticeToProceedDate },
      { label: 'Commercial Operation', date: formData.commercialOperationDate },
      {
        label: 'Potential Commission Date',
        date: formData.potentialCommissionDate,
      },
    ];

    return (
      <div className={styles.summaryContainer}>
        <Typography variant="h5" gutterBottom>
          <div className={styles.summary}>Summary of the deal</div>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          {events.map((event, index) => (
            <Box
              key={index}
              sx={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                width: 'calc(33.33% - 10px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#f9f9f9',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '60px',
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                textAlign="center"
              >
                {event.label}:
              </Typography>
              <Typography textAlign="center">
                {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              border: '2px solid #262262',
              borderRadius: '4px',
              padding: '10px',
              width: 'calc(33.33% - 10px)',
              boxShadow: '0 4px 8px rgba(38, 34, 98, 0.2)',
              backgroundColor: '#f0f0ff',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '60px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 6px 12px rgba(38, 34, 98, 0.3)',
              },
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              textAlign="center"
              color="#262262"
            >
              Potential Commission:
            </Typography>
            <Typography
              textAlign="center"
              fontWeight="bolder"
              variant="h6"
              color="#262262"
            >
              {formData.potentialCommission
                ? `$${formData.potentialCommission.toLocaleString()}`
                : 'N/A'}
            </Typography>
          </Box>
        </Box>
      </div>
    );
  };

  return (
    <Dialog
      fullScreen
      sx={{
        margin: '30px 200px',
        '& .MuiDialog-paper': {
          height: 'calc(100% - 60px)',
          maxHeight: 'none',
        },
      }}
      open={open}
      onClose={() => {
        dispatch(closeDealForm());
        dispatchFormDataOnClose();
        dispatch(clearCurrentDeal());
      }}
      className={styles.popupmain}
    >
      <DialogTitle
        sx={{
          background:
            'linear-gradient(58deg, rgb(11 34 67) 0%, rgb(30 62 108) 35%, rgb(16 42 79) 100%);',
          color: 'white',
          height: '44px',
          padding: '6px 24px',
          letterSpacing: '.18rem',
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        DEALFORM
        <IconButton
          aria-label="close"
          onClick={() => {
            dispatch(closeDealForm());
            dispatchFormDataOnClose();
            dispatch(clearCurrentDeal());
          }}
          sx={{
            position: 'absolute',
            right: 25,
            top: 2,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <button
            className="saveclose"
            style={{
              height: '24px',
              width: '100px',
              border: '1px solid whitesmoke',
              borderRadius: '3px',
              color: 'white',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Save/Close
          </button>
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 44px)', // Subtracting the height of DialogTitle
          overflow: 'hidden',
        }}
      >
        <div
          className={styles.dealcontainer}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {' '}
          <Box
            sx={{
              width: 1,
              marginTop: '3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<StepConnector />}
              sx={{ width: 1 }}
            >
              {steps.map((step, index) => (
                <Step key={index} sx={{ width: 1 }}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box
              sx={{
                width: '100%',
                marginTop: '10px', // Add 20px gap here
                display: 'flex',
                flexDirection: 'column',
                padding: '30px',
              }}
            >
              {activeStep < steps.length - 1 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textTransform: 'capitalize',
                  }}
                >
                  {steps[activeStep].fields.map((field, index) =>
                    renderField(field, index)
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={saveFormData}
                    sx={{ width: 100, marginTop: 3, zIndex: 999 }}
                    disabled={!isFormValid()}
                  >
                    Save
                  </Button>
                </Box>
              ) : (
                renderSummary()
              )}
              {activeStep === steps.length - 1 ? (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: 'green' }}>
                    {/* Deal is Completed */}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%',
                      position: 'absolute',
                      right: 60,
                      bottom: 146,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      sx={{ width: 100 }}
                      disabled={!saveSuccess || !isFormValid()}
                    >
                      {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealForm;
