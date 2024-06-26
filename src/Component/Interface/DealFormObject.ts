export interface Deal {
    id: number | null;
    brokerName: string | null;
    propertyName?: string | null;
    dealStartDate?: string | null;
    proposalDate?: string | null;
    loiExecuteDate?: string | null;
    leaseSignedDate?: string | null;
    noticeToProceedDate?: string | null;
    commercialOperationDate?: string | null;
    potentialcommissiondate?: string | null;
    potentialCommission?: string | null;
    status: string | null;
    activeStep: number | null;
}
