import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddTransactionButton: React.FC<{ isEmpty?: boolean }> = ({ isEmpty }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
    {isEmpty && <Typography variant="h6" gutterBottom>No data available. Start by adding your first transaction.</Typography>}
    <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => alert('Open Add Transaction Popup')}>
      Add Transaction
    </Button>
  </Box>
);

export default AddTransactionButton;
