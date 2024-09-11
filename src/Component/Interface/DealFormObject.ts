export interface Deal {
  id: number | null;
  brokerName: string;
  propertyName: string;
  dealStartDate: string;
  proposalDate: string;
  proposalCommission: number;
  loiExecuteDate: string;
  loiExecuteCommission: number;
  leaseSignedDate: string;
  leaseSignedCommission: number;
  noticeToProceedDate: string;
  noticeToProceedCommission: number;
  commercialOperationDate: string;
  commercialOperationCommission: number;
  potentialCommissionDate: string;
  potentialCommission: number;
  status: string;
  activeStep: number;
  createdBy: number;
  updatedBy: number;
  isNew: boolean;
  updatedAt?: string;
  createdAt?: string;
}
