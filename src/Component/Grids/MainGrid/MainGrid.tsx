import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridToolbar,
} from '@mui/x-data-grid';
import styles from './parent-grid.module.css';
import Box from '@mui/material/Box';

import React, { useState, useEffect } from 'react';

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
            bgcolor: 'darkblue !important', // Set the background color here with !important
            border: '#191c24 !important',

            ...sx,

            lineHeight: 2,
            '.css-15n4jlm-MuiDataGrid-root': {
              border: 'none',
            },
            '.css-1kwdphh-MuiDataGrid-virtualScrollerContent,.css-tgsonj,.css-14mxsc7-MuiDataGrid-root .MuiDataGrid-withBorderColor,.css-1rtad1,.css-14mxsc7-MuiDataGrid-root .MuiDataGrid-filler,.css-128fb87-MuiDataGrid-toolbarContainer,.css-wop1k0-MuiDataGrid-footerContainer, .css-yrdy0g-MuiDataGrid-columnHeaderRow,.css-1w53k9d-MuiDataGrid-overlay,.css-1rtad1':
              {
                background: '#191c24 !important',
                color: 'white',
                border: '#191c24',
              },
            '.css-1eed5fa-MuiInputBase-root-MuiInput-root': {
              color: 'white',
            },
            '.css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root': {
              color: 'white',
            },
            '.css-14mxsc7-MuiDataGrid-root ': {
              border: 'none',
            },
          }}
        >
          <DataGrid
            className={styles.dataGrid}
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowHeight={40}
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
