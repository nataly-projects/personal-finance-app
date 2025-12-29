import React from 'react';
import { 
  Box, Select, MenuItem, TextField, FormControl, 
  InputLabel, Stack, Tooltip, IconButton, Paper
} from '@mui/material';
import { 
  FilterAltOff as FilterOffIcon, 
} from '@mui/icons-material';
import { FilterSectionProps } from '../utils/types';


const FilterSection: React.FC<FilterSectionProps> = ({
  filterType, handleTypeChange, startDate, handleStartDateChange, endDate, 
    handleEndDateChange, handleMinAmountChange, minAmount, selectOptions, isExpenseFilter, onReset
}) => {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={filterType}
            onChange={handleTypeChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {Object.entries(selectOptions).map(([key, value]) => (
              <MenuItem key={key} value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="From"
          type="date"
          size="small"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="To"
          type="date"
          size="small"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
        />

        {isExpenseFilter && (
          <TextField
            label="Min Amount"
            type="number"
            size="small"
            value={minAmount}
            onChange={handleMinAmountChange}
            sx={{ width: 130 }}
          />
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Clear All Filters">
          <IconButton onClick={onReset} color="secondary">
            <FilterOffIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default FilterSection;
