import { DataGrid, GridColDef, GridPaginationModel, GridToolbar } from "@mui/x-data-grid";
import styles from "./parent-grid.module.css";
import Box from '@mui/material/Box';

import React, { useState, useEffect } from "react";

interface FullGridProps {
  rows: any[];
  columns: GridColDef[];
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  className?: string;
  disablePagination?: boolean;
  sx: any;
}

const FullGrid: React.FC<FullGridProps> = ({
  rows,
  columns,
  paginationModel,
  setPaginationModel,
  sx = {},
  className,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.gridContainer} ${className}`}>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <Box
          sx={{
            height: 800,
            marginTop: 2,
            background: 'none',
            border: 0,
            ...sx,
            lineHeight: 2,
            '.css-15n4jlm-MuiDataGrid-root': {
              border: 'none',
            },
            '.css-ptiqhd-MuiSvgIcon-root ': {
              marginLeft: '10px',
            },
            '.css-1eed5fa-MuiInputBase-root-MuiInput-root': {
              border: '1px solid #d4d4d4',
              borderRadius: '4px',
              width: '700px',
              marginRight: '970px',
              padding: '2px',
              marginLeft: '10px',
              marginTop: '6px',
              marginBottom: '6px'
            },
            '.css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root': {
              color: 'white',
              '&:hover': {
                color: 'white',
              }
            },
            '.css-yrdy0g-MuiDataGrid-columnHeaderRow ': {
              background: '#444189 !important',
              color: 'white'
            },
            '.css-3eek4p-MuiDataGrid-main ': {
              background: '#f5f7fb !important'
            },
            '& .css-15n4jlm-MuiDataGrid-root .MuiDataGrid-columnHeaders': {
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            },
            '.css-wop1k0-MuiDataGrid-footerContainer': {
              background: '#f5f7fb !important'
            },
            '& .super-app-theme--header': {
              backgroundColor: 'rgba(255, 7, 0, 0.55)',
              color: 'white',
              fontSize: 'small',
            },
            '.css-1kwdphh-MuiDataGrid-virtualScrollerContent ': {
              fontSize: '13px',
              border: 'none !important',
            },
            '.css-1knaqv7-MuiButtonBase-root-MuiButton-root': {
              visibility: 'hidden',
              position: 'absolute',
              marginBottom: 2,
            },
            "& .MuiDataGrid-row": {
              "&:nth-of-type(2n)": {
                backgroundColor: " #EBF0F4 ",
                '&:hover': {
                  background: " #EBF0F4 !important",
                  border: 'none ',
                  ".css-yrdy0g-MuiDataGrid-columnHeaderRow": {
                    backgroundColor: "#0078d4 !important",
                  }
                },
              }
            },
          }}
        >
          <DataGrid
            className={styles.dataGrid}
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowHeight={34}
            columnHeaderHeight={39}
            disableColumnFilter
            disableColumnMenu
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default FullGrid;