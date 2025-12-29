import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

const IncomeExpenseChart: React.FC<{ data: any[] }> = ({ data }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2, height: 400 }}>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
        Monthly Income and Expenses
      </Typography>
      
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider}/>
            <XAxis 
              dataKey="month" 
              stroke={theme.palette.text.secondary} 
              fontSize={12} 
              tickLine={false} 
            />
            <YAxis 
              stroke={theme.palette.text.secondary} 
              fontSize={12} 
              tickLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper, 
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary 
              }} 
            />
            <Legend />
            <Bar dataKey="Expenses" fill={theme.palette.error.main} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Income" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
  );

}

export default IncomeExpenseChart;
