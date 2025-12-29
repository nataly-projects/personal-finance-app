import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, FormControlLabel, TextField, Button, Alert, CircularProgress, Grid, Paper, Snackbar } from '@mui/material';
import { 
  NotificationsActive as NotificationIcon, 
  Palette as PaletteIcon, 
  Save as SaveIcon 
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';

const SettingsPage: React.FC = () => {
 
  const { isDarkMode, toggleTheme } = useTheme();

  const { settings, updateSettings, isUpdating, 
  isInitialLoading } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [localNotifications, setLocalNotifications] = useState(false);
  const [localOutcomeLimit, setLocalOutcomeLimit] = useState<number | ''>('');

  useEffect(() => {
    if (settings) {
      setLocalNotifications(settings.enableOutcomeAlert);
      setLocalOutcomeLimit(settings.monthlyOutcomeLimit);
    }
  }, [settings]);

  const handleSave = async () => {
      setError(null);
      setSuccess(null);
    try {
      
      await updateSettings({ 
      enableOutcomeAlert: localNotifications, 
      monthlyOutcomeLimit: localOutcomeLimit === '' ? 0 : localOutcomeLimit
    });
      setSuccess('Settings saved successfully!');
      setOpenSnackbar(true)
    } catch (err) {
      console.log(err);
      setError('Failed to save settings. Please try again.');
      setOpenSnackbar(true);
    }
  };

  if (isInitialLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Settings
      </Typography>


      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={localNotifications}
                  onChange={(e) => setLocalNotifications(e.target.checked)}
                />
              }
              label="Enable Notifications"
            />
            {localNotifications && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Alert me when my monthly spending exceeds:
                </Typography>
                <TextField
                  type="number"
                  label="Budget Limit (₪)"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={localOutcomeLimit}
                  onChange={(e) =>
                    setLocalOutcomeLimit(e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaletteIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Appearance</Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
              }
              label="Dark Mode"
            />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={isUpdating}
          sx={{ px: 4, py: 1, borderRadius: 2 }}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box> 

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>

  );
};

export default SettingsPage;