import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDealDetails,
  createNewDeal,
  updateDealDetails,
} from "../Redux/slice/deal/dealSlice";
import { Deal } from "../Interface/DealFormObject";
import axiosInstance from "../AxiosInterceptor/AxiosInterceptor";
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
} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
import styles from "./dealForm.module.css";
import { RootState } from "../Redux/reducers";
import { closeDealForm } from "../Redux/slice/deal/dealFormSlice";
import { AppDispatch } from "../Redux/store/index";

const steps = [
  {
    label: "Tandem",
    fields: [
      { type: "dropdown", label: "propertyName", options: [] },
      { type: "dropdown", label: "brokerName", options: [] },
      { type: "date", label: "dealStartDate" },
    ],
  },
  { label: "Proposal", fields: [{ type: "date", label: "proposalDate" }] },
  { label: "LOI Execute", fields: [{ type: "date", label: "loiExecuteDate" }] },
  {
    label: "Lease Signed",
    fields: [{ type: "date", label: "leaseSignedDate" }],
  },
  {
    label: "Notice to Proceed",
    fields: [{ type: "date", label: "noticeToProceedDate" }],
  },
  {
    label: "Commercial Operation",
    fields: [{ type: "date", label: "commercialOperationDate" }],
  },
  {
    label: "Potential Commission",
    fields: [
      { type: "date", label: "potentialCommissionDate" },
      { type: "text", label: "potentialCommission" },
    ],
  },
];

interface DealFormProps {
  deal?: Deal;
}

const DealForm: React.FC<DealFormProps> = ({ deal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector((state: RootState) => state.dealForm.open);
  const [activeStep, setActiveStep] = useState(deal?.activeStep || 0);
  const [formData, setFormData] = useState<Deal>({
    id: deal?.id || null,
    brokerName: deal?.brokerName || "",
    propertyName: deal?.propertyName || "",
    dealStartDate: deal?.dealStartDate || "",
    proposalDate: deal?.proposalDate || "",
    loiExecuteDate: deal?.loiExecuteDate || "",
    leaseSignedDate: deal?.leaseSignedDate || "",
    noticeToProceedDate: deal?.noticeToProceedDate || "",
    commercialOperationDate: deal?.commercialOperationDate || "",
    potentialcommissiondate: deal?.potentialcommissiondate || "",
    potentialCommission: deal?.potentialCommission || null,
    status: deal?.status || "",
    activeStep: deal?.activeStep ?? 0,
    createdBy: deal?.createdBy || 0,
    updatedBy: deal?.updatedBy || 0,
    isNew: deal?.isNew || true,
  });
  const [brokerOptions, setBrokerOptions] = useState<string[]>([]);
  const [propertyOptions, setPropertyOptions] = useState<string[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isFirstSave, setIsFirstSave] = useState(true);
  const [savedDeal, setSavedDeal] = useState<Deal | null>(null); // New state to store the saved deal
  const dealDetails = useSelector((state: RootState) => state.deal.dealDetails);

  const fetchSite = async () => {
    try {
      const response = await axiosInstance.get("/sites");
      const sitename = response.data.map(
        (sites: any) => `${sites.addressline1}, ${sites.addressline2}`
      );
      setPropertyOptions(sitename);
    } catch (error) {
      console.error("Error fetching broker names:", error);
    }
  };

  const fetchBrokers = async () => {
    try {
      const response = await axiosInstance.get("/brokers");
      const brokers = response.data.map(
        (broker: any) => `${broker.user.firstName} ${broker.user.lastName}`
      );
      setBrokerOptions(brokers);
      if (response.data.length > 0) {
        setUserId(response.data[0].user.id);
      }
    } catch (error) {
      console.error("Error fetching broker names:", error);
    }
  };

  useEffect(() => {
    fetchBrokers();
    fetchSite();
  }, []);

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
    if (name.endsWith("Date")) {
      const formattedDate = value.split("T")[0];
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
      createdBy: userId || 0,
      updatedBy: userId || 0,
      isNew: true,
    };

    try {
      dispatch(setDealDetails(payload));
      setSavedDeal(payload); // Save the deal in the local state
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving form data:", error);
      setSaveSuccess(false);
    }
  };

  const dispatchFormDataOnClose = async () => {
    try {
      if (savedDeal) { // Use the saved deal from the local state
        if (savedDeal.isNew && isFirstSave) {
          await dispatch(createNewDeal(savedDeal));
          setIsFirstSave(false);
        } else {
          const dealToUpdate = dealDetails.find(
            (deal) => deal.id === savedDeal.id
          );
          if (dealToUpdate) {
            await dispatch(updateDealDetails(dealToUpdate));
          }
          setIsFirstSave(true);
        }
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  const getStatus = (step: number) => {
    if (step === 0) return "Started";
    if (step > 0 && step < 6) return "In-Progress";
    if (step === 6) return "Completed";
    return "";
  };

  const renderField = (
    field: { label: string; type: string; options?: string[] },
    index: number
  ) => {
    const { label, type, options } = field;
    switch (type) {
      case "dropdown":
        return (
          <TextField
            key={index}
            select
            label={label}
            name={label}
            value={formData[label as keyof Deal] || ""}
            onChange={handleChange}
            sx={{ width: 300 }}
            margin="normal"
            size="small"
          >
            {label === "brokerName"
              ? brokerOptions.map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))
              : label === "propertyName"
              ? propertyOptions.map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))
              : options?.map((option: string, idx: number) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
          </TextField>
        );
      case "date":
        return (
          <TextField
            key={index}
            type="date"
            label={label}
            name={label}
            value={
              formData[label as keyof Deal]?.toLocaleString().split("T")[0] ||
              ""
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
      case "text":
        return (
          <TextField
            key={index}
            type="text"
            label={label}
            name={label}
            value={formData[label as keyof Deal] || ""}
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
    const currentFields = steps[activeStep].fields;
    for (const field of currentFields) {
      if (!formData[field.label as keyof Deal]) {
        return false;
      }
    }
    return true;
  }

  return (
    <Dialog
      fullScreen
      sx={{ margin: "30px 190px" }}
      open={open}
      onClose={() => {
        dispatch(closeDealForm());
        dispatchFormDataOnClose();
      }}
      className={styles.popupmain}
    >
      <DialogTitle sx={{ backgroundColor: '#262262', color: 'white',height:'44px',padding:'6px 24px' }}>
        Deal Form
        <IconButton
          aria-label="close"
          onClick={() => {
            dispatch(closeDealForm());
            dispatchFormDataOnClose();
          }}
          sx={{
            position: 'absolute',
            right: 25,
            top: 2,
        
            color: (theme) => theme.palette.grey[500],
        }}

        >
             <button className='saveclose' style={{
                            height:'24px',
                            width:'100px',
                            border:'1px solid grey',
                            borderRadius:'3px',
                            // boxShadow:' rgba(99, 99, 99, 0.2) 0px 2px 2px 0px' ,
                            color: 'white',
                            backgroundColor: '#262262',                    }}>
                        Save/Close

                        </button>

          {/* <CloseIcon sx={{ color: "#999" }} /> */}
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className={styles.dealcontainer}>
          <Box
            sx={{
              width: 1,
              marginTop: "3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<StepConnector />}
              sx={{ width: 1 }}
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box
              sx={{
                width: "100%",
                marginTop: "30px",
                display: "flex",
                flexDirection: "column",
                padding: "30px",
              }}
            >
              {activeStep === steps.length ? (
                <Box>
                  <Typography
                    variant="h3"
                    sx={{ textAlign: "center", color: "green" }}
                  >
                    Deal is Completed
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ width: 100 }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        sx={{ width: 100 }}
                        disabled={!saveSuccess || !isFormValid()}
                      >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      position: "absolute",
                      top: "260px",
                      zIndex: 999,
                    }}
                  >
                    {steps[activeStep].fields.map((field, index) =>
                      renderField(field, index)
                    )}
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
      </DialogContent>
    </Dialog>
  );
};

export default DealForm;