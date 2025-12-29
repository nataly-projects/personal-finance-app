import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Task as TaskIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
       sx={{
          zIndex: muiTheme.zIndex.drawer + 1, 
          transition: muiTheme.transitions.create(['margin', 'width'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            transition: muiTheme.transitions.create(['margin', 'width'], {
              easing: muiTheme.transitions.easing.easeOut,
              duration: muiTheme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

         <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Personal Finance
          </Typography>

          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 2 }}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {user?.fullName && (  
            <Typography variant="body1" noWrap sx={{ fontWeight: 500 }}>
              {user.fullName}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: (theme) => theme.spacing(0, 1),
            ...(theme) => theme.mixins.toolbar,
            justifyContent: 'flex-end',
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    borderRight: `4px solid ${muiTheme.palette.primary.main}`,
                  }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={logout} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          backgroundColor: isDarkMode ? 'background.default' : '#f5f5f5',
          transition: muiTheme.transitions.create('margin', {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.leavingScreen,
          }),
          marginLeft: `-${drawerWidth}px`,
          ...(open && {
            transition: muiTheme.transitions.create('margin', {
              easing: muiTheme.transitions.easing.easeOut,
              duration: muiTheme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        }}
      >
        <Box sx={{ ...muiTheme.mixins.toolbar }} />
        {children}
      </Box>
    </Box>
  );
};


export default Layout; 