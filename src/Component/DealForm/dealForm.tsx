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

const steps = [
  {
    label: 'Tandem',
    fields: [
      { type: 'dropdown', label: 'propertyName', options: [] },
      { type: 'dropdown', label: 'brokerName', options: [] },
      { type: 'date', label: 'dealStartDate' },
    ],
  },
  { label: 'Proposal', fields: [{ type: 'date', label: 'proposalDate' }, { type: 'text', label: 'proposalCommission' }] },
  { label: 'LOI Execute', fields: [{ type: 'date', label: 'loiExecuteDate' }, { type: 'text', label: 'loiExecuteCommission' }] },
  {
    label: 'Lease Signed',
    fields: [{ type: 'date', label: 'leaseSignedDate' }, { type: 'text', label: 'leaseSignedCommission' }],
  },
  {
    label: 'Notice to Proceed',
    fields: [{ type: 'date', label: 'noticeToProceedDate' }, { type: 'text', label: 'noticeToProceedCommission' }],
  },
  {
    label: 'Commercial Operation',
    fields: [{ type: 'date', label: 'commercialOperationDate' }, { type: 'text', label: 'commercialOperationCommission' }],
  },
  {
    label: 'Potential Commission',
    fields: [
      { type: 'date', label: 'finalCommissionDate' },
      { type: 'text', label: 'finalCommission' },
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
  const userdetails = useSelector((state: RootState) => state.auth);
  const open = useSelector((state: RootState) => state.dealForm.open);
  const sites = useSelector((state: RootState) => state.site.sites);
  const brokers = useSelector((state: RootState) => state.broker.brokers);
  const deals = useSelector((state: RootState) => state.deal.dealDetails);
  const [activeStep, setActiveStep] = useState(currentDeal?.activeStep || 0);
  const [formData, setFormData] = useState<Deal>({
    id: currentDeal?.id || null,
    brokerName: currentDeal?.brokerName || '',
    propertyName: currentDeal?.propertyName || '',
    dealStartDate: currentDeal?.dealStartDate || '',
    proposalDate: currentDeal?.proposalDate || '',
    proposalCommission: currentDeal?.proposalCommission || 0,
    loiExecuteDate: currentDeal?.loiExecuteDate || '',
    loiExecuteCommission: currentDeal?.loiExecuteCommission || 0,
    leaseSignedDate: currentDeal?.leaseSignedDate || '',
    leaseSignedCommission: currentDeal?.leaseSignedCommission || 0,
    noticeToProceedDate: currentDeal?.noticeToProceedDate || '',
    noticeToProceedCommission: currentDeal?.noticeToProceedCommission || 0,
    commercialOperationDate: currentDeal?.commercialOperationDate || '',
    commercialOperationCommission: currentDeal?.commercialOperationCommission || 0,
    finalCommissionDate: currentDeal?.finalCommissionDate || '',
    finalCommission: currentDeal?.finalCommission || 0,
    status: currentDeal?.status || '',
    activeStep: currentDeal?.activeStep ?? 0,
    createdBy: currentDeal?.createdBy || 0,
    updatedBy: currentDeal?.updatedBy || 0,
    isNew: currentDeal?.isNew || true,
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userdetails.isAdmin) {
      dispatch(fetchBrokers());
      dispatch(fetchSites());
      dispatch(fetchDealDetails());
    }
  }, [dispatch, userdetails.isAdmin]);

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
  };

  const saveFormData = () => {
    const status = getStatus(activeStep);
    const brokerId =
      brokers.find((broker) => broker.name === formData.brokerName)?.id || null;
    const propertyId = sites.find((sites) => `${sites.addressline1}, ${sites.addressline2}` === formData.propertyName)?.id || null;
    const payload = {
      ...formData,
      activeStep: activeStep + 1,
      status,
      brokerId,
      propertyId,
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
            sx={{ width: 1, maxWidth: 300 }}
            margin="normal"
            size="small"
          >
            {label === 'brokerName'
              ? brokers
                .filter((broker) => !broker.isAdmin && broker.isActive)
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
            autoComplete='off'
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
            sx={{ width: 1, maxWidth: 300, cursor: 'pointer' }}
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
            autoComplete='off'
            value={formData[label as keyof Deal] || ''}
            onChange={handleChange}
            margin="normal"
            size="small"
            sx={{ width: 1, maxWidth: 300 }}
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
      { label: 'Deal Start', date: formData.dealStartDate, commission: null }, // No commission for Deal Start
      { label: 'Proposal', date: formData.proposalDate, commission: formData.proposalCommission },
      { label: 'LOI Execute', date: formData.loiExecuteDate, commission: formData.loiExecuteCommission },
      { label: 'Lease Signed', date: formData.leaseSignedDate, commission: formData.leaseSignedCommission },
      { label: 'Notice to Proceed', date: formData.noticeToProceedDate, commission: formData.noticeToProceedCommission },
      { label: 'Commercial Operation', date: formData.commercialOperationDate, commission: formData.commercialOperationCommission },
      { label: 'Final Commission Date', date: formData.finalCommissionDate },
    ];

    // Calculate total commission (excluding potential commission)
    const totalPotentialCommission = events
      .filter(event => event.label !== 'Potential Commission' && event.commission)
      .reduce((sum, event) => sum + Number(event.commission), 0);

    // Calculate total commission including potential commission
    const totalCommissionWithPotential = totalPotentialCommission + (formData.finalCommission ? Number(formData.finalCommission) : 0);

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
            '@media (max-width:763px)': { flexDirection: 'column' },
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
                '@media (max-width:763px)': { width: 1 },
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                textAlign="center"
                color={event.date ? '#000' : '#b3b3b3bb'}
              >
                {event.label}:
              </Typography>
              <Typography textAlign="center">
                {event.date ? (
                  <>
                    {new Date(event.date).toLocaleDateString()}{' '}
                    {event.commission && `$${Number(event.commission).toLocaleString()}`}
                  </>
                ) : (
                  <span style={{ color: '#b3b3b3bb' }}>Yet to Complete</span>
                )}
              </Typography>
            </Box>
          ))}

          <Box
            sx={{
              border: '2px solid #26226299',
              borderRadius: '4px',
              padding: '10px',
              width: 'calc(33.33% - 10px)',
              boxShadow: '0 4px 8px rgba(38, 34, 98, 0.2)',
              backgroundColor: '#f0f0ff',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 6px 12px rgba(38, 34, 98, 0.3)',
              },
              '@media (max-width:763px)': { width: 1 },
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              textAlign="center"
              color={formData.finalCommission ? '#262262' : '#5a577c88'}
            >
              Final Commission:
            </Typography>
            <Typography
              textAlign="center"
              fontWeight="bold"
              color={formData.finalCommission ? '#262262' : '#5a577c88'}
            >
              {formData.finalCommission
                ? `$${formData.finalCommission.toLocaleString()}`
                : 'Yet to Complete'}
            </Typography>
          </Box>

          <Box
            sx={{
              border: '2px solid #26226299',
              borderRadius: '4px',
              padding: '10px',
              width: 'calc(66.66% - 10px)',
              boxShadow: '0 4px 8px rgba(38, 34, 98, 0.2)',
              backgroundColor: '#f0f0ff',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 6px 12px rgba(38, 34, 98, 0.3)',
              },
              '@media (max-width:763px)': { width: 1 },
            }}
          >
            <Typography
              textAlign="center"
              color={totalCommissionWithPotential ? '#262262' : '#5a577c88'}
              sx={{ marginTop: '10px', fontWeight: 'bold', fontSize: '1.3rem' }}
            >
              Total Potential Commission: ${totalCommissionWithPotential.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {formData.activeStep !== 7 && (
          <Button
            sx={{ '@media (max-width:763px)': { marginTop: '1rem' } }}
            variant="contained"
            color="primary"
            onClick={() => setActiveStep(formData.activeStep)}
          >
            Back
          </Button>
        )}
      </div>
    );
  };

  return (
    <Dialog
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          width: 1,
          height:'100%',
          '@media (max-width:763px)': {
            maxHeight: '68%'
          }
        },
      }}
      open={open}
      onClose={() => {
        dispatch(closeDealForm());
        if (userdetails.isAdmin) {
          dispatchFormDataOnClose();
          dispatch(clearCurrentDeal());
        }
      }}
    >
      <DialogTitle
        sx={{
          background:
            'linear-gradient(58deg, rgb(35 39 43) 0%, rgb(79 84 89) 35%, rgb(32 46 59) 100%);',
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
            if (userdetails.isAdmin) {
              dispatchFormDataOnClose();
              dispatch(clearCurrentDeal());
            }
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
            {userdetails.isAdmin ? 'Save/Close' : 'Close'}
          </button>
        </IconButton>
      </DialogTitle>

      {/* Main Content */}
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem'
        }}
      >
        <Box
          sx={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            paddingTop: '1.5rem',
          }}
        >
          {/* Stepper (Div 1) */}
          <Box sx={{ width: '100%' }}>
            {(userdetails.isAdmin && activeStep !== 7) && (
              <Stepper
                orientation="horizontal"
                activeStep={activeStep}
                alternativeLabel
                connector={<StepConnector />}
                sx={{
                  '@media (max-width:763px)': {
                    overflow: 'scroll',
                  },
                }}
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Box>

          {/* Input Fields (Div 2) */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              paddingX: '30px',
              '@media (max-width: 767px)': {
                padding: 0,
                marginTop: 1,
                paddingX:0,
              },
            }}
          >
            {activeStep < steps.length - 1 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', textTransform: 'capitalize' }}>
                {steps[activeStep].fields.map((field, index) => renderField(field, index))}
              </Box>
            ) : (
              renderSummary()
            )}
          </Box>

          {/* Save/Next Buttons (Div 3) */}
          {activeStep < steps.length - 1 && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingX: '30px','@media (max-width:763px)': {
            padding:0
          } }}>
              <Button
                variant="contained"
                color="primary"
                onClick={saveFormData}
                sx={{ width: 100 }}
                disabled={!isFormValid()}
              >
                Save
              </Button>
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
          )}

          {/* View Summary (Div 4) */}
          {activeStep < steps.length - 1 && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end',  paddingX: '30px','@media (max-width:763px)': {
            padding:0
          } }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveStep(7)}
                sx={{
                  width: 150,
                  '@media (max-width:763px)': { width: 1 },
                }}
              >
                View Summary
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}


export default DealForm;
