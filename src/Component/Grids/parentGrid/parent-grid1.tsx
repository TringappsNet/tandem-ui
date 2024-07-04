import React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import styles from "./parent1-grid.module.css";
import Box from '@mui/material/Box';


interface FullGrid1Props {
  rows: any[];
  columns: GridColDef[];
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  // handleEdit: (id: number) => void;
  // handleDelete: (id: number) => void;
  className?: string;
  disablePagination?: boolean;
  // handleAdd: (id: number) => void;


}





const FullGrid1: React.FC<FullGrid1Props> = ({
  rows,
  columns,
  paginationModel,
  setPaginationModel,
  // handleEdit,
  // handleDelete,
  // handleAdd,
  className,

}) => {
  return (
    <div className={`${styles.gridContainer } ${className}`} >
      <Box
        sx={{
                
                height: 470,
                marginTop:2,
                background:'none',
                border: 0,

                lineHeight:2,
               '.css-yrdy0g-MuiDataGrid-columnHeaderRow ':{
                background: '#444189 !important',
                color:'white'

               },
         '.css-3eek4p-MuiDataGrid-main ':{
          background: '#e8e8ee !important'

         },

               '& .css-15n4jlm-MuiDataGrid-root .MuiDataGrid-columnHeaders': {
                
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform:'uppercase  '
              },

 '.css-wop1k0-MuiDataGrid-footerContainer':{
  background: '#e8e8ee !important'

 },


                '& .super-app-theme--header': {
                  backgroundColor: 'rgba(255, 7, 0, 0.55)',
                  color: 'white',
                  fontSize: 'small',

                },


                '.css-1kwdphh-MuiDataGrid-virtualScrollerContent ': {
                  fontSize:'13px',
                  border:'none !important',

                }
                ,
                          "& .MuiDataGrid-row": {
          "&:nth-of-type(2n)": {
          backgroundColor: " #EBF0F4 ",//even tealcolor
          '&:hover': {
          background: " #EBF0F4 !important",
          border: 'none ' ,

                  
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
      />
      
      </Box>
  
    </div>
  );
};

export default FullGrid1;