import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, MenuItem, TextField, Box, StepConnector } from '@mui/material';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor'; // Make sure this path is correct

const steps = [
    { label: 'Tandem', fields: [{ type: 'dropdown', label: 'Broker Name', options: ['Joe', 'Doe'] }, { type: 'date', label: 'Date' }] },
    { label: 'Proposal', fields: [{ type: 'date', label: 'Date' }] },
    { label: 'LOI Execute', fields: [{ type: 'date', label: 'Date' }] },
    { label: 'Lease Signed', fields: [{ type: 'date', label: 'Date' }] },
    { label: 'Notice to Proceed', fields: [{ type: 'date', label: 'Date' }] },
    { label: 'Commercial Operation', fields: [{ type: 'date', label: 'Date' }] },
    { label: 'Potential Commission', fields: [{ type: 'date', label: 'Date' }] },
];

const StepperComponent: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<any>(steps.map(() => ({})));

    const handleNext = () => {
        saveFormData().then(() => {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData: any) => {
            const newData = [...prevData];
            newData[activeStep] = { ...newData[activeStep], [name]: value };
            return newData;
        });
    };

    const saveFormData = async () => {
        const status = getStatus(activeStep);
        const payload = {
            activestep: activeStep + 1,
            status,
            brokername: formData[0]['Broker Name'] || null,
            dealstartdate: formData[0]['Date'] || null,
            proposaldate: formData[1]['Date'] || null,
            loiexceutedate: formData[2]['Date'] || null,
            leasesigneddate: formData[3]['Date'] || null,
            noticetoprocceddate: formData[4]['Date'] || null,
            commercialoperationdate: formData[5]['Date'] || null,
            potentialcommissiondate: formData[6]['Date'] || null,
            potentialcommission: formData[6]['Potential Commission'] || null,
        };

        try {
            const response = await axiosInstance.post('/save-endpoint', payload);
            console.log('Form data saved:', response.data);
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    const getStatus = (step: number) => {
        if (step === 0) return 'Started';
        if (step > 0 && step < 6) return 'In-Progress';
        if (step === 6) return 'Completed';
    };

    const renderField = (field: any, index: number) => {
        switch (field.type) {
            case 'dropdown':
                return (
                    <TextField
                        key={index}
                        select
                        label={field.label}
                        name={field.label}
                        value={formData[activeStep][field.label] || ''}
                        onChange={handleChange}
                        sx={{ width: 200 }}
                        margin="normal"
                        size="small"
                    >
                        {field.options.map((option: string, idx: number) => (
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
                        label={field.label}
                        name={field.label}
                        value={formData[activeStep][field.label] || ''}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                        sx={{ width: 200 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: 1, marginTop: '7rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
                        <Typography>All steps completed</Typography>
                        <Button onClick={() => setActiveStep(0)}>Reset</Button>
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <Button disabled={activeStep === 0} onClick={handleBack} sx={{ marginRight: 1 }}>
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    disabled={!isFormValid()}
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
                                sx={{ width: 100 }}
                                disabled={!isFormValid()}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );

    function isFormValid() {
        const currentFields = steps[activeStep].fields;
        for (const field of currentFields) {
            if (!formData[activeStep][field.label]) {
                return false;
            }
        }
        return true;
    }
};

export default StepperComponent;
