import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import styles from './parent-grid.module.css';

interface FullGridProps {
  rows: any[];
  columns: GridColDef[];
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  className?: string;
  disablePagination?: boolean;
  sx?: any;
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
            marginTop: 2,
            width: '100%',
            height: '100%',
            ...sx,
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
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? styles.evenRow : styles.oddRow)}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                sx: {
                  backgroundColor: '#dee2e6',
                  color: 'black',
                },
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default FullGrid;
