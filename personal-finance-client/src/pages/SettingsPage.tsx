import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Box, Typography, Switch, FormControlLabel, TextField, Button, Divider, Alert } from '@mui/material';
import { toggleTheme } from '../store/themeSlice';
import { useSettings } from '../hooks/useSettings';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const { settings, updateNotifications, updateOutcomeLimit } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [localNotifications, setLocalNotifications] = useState(settings.notifications);
  const [localOutcomeLimit, setLocalOutcomeLimit] = useState<number | ''>(settings.outcomeLimit);

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      await updateNotifications(localNotifications);
      await updateOutcomeLimit(localOutcomeLimit);
      
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notification Preferences
        </Typography>
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Notify me when my monthly outcome exceeds:
            </Typography>
            <TextField
              type="number"
              label="Outcome Limit ($)"
              variant="outlined"
              value={localOutcomeLimit}
              onChange={(e) =>
                setLocalOutcomeLimit(e.target.value === '' ? '' : Number(e.target.value))
              }
              fullWidth
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Theme Settings
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={() => dispatch(toggleTheme())}
            />
          }
          label="Enable Dark Mode"
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 3 }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default SettingsPage;