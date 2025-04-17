import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import API from '../services/api';
import TransactionsTable from '../components/TransactionsTable';
import {DashboardData} from '../utils/types.js';


const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/users/dashboard');
        setDashboardData(response.data);
        processData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const processData = (data: DashboardData) => {
    const categoryDataArray = Object.entries(data.expensesByCategory).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(categoryDataArray);

    const monthlyStats = data.recentTransactions.reduce((acc: any, curr) => {
      const month = new Date(curr.date).toLocaleString('en-US', { month: 'long' });
      if (!acc[month]) {
        acc[month] = { Expenses: 0, Income: 0 };
      }
      if (curr.type === 'expense') {
        acc[month].Expenses += curr.amount;
      } else {
        acc[month].Income += curr.amount;
      }
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Financial Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h5">${dashboardData.totalIncome.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h5">${dashboardData.totalExpenses.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Balance
              </Typography>
              <Typography variant="h5">${dashboardData.balance.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Income and Expenses
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
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

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Expenses by Category
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TransactionsTable transactions={dashboardData.recentTransactions}  />
            {/* <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td style={{ padding: '12px' }}>
                        {new Date(transaction.date).toLocaleDateString('en-US')}
                      </td>
                      <td style={{ padding: '12px' }}>{transaction.description}</td>
                      <td style={{ padding: '12px' }}>{transaction.category}</td>
                      <td style={{ padding: '12px' }}>${transaction.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box> */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
