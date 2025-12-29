import React, { useState } from 'react';
import Login from './LoginPage';
import Register from './RegisterPage';
import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

const SignupLoginPage = () => {

  const theme = useTheme();
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.customColors.backgroundLight}, #e0e0e0)`,
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: 500,
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.customColors.lightBlue,
            color: '#fff',
            padding: '16px',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {isLoginPage ? 'Welcome Back!' : 'Join Us Today!'}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
            padding: '8px',
          }}
        >
          <Box
            onClick={() => setIsLoginPage(false)}
            sx={{
              width: '50%',
              textAlign: 'center',
              padding: '12px',
              cursor: 'pointer',
              fontWeight: isLoginPage ? 'normal' : 'bold',
               color: isLoginPage ? theme.palette.text.secondary : theme.customColors.lightBlue,
              borderBottom: isLoginPage
                ? '2px solid transparent'
                : `2px solid ${theme.customColors.lightBlue}`, 
            }}
          >
            Sign Up
          </Box>
          <Box
            onClick={() => setIsLoginPage(true)}
            sx={{
              width: '50%',
              textAlign: 'center',
              padding: '12px',
              cursor: 'pointer',
              fontWeight: isLoginPage ? 'bold' : 'normal',
              color: isLoginPage ? theme.customColors.lightBlue : theme.palette.text.secondary, 
              borderBottom: isLoginPage
                ? `2px solid ${theme.customColors.lightBlue}` 
                : '2px solid transparent',
            }}
          >
            Sign In
          </Box>
        </Box>

        <Box sx={{ padding: '24px' }}>
          {isLoginPage ? <Login setIsLoginPage={setIsLoginPage} /> : <Register setIsLoginPage={setIsLoginPage} />}
        </Box>
      </Box>
    </Box>
  );
};

export default SignupLoginPage;