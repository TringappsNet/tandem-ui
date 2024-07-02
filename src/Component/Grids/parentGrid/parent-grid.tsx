import React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import styles from "./parent-grid.module.css";


interface FullGridProps {
  rows: any[];
  columns: GridColDef[];
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  handleEdit: (id: number) => void;
  // handleDelete: (id: number) => void;
  className?: string;
  disablePagination?: boolean;
  handleAdd: (id: number) => void;


}



const FullGrid: React.FC<FullGridProps> = ({
  rows,
  columns,
  paginationModel,
  setPaginationModel,
  handleEdit,
  // handleDelete,
  handleAdd,
  className,

}) => {
  return (
    <div className={`${styles.gridContainer } ${className}`} style={{ height: 450, width: '100%',
      fontSize: 'small',
    }}>
      <DataGrid
        className={styles.dataGrid}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowHeight={34}
        // onRowClick={(params) => handleAdd(params.id as number)}
       
        

      />
    </div>
  );
};

export default FullGrid;