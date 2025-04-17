import React from 'react';
import { IconButton, Select, MenuItem, TextField, InputAdornment, FormControl, InputLabel, Input, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FilterSectionProps } from '../utils/types';

const FilterSection: React.FC<FilterSectionProps> = ({
  filterType, handleTypeChange, startDate, handleStartDateChange, endDate, 
    handleEndDateChange, handleMinAmountChange, minAmount, selectOptions, isExpenseFilter 
}) => {
  return (
    <Box 
      display="flex"
      gap={2}
      mb={2}
      sx={{ width: '100%' }}
    >
      {/* Filter Type */}
      <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={filterType}
          onChange={handleTypeChange}
          input={<Input />}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries(selectOptions).map(([key, value]) => (
            <MenuItem key={key} value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Start Date */}
      <FormControl variant="standard" size="small">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <FontAwesomeIcon icon={faFilter} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </FormControl>

      {/* End Date */}
      <FormControl variant="standard" size="small">
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <FontAwesomeIcon icon={faFilter} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </FormControl>

      {/* Min Amount (only if isExpenseFilter is true) */}
      {isExpenseFilter && (
        <FormControl variant="standard" size="small">
          <TextField
            label="Min Amount"
            type="number"
            value={minAmount}
            onChange={handleMinAmountChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <FontAwesomeIcon icon={faFilter} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </FormControl>
      )}
    </Box>
  );
};

export default FilterSection;
