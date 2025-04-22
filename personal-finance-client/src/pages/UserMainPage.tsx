import React from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
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
};

export default UserMainPage;
