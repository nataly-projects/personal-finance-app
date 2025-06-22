import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncomeExpenseChart: React.FC<{ data: any[] }> = ({ data }) => (
  <Grid item xs={12} md={8}>
    <Paper sx={{ p: 2, height: 400 }}>
      <Typography variant="h6" gutterBottom>Monthly Income and Expenses</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Expenses" fill="#FF8042" />
          <Bar dataKey="Income" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  </Grid>
);

export default IncomeExpenseChart;
