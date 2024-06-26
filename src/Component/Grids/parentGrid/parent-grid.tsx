import React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import styles from "./parent-grid.module.css";

interface FullGridProps {
  rows: any[];
  columns: GridColDef[];
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  className?: string;
  disablePagination?: boolean;
}

const FullGrid: React.FC<FullGridProps> = ({
  rows,
  columns,
  paginationModel,
  setPaginationModel,
  handleEdit,
  handleDelete,
  className,
}) => {
  return (
    <div className={`${styles.gridContainer} ${className}`}>
      <DataGrid
        className={styles.dataGrid}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onRowDoubleClick={(params) => handleEdit(params.id as number)}
        onRowClick={(params) => handleDelete(params.id as number)}
      />
    </div>
  );
};

export default FullGrid;