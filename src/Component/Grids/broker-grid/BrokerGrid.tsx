import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import FullGrid from '../parentGrid/parent-grid';
import { RootState } from '../../Redux/reducers';
import { AppDispatch } from '../../Redux/store';
import { fetchBrokers } from '../../Redux/slice/broker/brokerSlice';
import { FiEye } from 'react-icons/fi';
import { Dialog, DialogTitle, DialogContent, Button, Icon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchBrokerDealDetails, fetchDealDetails } from '../../Redux/slice/deal/dealSlice';


const BrokerGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const brokers = useSelector((state: RootState) => state.broker.brokers);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 100,
    page: 0,
  });

  // State to handle dialog visibility and selected user's deals
  const [openDialog, setOpenDialog] = useState(false);
  const dealsData = useSelector((state: RootState) => state.deal.dealDetails);


  useEffect(() => {
    dispatch(fetchBrokers());
  }, [dispatch]);

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = (deal: any) => {
    if (deal.isAdmin) {
      dispatch(fetchDealDetails());
    }
    else {
      dispatch(fetchBrokerDealDetails(deal.id)); // Fetch broker deal details by user ID
    }
    setOpenDialog(true);
  };

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Tandem Users', width: 140, align: 'left', headerAlign: 'center' },
    { field: 'roleName', headerName: 'Role', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'mobile', headerName: 'Mobile', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'totalDeals', headerName: 'Total Deals', width: 170, align: 'center', headerAlign: 'center' },
    { field: 'dealsOpened', headerName: 'Deals Opened', width: 170, align: 'center', headerAlign: 'center' },
    { field: 'dealsInProgress', headerName: 'Deals In-Progress', width: 180, align: 'center', headerAlign: 'center' },
    { field: 'dealsClosed', headerName: 'Deals Closed', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'totalPotentialCommission', headerName: 'Total Potential Commission', width: 250, align: 'center', headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'DealsDetail',
      width: 120,
      disableExport: true,
      renderCell: (params) => (
        <>
          <Button sx={{ fontSize: 11, color: '#000000cc' }} disableRipple onClick={() => handleOpenDialog(params.row)}>
            <FiEye
              style={{ marginRight: 3, cursor: 'pointer' }}
            />
            View Deals
          </Button>

        </>
      ),
    },
  ];

  const dealColumns: GridColDef[] = [
    { field: 'brokerName', headerName: 'Broker Name', width: 160, align: 'center', headerAlign: 'center' },
    { field: 'propertyName', headerName: 'Property Name', width: 200, align: 'center', headerAlign: 'center' },
    {
      field: 'dealStartDate', headerName: 'Deal Start Date', width: 150, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        if (value) {
          return row.dealStartDate.split('T')[0];
        }
        else {
          return 'Yet to complete'
        }
      }
    },
    {
      field: 'proposalDate', headerName: 'Proposal Date', width: 150, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        // return row.proposalDate.split('T')[0];
        if (value) {
          return row.proposalDate.split('T')[0];

        }
        else {
          return 'Yet to complete'
        }
      }
    },
    {
      field: 'loiExecuteDate', headerName: 'LOI Execute Date', width: 150, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        if (value) {
          return row.loiExecuteDate.split('T')[0];
        }
        else {
          return 'Yet to complete'
        }
      }
    },
    {
      field: 'leaseSignedDate', headerName: 'Lease Signed Date', width: 170, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        if (value) {
          return row.leaseSignedDate.split('T')[0];

        }
        else {
          return 'Yet to complete'
        }
      }
    },
    {
      field: 'noticeToProceedDate', headerName: 'Notice to Proceed Date', width: 210, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        if (value) {
          return row.noticeToProceedDate.split('T')[0];

        }
        else {
          return 'Yet to complete'
        }
      }
    },
    {
      field: 'commercialOperationDate', headerName: 'Commercial Operation Date', width: 250, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        if (value) {
          return row.commercialOperationDate.split('T')[0];

        }
        else {
          return 'Yet to complete'
        }
      }
    },
    { field: 'status', headerName: 'Status', width: 150, align: 'center', headerAlign: 'center' },
    {
      field: 'finalCommissionDate', headerName: 'Final Commission Date', width: 200, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        if (value) {
          return row.finalCommissionDate.split('T')[0];

        }
        else {
          return 'Yet to complete'
        }
      }
    },
    { field: 'finalCommission', headerName: 'Final Commission', width: 200, align: 'center', headerAlign: 'center' },
    {
      field: 'createdAt', headerName: 'Deal Created Date', width: 180, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        return row.createdAt.split('T')[0];
      }
    },
    {
      field: 'updatedAt', headerName: 'Last Update Deal Date', width: 220, align: 'center', headerAlign: 'center', valueGetter: (value, row) => {
        return row.updatedAt.split('T')[0];
      }
    }
  ];


  return (
    <>
      <FullGrid
        sx={{
          height: 'calc(100vh - 15rem)',
        }}
        rows={brokers}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ paddingX: 3, paddingY: 1, display: 'flex', justifyContent: 'space-between', backgroundColor: 'rgb(40, 40, 43)', color: '#fff' }}>
          Deals Details
          <Icon
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ cursor: 'pointer' }}
          >
            <CloseIcon />
          </Icon>
        </DialogTitle>
        <DialogContent sx={{ padding: 0, margin: 0, paddingX: 2, minHeight: 'calc(100vh - 10rem)' }}>
          <FullGrid
            sx={{ height: 'calc(100vh - 12rem)' }}
            rows={dealsData || []}
            columns={dealColumns}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BrokerGrid;
