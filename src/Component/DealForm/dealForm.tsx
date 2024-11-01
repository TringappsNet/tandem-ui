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
import LandlordAndPropertyForm from '../LandlordandProperty/LandlordPropertyForm';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const steps = [
  {
    label: 'Choose Property',
    fields: [
      { type: 'dropdown', label: 'propertyName', options: [] },
    ],
  },
  {
    label: 'Choose Broker',
    fields: [
      { type: 'dropdown', label: 'brokerName', options: [] },
      { type: 'date', label: 'dealStartDate' },
    ],
  },
  { label: 'Proposal', fields: [{ type: 'date', label: 'proposalDate' }, { type: 'number', label: 'finalCommission' }] },
  { label: 'LOI Execute', fields: [{ type: 'date', label: 'loiExecuteDate' }, { type: 'number', label: 'finalCommission' }] },
  {
    label: 'Lease Signed',
    fields: [{ type: 'date', label: 'leaseSignedDate' }, { type: 'number', label: 'finalCommission' }],
  },
  {
    label: 'Notice to Proceed',
    fields: [{ type: 'date', label: 'noticeToProceedDate' }, { type: 'number', label: 'finalCommission' }],
  },
  {
    label: 'Commercial Operation',
    fields: [{ type: 'date', label: 'commercialOperationDate' }, { type: 'number', label: 'finalCommission' }],
  },
  {
    label: 'Potential Commission',
    fields: [
      { type: 'date', label: 'finalCommissionDate' },
      { type: 'number', label: 'finalCommission' },
    ],
  },
  { label: 'Completed', fields: [] },
];

interface DealFormProps {
  deal?: Deal;
}

interface ExtendedDeal extends Deal {
  brokerId: number | null;
  propertyId: { id: number | null };
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
    loiExecuteDate: currentDeal?.loiExecuteDate || '',
    leaseSignedDate: currentDeal?.leaseSignedDate || '',
    noticeToProceedDate: currentDeal?.noticeToProceedDate || '',
    commercialOperationDate: currentDeal?.commercialOperationDate || '',
    finalCommissionDate: currentDeal?.finalCommissionDate || '',
    finalCommission: currentDeal?.finalCommission || 0,
    status: currentDeal?.status || '',
    activeStep: currentDeal?.activeStep ?? 0,
    createdBy: currentDeal?.createdBy || 0,
    updatedBy: { id: currentDeal?.updatedBy.id || 0 },
    isNew: currentDeal?.isNew || true,
  });
  const [userId, setUserId] = useState<number | null>(null);
  // const [isPropertyPage, setIsPropertyPage] = useState(false);
  const [isComponentName, setIsComponentName] = useState('dealform');


  useEffect(() => {
    if (userdetails.isAdmin) {
      dispatch(fetchBrokers());
      dispatch(fetchSites());
      dispatch(fetchDealDetails());
    }
  }, [dispatch, userdetails.isAdmin]);

  useEffect(() => {
    if (currentDeal && currentDeal.activeStep === 8) {
      setIsComponentName('summaryform');
    }
  }, [currentDeal])

  useEffect(() => {
    if (brokers.length > 0) {
      setUserId(brokers[0].id);
    }
  }, [brokers]);

  const handleNext = () => {
    if (isFormValid()) {
      saveFormData();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if (activeStep === 7) {
      setIsComponentName('summaryform')
    }
  };


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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
    const status = getStatus((activeStep === 0 && !formData.id) ? activeStep + 1 : activeStep >= 8 ? 8 : formData.activeStep > activeStep ? formData.activeStep : activeStep + 1);
    const brokerId = brokers.find((broker) => broker.name === formData.brokerName)?.id || null;
    const propertyId = sites.find((site) => `${site.addressline1}, ${site.addressline2}` === formData.propertyName)?.id || null;

    const payload = {
      ...formData,
      activeStep: (activeStep === 0 && !formData.id) ? activeStep + 1 : activeStep >= 8 ? 8 : formData.activeStep > activeStep ? formData.activeStep : activeStep + 1,
      status,
      brokerId,
      propertyId: { id: propertyId },
      createdBy: userId || 0,
      updatedBy: { id: userId || 0 },
    };
    try {
      dispatch(setCurrentDeal(payload));
      return payload;
    } catch (error) {
      console.error('Error saving form data:', error);
      return null;
    }
  };

  const dispatchFormDataOnClose = async () => {
    try {
      let dealFormData: ExtendedDeal | Deal | null;
      if (isFormValid()) {
        dealFormData = saveFormData();
      }
      else {
        dealFormData = currentDeal;
      }
      if (dealFormData) {
        if (dealFormData.id) {
          dispatch(updateDealDetails(dealFormData));
        } else {
          dispatch(createNewDeal(dealFormData));
        }
        dispatch(clearCurrentDeal());
      }

    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const getStatus = (step: number) => {
    if (step <= 2) return 'Started';
    if (step >= 3 && step <= 7) return 'In-Progress';
    if (step > 7) return 'Completed';
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
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', '@media (max-width:763px)': { flexDirection: 'column', gap: 1 } }}>
              {/* {label === 'propertyName' && (
                <Typography variant='h5' sx={{ fontWeight: 500, marginBottom: -1, marginTop: .8, fontSize: '.8rem', textTransform: 'uppercase' }}>Choose a Property</Typography>
              )} */}
              {(label === 'brokerName') && (
                <Typography variant='h5' sx={{ fontWeight: 500, marginTop: 3, fontSize: '1.3rem', '@media (max-width:763px)': { fontSize: '.9rem' } }}>Property Name : {formData.propertyName}</Typography>
              )}
              <TextField
                key={index}
                select
                label={label}
                name={label}
                disabled={formData.finalCommission ? true : false}
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
                  : (label === 'propertyName' && formData.id === null)
                    ? sites
                      .filter(
                        (site) =>
                          !deals.some(
                            (deal: any) =>
                              deal.propertyId.id ===
                              site.id
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
                    :
                    (label === 'propertyName' && formData.id !== null)
                      ? sites
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
              {label === 'propertyName' && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: 'fit-content', maxWidth: 130 }}
                    onClick={handleNext}
                    disabled={!isFormValid()}
                  >
                    Save & Next
                  </Button>
                  <Typography align='center' sx={{ opacity: .5 }}>---(OR)---</Typography>

                  <LandlordAndPropertyForm />
                </>
              )}
            </Box>
          </>

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
              formData[label as keyof Deal]?.toLocaleString().split('T')[0] || ''
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

      case 'number':
        return (
          <TextField
            key={index}
            type="number"
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

  const renderForm = () => {
    return (
      <LandlordAndPropertyForm />
    )
  }

  const renderSummary = () => {
    const events = [
      { label: 'Deal Start', date: formData.dealStartDate, commission: null }, // No commission for Deal Start
      { label: 'Proposal', date: formData.proposalDate },
      { label: 'LOI Execute', date: formData.loiExecuteDate },
      { label: 'Lease Signed', date: formData.leaseSignedDate },
      { label: 'Notice to Proceed', date: formData.noticeToProceedDate },
      { label: 'Commercial Operation', date: formData.commercialOperationDate },
      { label: 'Commission Date', date: formData.finalCommissionDate },
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
              Potential Commission:
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

        </Box>

        {currentDeal?.activeStep !== 8 && (
          <Button
            sx={{ '@media (max-width:763px)': { marginTop: '1rem' } }}
            variant="contained"
            color="primary"
            onClick={() => setIsComponentName('dealform')}
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
          height: '100%',
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
          setIsComponentName('dealform');
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
              setIsComponentName('dealform');
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
          padding: '2rem',
        }}
      >
        {
          (isComponentName === 'dealform') ? (
            <Box
              sx={{
                width: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                paddingTop: '1.5rem',
              }}
            >
              {/* Stepper (Div 1) */}
              <Box sx={{ width: '100%' }}>
                {(userdetails.isAdmin && activeStep !== 8) && (
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
                    paddingX: 0,
                  },
                }}
              >
                {activeStep < steps.length - 1 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', textTransform: 'capitalize' }}>
                    {steps[activeStep].fields.map((field, index) => renderField(field, index))}
                  </Box>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', color: 'green' }}>
                    You Deal is Completed
                  </div>
                )}
              </Box>

              {/* Save/Next Buttons (Div 3) */}
              {activeStep < steps.length - 1 && (
                <Box sx={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', paddingX: '30px', '@media (max-width:763px)': {
                    padding: 0,
                  }
                }}>

                  {/* <Button
                variant="contained"
                color="primary"
                onClick={saveFormData}
                sx={{ width: 100 }}
                disabled={!isFormValid()}
              >
                Save
              </Button> */}
                  {activeStep !== 0 &&
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={
                          handleNext
                        }
                        sx={{ width: 130, '@media (max-width:763px)': { width: '45%', fontSize: '.7rem' } }}
                        disabled={!isFormValid()}
                      >
                        {activeStep === steps.length - 2 ? 'Finish' : 'Save & Next'}
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBack}
                        sx={{ width: 100, '@media (max-width:763px)': { width: '45%', fontSize: '.7rem' } }}
                        title={'Back to previous step'}
                      >
                        Back
                      </Button>
                    </>
                  }
                </Box>
              )}

              {/* View Summary (Div 4) */}
              {(activeStep < steps.length - 1 && activeStep !== 0) && (
                <Box sx={{
                  width: '100%', display: 'flex', justifyContent: 'flex-end', paddingX: '30px', '@media (max-width:763px)': {
                    padding: 0
                  }
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsComponentName('summaryform')}
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
          )
            : (isComponentName === 'summaryform') ? (
              renderSummary()
            )
              : (
                <Box sx={{ padding: 0 }}>
                  <Button
                    sx={{ marginTop: '1rem', '@media (max-width:763px)': { marginTop: '1rem' } }}
                    variant="contained"
                    color="primary"
                  // onClick={() => setIsPropertyPage(false)}
                  >
                    <KeyboardBackspaceIcon sx={{ color: '#fff', fontSize: 25, paddingRight: .2 }} />Back to Deal Form
                  </Button>
                  {renderForm()}
                </Box>
              )
        }

      </DialogContent >
    </Dialog >
  );
}


export default DealForm;
