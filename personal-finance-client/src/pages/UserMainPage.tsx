import React from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

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
            <Outlet />
          </Box>
        </Box>
    );
};

export default UserMainPage;
