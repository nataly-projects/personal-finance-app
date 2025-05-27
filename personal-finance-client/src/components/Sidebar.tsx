import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    AccountBalance as AccountBalanceIcon,
    Receipt as ReceiptIcon,
    Assessment as AssessmentIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    Category as CategoryIcon,
    Task as TaskIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Transactions', icon: <AccountBalanceIcon />, path: '/transactions' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

const Sidebar: React.FC = () => {
    const { logout } = useAuth();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
            }}
        >
            <Toolbar />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem disablePadding key={index}>
                        <ListItemButton component={Link} to={item.path}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
