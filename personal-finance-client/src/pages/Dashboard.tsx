import React, {useMemo} from 'react';
import { Typography, Grid, Box, Paper, CircularProgress } from '@mui/material';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardData } from '../utils/types';

import SummaryCards from '../components/SummaryCards';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryPieChart from '../components/CategoryPieChart';
import TransactionsTable from '../components/TransactionsTable';
import TaskSection from '../components/TaskSection';

const processCategoryData = (data: DashboardData) => {
  return Object.entries(data.expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));
};

const processMonthlyData = (data: DashboardData) => {
  const monthlyStats = data.recentTransactions.reduce((acc: any, curr) => {
    const month = new Date(curr.date).toLocaleString('en-US', { month: 'long' });
    if (!acc[month]) acc[month] = { Expenses: 0, Income: 0 };
    curr.type === 'expense' ? (acc[month].Expenses += curr.amount) : (acc[month].Income += curr.amount);
    return acc;
  }, {});

  return Object.entries(monthlyStats).map(([month, values]: [string, any]) => ({
    month,
    ...values,
  }));
};

const Dashboard: React.FC = () => {
const { data: dashboardData, isLoading, isError, error } = useDashboard();

  const categoryData = useMemo(() => 
    dashboardData ? processCategoryData(dashboardData) : [], 
    [dashboardData]
  );

  const monthlyData = useMemo(() => 
    dashboardData ? processMonthlyData(dashboardData) : [], 
    [dashboardData]
  );

  if (isLoading) return <CircularProgress />;
  if (!dashboardData) return <Typography>No data found</Typography>;
  const hasFinancialData =
    dashboardData.totalIncome > 0 ||
    dashboardData.totalExpenses > 0 ||
    dashboardData.recentTransactions.length > 0;

 return (
    <Box sx={{ flexGrow: 1 }}>
      {!hasFinancialData ? (
        <Box sx={{ mt: 4, textAlign: 'center', p: 3 }}>
          <Typography variant="h6">No financial data available yet.</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start by adding your income and expenses to see insights.
          </Typography>
          <Grid container spacing={3}>
            <SummaryCards data={dashboardData} />
          </Grid>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <SummaryCards data={dashboardData} />
          <IncomeExpenseChart data={monthlyData} />
          <CategoryPieChart data={categoryData} />
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Transactions
              </Typography>
              <TransactionsTable transactions={dashboardData.recentTransactions} />
            </Paper>
          </Grid>

          <TaskSection tasks={dashboardData.tasks} />
          
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
