import React from 'react';
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import SignupLoginPage from '../pages/SignupLoginPage';
import HomePage from "../pages/HomePage";
import ReportsPage from "../pages/ReportsPage";
import TasksPage from "../pages/TasksPage";
import TransactionsPage from "../pages/TransactionsPage";
import SettingsPage from "../pages/SettingsPage";
import UserMainPage from "../pages/UserMainPage";
import ProfilePage from "../pages/ProfilePage";

const AppRoutes: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const location = useLocation();

    if ((!user || !token) && location.pathname !== '/login') {
        return <Navigate to="/login" replace />;
    }

    return (
        <Routes>
            {(!user || !token) ? (
                <>
                    <Route path="/login" element={<SignupLoginPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            ) : (
                <Route element={<UserMainPage />}>
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