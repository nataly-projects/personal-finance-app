import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Box, Toolbar } from "@mui/material";
import AppRoutes from "../components/AppRoutes";

const UserMainPage: React.FC = () => {
    return (
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: '100vh', 
            width: '100%'
          }}
        >
          <Sidebar />
          <Box 
            sx={{
              flex: 1,
              padding: '20px',
              backgroundColor: 'background.default', 
              height: '100%',
            }}
          >
            <AppRoutes /> 
         
            </Box>
          </Box>
      );
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserMainPage;
