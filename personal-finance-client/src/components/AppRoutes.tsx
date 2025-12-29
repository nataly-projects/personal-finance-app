import React from 'react';
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { RootState } from "../store/store";
import SignupLoginPage from '../pages/SignupLoginPage';
import HomePage from "../pages/HomePage";
import ReportsPage from "../pages/ReportsPage";
import TasksPage from "../pages/TasksPage";
import TransactionsPage from "../pages/TransactionsPage";
import SettingsPage from "../pages/SettingsPage";
import ProfilePage from "../pages/ProfilePage";
import Layout from './Layout';


const AppRoutes: React.FC = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const isAuthenticated = !!(user && token);

    return (
        <Routes>
            {!isAuthenticated ? (
                <>
                    <Route path="/login" element={<SignupLoginPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            ) : (
                <Route element={<Layout><Outlet /></Layout>}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            )}
        </Routes>
    );
};

export default AppRoutes;