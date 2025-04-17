import React, { useState } from 'react';
import Login from './LoginPage';
import Register from './RegisterPage';
import { Box } from '@mui/material';

const SignupLoginPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '45%',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '20px',
        }}
      >

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '25px',
            marginLeft: '-1%',
          }}
          className="signup-login-page-nav"
        >
          <Box
            onClick={() => setIsLoginPage(false)}
            sx={{
              width: '30%',
              marginLeft: '5%',
              opacity: isLoginPage ? 0.5 : 1,
              fontSize: '19px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLoginPage ? '#494949' : '#795B4A',
              borderBottom: isLoginPage ? '2px solid #494949' : '2px solid #795B4A',
              height: '50px',
              cursor: 'pointer',
              fontWeight: isLoginPage ? 'normal' : 'bold',
            }}
            className="nav-option"
          >
            Sign Up
          </Box>
          <Box
            onClick={() => setIsLoginPage(true)}
            sx={{
              width: '30%',
              marginLeft: '5%',
              opacity: isLoginPage ? 1 : 0.5,
              fontSize: '19px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLoginPage ? '#795B4A' : '#494949',
              borderBottom: isLoginPage ? '2px solid #795B4A' : '2px solid #494949',
              height: '50px',
              cursor: 'pointer',
              fontWeight: isLoginPage ? 'bold' : 'normal',
            }}
            className="nav-option"
          >
            Sign In
          </Box>
        </Box>
        {isLoginPage ? <Login /> : <Register />}
      </Box>
    </Box>
  );
};

export default SignupLoginPage;
