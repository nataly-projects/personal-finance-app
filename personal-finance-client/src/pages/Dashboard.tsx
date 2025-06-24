import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, Paper } from '@mui/material';
import API from '../services/api';
import { DashboardData } from '../utils/types';

import SummaryCards from '../components/SummaryCards';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryPieChart from '../components/CategoryPieChart';
import TransactionsTable from '../components/TransactionsTable';
import TaskSection from '../components/TaskSection';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/users/dashboard');
        if (!response.data) throw new Error('No data received');
        setDashboardData(response.data.data);
        processData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const processData = (dashboardData: DashboardData) => {
    const categoryDataArray = Object.entries(dashboardData.expensesByCategory).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(categoryDataArray);

    const monthlyStats = dashboardData.recentTransactions.reduce((acc: any, curr) => {
      const month = new Date(curr.date).toLocaleString('en-US', { month: 'long' });
      if (!acc[month]) acc[month] = { Expenses: 0, Income: 0 };
      curr.type === 'expense' ? acc[month].Expenses += curr.amount : acc[month].Income += curr.amount;
      return acc;
    }, {});

    const monthlyDataArray = Object.entries(monthlyStats).map(([month, values]: [string, any]) => ({
      month,
      ...values,
    }));
    setMonthlyData(monthlyDataArray);
  };

  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const hasFinancialData =
    dashboardData.totalIncome > 0 ||
    dashboardData.totalExpenses > 0 ||
    dashboardData.recentTransactions.length > 0;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      
      {!hasFinancialData ? (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" >
            No financial data available yet.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Start by adding your income and expenses — once you do, your dashboard will display all your data and insights.
          </Typography>
          <Grid container spacing={3}>
            <SummaryCards
              data={dashboardData}
            />
          </Grid>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <SummaryCards
            data={dashboardData}
          />

          {monthlyData.length > 0 && (
            <IncomeExpenseChart data={monthlyData} />
          )}

          {categoryData.length > 0 && (
            <CategoryPieChart data={categoryData} />
          )}

        </Grid>
      )}


      <Grid item xs={12}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <TransactionsTable 
        transactions={dashboardData.recentTransactions} 
        />
        </Paper>
      </Grid>

      <TaskSection tasks={dashboardData.tasks} />

    </Box>
  );
};

export default Dashboard;
