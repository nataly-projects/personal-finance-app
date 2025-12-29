import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { 
  TrendingUp as IncomeIcon, 
  TrendingDown as ExpenseIcon, 
  AccountBalanceWallet as BalanceIcon 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { DashboardData } from '../utils/types';

const SummaryCards: React.FC<{ data: DashboardData }> = ({ data }) => {
  const theme = useTheme();

  const cards = [
    {
      title: 'Total Income',
      value: data.totalIncome,
      icon: <IncomeIcon sx={{ color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Total Expenses',
      value: data.totalExpenses,
      icon: <ExpenseIcon sx={{ color: theme.palette.error.main }} />,
      color: theme.palette.error.main,
    },
    {
      title: 'Current Balance',
      value: data.balance,
      icon: <BalanceIcon sx={{ color: theme.palette.primary.main }} />,
      color: data.balance >= 0 ? theme.palette.success.main : theme.palette.error.main,
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              boxShadow: 2,
              borderRadius: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2" fontWeight="bold" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    sx={{ color: card.title === 'Current Balance' ? card.color : 'inherit' }}
                  >
                    ₪{card.value.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ 
                  backgroundColor: `${card.color}15`, // צבע עם 15% שקיפות לרקע האייקון
                  p: 1, 
                  borderRadius: 2, 
                  display: 'flex' 
                }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
    // <>
    //   <Grid item xs={12} md={4}>
    //     <Card>
    //       <CardContent>
    //         <Typography color="textSecondary" gutterBottom>Total Income</Typography>
    //         <Typography variant="h5">${data.totalIncome.toLocaleString()}</Typography>
    //       </CardContent>
    //     </Card>
    //   </Grid>
    //   <Grid item xs={12} md={4}>
    //     <Card>
    //       <CardContent>
    //         <Typography color="textSecondary" gutterBottom>Total Expenses</Typography>
    //         <Typography variant="h5">${data.totalExpenses.toLocaleString()}</Typography>
    //       </CardContent>
    //     </Card>
    //   </Grid>
    //   <Grid item xs={12} md={4}>
    //     <Card>
    //       <CardContent>
    //         <Typography color="textSecondary" gutterBottom>Balance</Typography>
    //         <Typography variant="h5">${data.balance.toLocaleString()}</Typography>
    //       </CardContent>
    //     </Card>
    //   </Grid>
    // </>
  );
}

export default SummaryCards;