import React, { useEffect, useState } from "react";
import styles from "./Cards.module.css";
import { FiEdit, FiTrash } from "react-icons/fi";
import DealForm from "../Milestone/Milestone";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/reducers";
import { deleteDeal, fetchDealDetails, createNewDeal, updateDealDetails } from "../Redux/slice/dealSlice";
import { AppDispatch } from "../Redux/store";
import { Deal } from "../Interface/DealFormObject";
import ConfirmationModal from "../AlertDialog/AlertDialog";

const Cards: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const dealsData = useSelector((state: RootState) => state.deal.dealDetails);
    const [openStepper, setOpenStepper] = useState(false);
    const [dealFormData, setDealFormData] = useState<Deal | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [dealId, setDealId] = useState<number | null>(null);
    const [isFirstSave, setIsFirstSave] = useState(true);

    useEffect(() => {
        dispatch(fetchDealDetails());
    }, [dispatch]);

    useEffect(() => {
    }, [dealsData]);

    const saveFormData = async () => {
        try {
            const dealtemp = dealsData[dealsData.length - 1];
            if (dealtemp.isNew && isFirstSave) {
                dispatch(createNewDeal(dealtemp));
                setIsFirstSave(false);
            } else {
                const dealToUpdate = dealsData.find(
                    (deal) => deal.id === dealtemp.id
                );
                if (dealToUpdate) {
                    dispatch(updateDealDetails(dealToUpdate));
                }
                setIsFirstSave(true);
            }
        } catch (error) {
            console.error("Error saving form data:", error);
        }
    };

    const editDealForm = (deal: Deal) => {
        setOpenStepper(true);
        setDealFormData({
            ...deal,
            activeStep: deal.activeStep || 0,
        });
    };

    const deleteDealHandler = (dealId: number | null) => {
        if (dealId !== null) {
            dispatch(deleteDeal(dealId));
            setDeleteConfirmation(false);
        }
    };

    const getStatusButtonClass = (status: string | null) => {
        switch (status) {
            case "Completed":
                return styles.statusButtonFinished;
            case "In-Progress":
                return styles.statusButtonInProgress;
            case "Started":
                return styles.statusButtonStarted;
            default:
                return "";
        }
    };

    const handleCloseStepper = () => {
        setOpenStepper(false);
        setDealFormData(null);
        saveFormData();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(event.target.value);
    };

    const filteredDeals = dealsData?.filter((deal: Deal) => {
        const matchesSearch = deal.brokerName?.toLowerCase().includes(searchTerm.toLowerCase()) || deal.propertyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? deal.status === filterStatus : true;
        return matchesSearch && matchesStatus && deal.id !== null;
    }) || [];

    const cancelDelete = () => {
        setDeleteConfirmation(false);
    };

    const handleDelete = (id: number) => {
        setDealId(id);
        setDeleteConfirmation(true);
    };

    return (
        <>
            <div className={styles.filterContainer}>
                <input
                    type="text"
                    placeholder="Search by broker or property name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
                <select value={filterStatus} onChange={handleFilterChange} className={styles.filterSelect}>
                    <option value="">All Status</option>
                    <option value="Started">Started</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div className={styles.cardList}>
                {filteredDeals.map((deal: Deal, index: number) => (
                    <div key={index} className={styles.card}>
                        <div>
                            <div className={styles.cardTitle}>
                                Deal #{deal.id}
                                <div className={styles.icons}>
                                    <div className={styles.hide}>
                                        <FiEdit onClick={() => editDealForm(deal)} />
                                    </div>
                                    <FiTrash onClick={() => deal.id !== null && handleDelete(deal.id)} />
                                </div>
                            </div>
                            <p className={styles.brokerName}>
                                <span>Broker Name:</span> {deal.brokerName}
                            </p>
                        </div>
                        <div className={styles.statusLine}>
                            <div className={styles.statusLabel}>Status:</div>
                            <div className={`${styles.statusButton} ${getStatusButtonClass(deal.status)}`}>
                                {deal.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog
                fullScreen
                sx={{ margin: '30px 190px' }}
                open={openStepper}
                onClose={handleCloseStepper}
                className={styles.popupmain}
            >
                <DialogTitle sx={{ backgroundColor: "#262262", color: "white" }}>
                    Deal Form
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseStepper}
                        sx={{
                            position: "absolute",
                            right: 25,
                            top: 8,
                            width: 40,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon sx={{ color: "#999" }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {dealFormData && <DealForm deal={dealFormData} />}
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                show={deleteConfirmation}
                onHide={cancelDelete}
                onConfirm={() => deleteDealHandler(dealId)}
                title="Deal Delete"
                message="Are you sure you want to delete this deal?"
                cancelText="Cancel"
                confirmText="Delete"
                cancelVariant="secondary"
                confirmVariant="danger"
            />
        </>
    );
};

export default Cards;