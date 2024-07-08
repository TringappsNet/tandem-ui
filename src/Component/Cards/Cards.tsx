import React, { useEffect, useState } from "react";
import styles from "./Cards.module.css";
import { FiEdit, FiTrash } from "react-icons/fi";
import DealForm from "../DealForm/dealForm";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/reducers";
import { deleteDeal, fetchDealDetails } from "../Redux/slice/deal/dealSlice";
import { openDealForm } from "../Redux/slice/deal/dealFormSlice";
import { AppDispatch } from "../Redux/store";
import ConfirmationModal from "../AlertDialog/AlertDialog";

interface Deal {
    id: number | null;
    brokerName: string;
    propertyName: string;
    dealStartDate: string;
    proposalDate: string;
    loiExecuteDate: string;
    leaseSignedDate: string;
    noticeToProceedDate: string;
    commercialOperationDate: string;
    potentialcommissiondate: string;
    potentialCommission: number | null;
    status: string;
    activeStep: number;
    createdBy: number;
    updatedBy: number;
    isNew: boolean;
    updatedAt?: string;
}

const Cards: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const dealsData = useSelector((state: RootState) => state.deal.dealDetails);
    const [dealFormData, setDealFormData] = useState<Deal | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [dealId, setDealId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchDealDetails());
    }, [dispatch]);

    const editDealForm = (deal: Deal) => {
        setDealFormData({
            ...deal,
            activeStep: deal.activeStep || 0,
        });
        dispatch(openDealForm());
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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(event.target.value);
    };

    const cancelDelete = () => {
        setDeleteConfirmation(false);
    };
    const handleDelete = (id: number) => {
        setDealId(id);
        setDeleteConfirmation(true);
    };

    const filteredDeals = dealsData?.filter((deal: any) => {
        const matchesSearch = deal.brokerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.id?.toString().includes(searchTerm);
        const matchesStatus = filterStatus ? deal.status === filterStatus : true;
        return matchesSearch && matchesStatus && deal.id !== null;
    }) || [];

    return (
        <>
            <div className={styles.filterContainer}>
                <input
                    type="text"
                    placeholder="Search by broker, property name, status, or deal ID"
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
                {filteredDeals.map((deal: any, index: number) => (
                    <div key={index} className={styles.card}>
                        <div>
                            <div className={styles.cardTitle}>
                                Deal #{deal.id}
                                <div className={styles.icons}>
                                    <div className={styles.hide}>
                                        <FiEdit onClick={() => editDealForm(deal)} />
                                    </div>
                                    <FiTrash
                                        onClick={() => deal.id !== null && handleDelete(deal.id)}
                                    />
                                </div>
                            </div>
                            <hr className={styles.line} />
                            <div className={styles.nameHeader}>
                                <div className={styles.name}>
                                    {deal.propertyName}
                                </div>
                            </div>
                        </div>
                        <div className={styles.statusLine}>
                            <div className={styles.statuscontainer}>
                                <div className={`${styles.statusButton} ${getStatusButtonClass(deal.status)}`}>
                                    {deal.status}
                                </div>
                            </div>

                        </div>
                        <div className={styles.statusLine}>
                            <div className={styles.timestamp}>
                                Last updated on: {deal.updatedAt?.split('T')[0] || "Unknown"}
                            </div>
                            <div className={styles.circle} title={deal.brokerName}>
                                {deal.brokerName && deal.brokerName.split(" ").length >= 2 ? (
                                    <p>{deal.brokerName.split(" ")[0][0]}{deal.brokerName.split(" ")[1][0]}</p>
                                ) : (
                                    <p>NA</p>
                                )}
                            </div>
                        </div>

                        <hr className={`${styles.statuslinecolor} ${getStatusButtonClass(deal.status)}`} />
                    </div>
                ))}
            </div>
            {dealFormData && <DealForm deal={dealFormData} />}
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
