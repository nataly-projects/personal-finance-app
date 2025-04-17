import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel, TextField, Button, Divider } from '@mui/material';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [outcomeLimit, setOutcomeLimit] = useState<number | ''>(1000); 
  const [darkMode, setDarkMode] = useState(false); 

  const handleSave = () => {
    // Save settings logic here
    console.log({ notifications, outcomeLimit });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Settings
      </Typography>

      {/* Notification Preferences */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notification Preferences
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          }
          label="Enable Notifications"
        />
        {notifications && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Notify me when my monthly outcome exceeds:
            </Typography>
            <TextField
              type="number"
              label="Outcome Limit ($)"
              variant="outlined"
              value={outcomeLimit}
              onChange={(e) =>
                setOutcomeLimit(e.target.value === '' ? '' : Number(e.target.value))
              }
              fullWidth
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

  {/* Theme Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Theme Settings
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
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