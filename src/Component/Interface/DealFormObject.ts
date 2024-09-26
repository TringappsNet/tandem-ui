export interface Deal {
  id: number | null;
  brokerName: string;
  propertyName: string;
  dealStartDate: string;
  proposalDate: string;
  loiExecuteDate: string;
  leaseSignedDate: string;
  noticeToProceedDate: string;
  commercialOperationDate: string;
  finalCommissionDate: string;
  finalCommission: number;
  status: string;
  activeStep: number;
  createdBy: number;
  updatedBy: {id: number};
  isNew: boolean;
  updatedAt?: string;
  createdAt?: string;
}
