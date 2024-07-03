import React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import styles from "./parent-grid.module.css";


interface FullGridProps {
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





const FullGrid: React.FC<FullGridProps> = ({
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
    <div className={`${styles.gridContainer } ${className}`} style={{ height: 520, width: '100%',
      fontSize: 'small',
    }}>
      <DataGrid
        className={styles.dataGrid}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowHeight={34}
        columnHeaderHeight={39}
        
          sx={{
                boxShadow: 2,
              
                
                height: 800,
                marginTop:2,
                background:'none',
              
                  
                lineHeight:2,
               
               
              
            }}
        
       
        

      />
    </div>
  );
};

export default FullGrid;