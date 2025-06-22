import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { DashboardData } from '../utils/types';

const SummaryCards: React.FC<{ data: DashboardData }> = ({ data }) => (
  <>
    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>Total Income</Typography>
          <Typography variant="h5">${data.totalIncome.toLocaleString()}</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>Total Expenses</Typography>
          <Typography variant="h5">${data.totalExpenses.toLocaleString()}</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>Balance</Typography>
          <Typography variant="h5">${data.balance.toLocaleString()}</Typography>
        </CardContent>
      </Card>
    </Grid>
  </>
);

export default SummaryCards;