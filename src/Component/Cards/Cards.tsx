import React, { useEffect, useState } from "react";
import styles from "./Cards.module.css";
import { FiEdit } from "react-icons/fi";
import Navbar from "../Navbar/Navbar";
import DealForm from "../Milestone/Milestone";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/reducers";
import { fetchDealDetails } from "../Redux/slice/dealSlice";
import { AppDispatch } from "../Redux/store";
import { Deal as DealFormObjectDeal } from "../Interface/DealFormObject";

interface Deal extends DealFormObjectDeal {
    activeStep: number;
    status: string;
    propertyName: string;
    brokerName: string;
    dealStartDate: string;
    proposalDate: string;
    loiExecuteDate: string;
    leaseSignedDate: string;
    noticeToProceedDate: string;
    commercialOperationDate: string;
    potentialcommissiondate: string;
    potentialCommission: number | null;
    createdBy: number;
    updatedBy: number;
    isNew: boolean;
    id: number | null;
}

interface DealsData {
    totalDeals: number;
    dealsOpened: number;
    dealsInProgress: number;
    dealsClosed: number;
    totalCommission: number;
    deals: Deal[];
}

const Cards: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const dealsData = useSelector((state: RootState) => state.deal.dealDetails as unknown as DealsData);
    const [openStepper, setOpenStepper] = useState(false);
    const [dealFormData, setDealFormData] = useState<Deal | null>(null);

    useEffect(() => {
        dispatch(fetchDealDetails());
    }, [dispatch]);

    useEffect(() => {
    }, [dealsData]);

    const editDealForm = (deal: Deal) => {
        setOpenStepper(true);
        setDealFormData({
            ...deal,
            activeStep: deal.activeStep || 0,
        });
        console.log("card Deal respected value ", deal);
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
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(event.target.value);
    };

    const filteredDeals = dealsData?.deals?.filter((deal: Deal) => {
        const matchesSearch = deal.brokerName?.toLowerCase().includes(searchTerm.toLowerCase()) || deal.propertyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? deal.status === filterStatus : true;
        return matchesSearch && matchesStatus;
    }) || [];

    return (
        <>
            <Navbar />
            <div className={styles.filterContainer}>
                <input
                    type="text"
                    placeholder="Search by broker or property name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
                <select value={filterStatus} onChange={handleFilterChange} className={styles.filterSelect}>
                    <option value="">All Statuses</option>
                    <option value="Started">Started</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div className={styles.cardList}>
                {filteredDeals.map((deal: Deal, index: number) => (
                    <div key={index} className={styles.card}>
                        <div>
                            <div className={styles.cardTitle}>Deal #{deal.id} <div className={styles.hide}><FiEdit onClick={() => editDealForm(deal)} /></div></div>
                            <p className={styles.brokerName}><span>Broker Name:</span> {deal.brokerName}</p>
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
        </>
    );
};

export default Cards;
