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
  potentialcommissiondate: string;
  potentialCommission: number | 0;
  status: string;
  activeStep: number;
  createdBy: number;
  updatedBy: number;
  isNew: boolean;
}
