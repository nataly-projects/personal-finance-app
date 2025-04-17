import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const GuestPage = () => {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Personal Finance App
      </Typography>
      <Typography variant="body1" gutterBottom>
        Track your income, expenses, and stay on top of your finances with ease. Join us today!
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mt: 2 }}>
        Get Started
      </Button>
    </Box>
  );
};

export default GuestPage;
