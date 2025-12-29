import React from 'react';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

interface ExportToCSVProps {
  data: any[];
  filename: string;
}

const ExportToCSV: React.FC<ExportToCSVProps> = ({ data, filename }) => {
  const convertToCSV = (objArray: any[]) => {
    if (objArray.length === 0) return "";
    
    const headers = Object.keys(objArray[0]).join(',');
    
    const rows = objArray.map(obj => {
      return Object.values(obj).map(value => {
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(',');
    });

    return [headers, ...rows].join('\n');
  };

  const handleDownload = () => {
    const processedData = data.map(({ _id, userId, ...rest }) => ({
      ...rest,
      date: new Date(rest.date).toLocaleDateString('en-GB'), 
    }));

    const csvContent = convertToCSV(processedData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      size="small"
      sx={{ borderRadius: 2 }}
    >
      Export CSV
    </Button>
  );
};

export default ExportToCSV;