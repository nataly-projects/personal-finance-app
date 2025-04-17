import React, {useContext} from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SignupLoginPage from '../pages/SignupLoginPage';
import HomePage from "../pages/HomePage";
import ReportsPage from "../pages/ReportsPage";
import GuestPage from "../pages/GuestPage";
import TransactionsPage from "../pages/TransactionsPage";
import TasksPage from "../pages/TasksPage";
import Dashboard from "../pages/Dashboard";
import UserMainPage from "../pages/UserMainPage";
import SettingsPage from "../pages/SettingsPage";
import Layout from './Layout';
import { Box } from "@mui/material";

const AppRoutes: React.FC = () => {
    const authContext = useContext(AuthContext);
    const user = authContext ? authContext.user : null;

    if (!user) {
        return (
            <Routes>
                <Route path="*" element={<GuestPage />} />
                <Route path="/" element={<GuestPage />} />
                <Route path="/login" element={<SignupLoginPage />} />
            </Routes>
        );
    }

    return (
        <Layout>
            <Box sx={{ flex: 1, p: 3 }}>
                <Routes>
                    <Route path="*" element={<HomePage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Box>
        </Layout>
    );
};

export default AppRoutes;