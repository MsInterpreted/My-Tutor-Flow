import React from 'react';
import Papa from 'papaparse';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function ExportCSVButton({ data, columns, filename }) {
  const handleExport = () => {
    const csv = Papa.unparse(
      data.map(row =>
        Object.fromEntries(
          columns.map(col => [
            col.label,
            typeof col.value === 'function' ? col.value(row) : row[col.value],
          ])
        )
      )
    );
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  return (
    <Button
      variant="text"
      color="secondary"
      size="small"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
    >
      Export CSV
    </Button>
  );
}
