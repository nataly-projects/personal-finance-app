import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Typography, Box, Stepper, Step, StepLabel, 
  CircularProgress, Alert 
} from '@mui/material';

interface PasswordUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onRequestCode: () => Promise<void>;
  onVerifyCode: (code: string) => Promise<void>;
  onUpdatePassword: (data: any) => Promise<void>;
}

const PasswordUpdateDialog: React.FC<PasswordUpdateDialogProps> = ({ 
  open, onClose, onRequestCode, onVerifyCode, onUpdatePassword 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    verificationCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const steps = ['Send Code', 'Verify', 'New Password'];

  useEffect(() => {
  if (!open) {
    setActiveStep(0);
    setError(null);
    setFormData({
      verificationCode: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }
}, [open]);

  const handleNextStep = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeStep === 0) {
        await onRequestCode();
        setActiveStep(1);
      } else if (activeStep === 1) {
        await onVerifyCode(formData.verificationCode);
        setActiveStep(2);
      } else {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await onUpdatePassword(formData);
        onClose(); 
        setActiveStep(0); 
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Update Security Settings</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ py: 3 }} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mt: 1 }}>
          {activeStep === 0 && (
            <Typography variant="body2" textAlign="center">
                For security, we will send a 6-digit verification code to your registered email address.
            </Typography>
          )}

          {activeStep === 1 && (
            <TextField
              fullWidth autoFocus label="Verification Code"
              value={formData.verificationCode}
              onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
            />
          )}

          {activeStep === 2 && (
            <>
                <TextField
                    fullWidth required
                    label="Current Password"
                    type="password"
                    margin="dense"
                    error={formData.currentPassword === ""}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
                <TextField
                    fullWidth required
                    label="New Password"
                    type="password"
                    margin="dense"
                    error={formData.newPassword.length > 0 && formData.newPassword.length < 6}
                    helperText={formData.newPassword.length > 0 && formData.newPassword.length < 6 ? "Minimum 6 characters" : ""}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <TextField
                    fullWidth required
                    label="Confirm Password"
                    type="password"
                    margin="dense"
                    error={formData.confirmPassword !== "" && formData.confirmPassword !== formData.newPassword}
                    helperText={formData.confirmPassword !== "" && formData.confirmPassword !== formData.newPassword ? "Passwords do not match" : ""}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleNextStep} 
          variant="contained" 
          disabled={loading || 
            (activeStep === 1 && !formData.verificationCode) || 
            (activeStep === 2 && (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword && formData.confirmPassword !== formData.newPassword))}
        >
          {loading ? <CircularProgress size={24} /> : activeStep === 2 ? 'Update Password' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordUpdateDialog;