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
            bgcolor: '#142031 !important', // Set the background color here with !important
              // border:'1px solid white',


            ...sx,

            lineHeight: 2,
            ".css-15n4jlm-MuiDataGrid-root": {
              // border: "none",
              
              
            },
           ' .css-1wc0mgy .parent-grid_dataGrid__Uj-3s ':{
              border  :'1px solid grey !important'
            },
            '.css-15n4jlm-MuiDataGrid-root .MuiDataGrid-container--top [role=row], .css-15n4jlm-MuiDataGrid-root .MuiDataGrid-container--bottom [role=row]':{
              background: 'linear-gradient(58deg,  rgba(20,32,49,1) 0%, rgba(29,46,70,1) 35%, rgba(31,47,71,1)  100%)',
            },
          
            '.css-1kwdphh-MuiDataGrid-virtualScrollerContent,.css-tgsonj,.css-14mxsc7-MuiDataGrid-root .MuiDataGrid-withBorderColor,.css-1rtad1,.css-14mxsc7-MuiDataGrid-root .MuiDataGrid-filler,.css-128fb87-MuiDataGrid-toolbarContainer,.css-wop1k0-MuiDataGrid-footerContainer, .css-yrdy0g-MuiDataGrid-columnHeaderRow,.css-1w53k9d-MuiDataGrid-overlay,.css-1rtad1,.css-og3pwy .css-15n4jlm-MuiDataGrid-root':{
              // background: '#142031 !important',
              background: 'linear-gradient(58deg,  rgba(20,32,49,1) 0%, rgba(29,46,70,1) 35%, rgba(31,47,71,1)  100%)',


              // background: 'radial-gradient(circle, rgba(2,83,145,1) 0%, rgba(7,85,144,1) 35%, rgba(5,90,155,1) 100%)',

              color: 'white',
              // border:'1px solid white',
              backdropfilter: 'blur(10px)',
              webkitbackdropfilter: 'blur(40px)',
              boxshadow: '0 10px 25px rgba(0,0,0,0.2)',
              // boxshadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              

          },
          '.css-1eed5fa-MuiInputBase-root-MuiInput-root':{
            color: 'white',
          },
          '.parent-grid_dataGrid__Uj-3s  ':{
            // border:'1px solid grey',
            backdropfilter: 'blur(20px)',
            border:'2px solid #39404f',

          }
          ,
          '.css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root':{

  color:'white',
          },
         
'.css-12doopn .css-15n4jlm-MuiDataGrid-root':{
  // border: '1px solid grey !important' 

},
          '.css-14mdrlu .css-15n4jlm-MuiDataGrid-root ':{
            // border: '1px solid grey !important' 

          }
          
 
          }}
        >
          <DataGrid
            className={styles.dataGrid}
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowHeight={40                             }
            columnHeaderHeight={39}
            disableColumnFilter
            
            disableColumnMenu
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
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
