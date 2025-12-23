import React, { useState, memo } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Invalid email format. Must include @ and domain (e.g. example.com)"
    ),
});

const passwordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], "Passwords must match")
    .required("Please confirm your password"),
});

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = memo(({ open, onClose }) => {

  const theme = useTheme();
  const { requestPasswordReset, verifyResetCode, resetPassword } = useAuth();
  const [code, setCode] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'new-password'>('email');
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    mode: "onChange"
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleRequestReset = async (data: { email: string }) => {
    try {
      setServerError(null);
      setServerMessage(null);
      setIsRequesting(true);
      const result = await requestPasswordReset(data.email);
      if (result.success) {
        setServerMessage("Reset code has been sent to your email");
        setResetStep('code');
      } else {
        setServerError(result.error || "Failed to send reset code");
      }
    } catch (error) {
      console.error(error);
      setServerError("Failed to send reset code");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setServerError(null);
      setServerMessage(null);
      setIsRequesting(true);
      const result = await verifyResetCode(emailForm.getValues('email'), code);
      if (result.success) {
        setServerMessage("Code verified successfully");
        setResetStep('new-password');
      } else {
        setServerError(result.error || "Invalid code");
      }
    } catch (error) {
      console.error(error);
      setServerError("Failed to verify code");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleResetPassword = async (data: { newPassword: string, confirmPassword: string }) => {
    try {
      setServerError(null);
      setServerMessage(null);
      setIsRequesting(true);
      const result = await resetPassword(emailForm.getValues('email'), code, data.newPassword);
      if (result.success) {
        setServerMessage("Password has been reset successfully");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setServerError(result.error || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      setServerError("Failed to reset password");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setResetStep('email');
    setCode("");
    setServerError(null);
    setServerMessage(null);
    emailForm.reset();
    passwordForm.reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: theme.customColors.lightBlue, color: '#fff', textAlign: 'center' }}>
        Reset Your Password
      </DialogTitle>
      <DialogContent>
        
        {resetStep === 'email' && (
          <form onSubmit={emailForm.handleSubmit(handleRequestReset)}>
            <Typography variant="body1" sx={{ m: 1 }}>
              Enter your email address and we'll send you a reset code.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              {...emailForm.register("email")}
              error={!!emailForm.formState.errors.email}
              helperText={emailForm.formState.errors.email?.message}
              disabled={isRequesting}
            />
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: theme.customColors.lightBlue }}>
                Cancel
              </Button>
             <Button 
                type="submit"
                disabled={isRequesting || !emailForm.watch('email')?.trim()}
                sx={{
                  backgroundColor: theme.customColors.lightBlue,
                  color: '#fff',
                  '&:hover': { backgroundColor: theme.customColors.hoverBlue },
                }}
              >
                {isRequesting ? "Sending..." : "Send Code"}
              </Button>
            </DialogActions>
          </form>
        )}

        {resetStep === 'code' && (
          <>
            <Typography variant="body1" sx={{ m: 1 }}>
              Enter the reset code sent to your email.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Reset Code"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isRequesting}
            />
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: theme.customColors.lightBlue }}>
                Cancel
              </Button>
              <Button 
                onClick={handleVerifyCode} 
                disabled={isRequesting || !code}
                sx={{
                  backgroundColor: theme.customColors.lightBlue,
                  color: '#fff',
                  '&:hover': { backgroundColor: theme.customColors.hoverBlue },
                }}
              >
                {isRequesting ? "Verifying..." : "Verify Code"}
              </Button>
            </DialogActions>
          </>
        )}

        {resetStep === 'new-password' && (
          <form onSubmit={passwordForm.handleSubmit(handleResetPassword)}>
            <Typography variant="body1" sx={{ m: 1 }}>
              Enter your new password.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              {...passwordForm.register("newPassword")}
              error={!!passwordForm.formState.errors.newPassword}
              helperText={passwordForm.formState.errors.newPassword?.message}
              disabled={isRequesting}
            />
            <TextField
              margin="dense"
              label="Confirm Password"
              type="password"
              fullWidth
              {...passwordForm.register("confirmPassword")}
              error={!!passwordForm.formState.errors.confirmPassword}
              helperText={passwordForm.formState.errors.confirmPassword?.message}
              disabled={isRequesting}
            />
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: theme.customColors.lightBlue }}>
                Cancel
              </Button>
             <Button 
                type="submit"
                disabled={isRequesting}
                sx={{
                  backgroundColor: theme.customColors.lightBlue,
                  color: '#fff',
                  '&:hover': { backgroundColor: theme.customColors.hoverBlue },
                }}
              >
                {isRequesting ? "Resetting..." : "Reset Password"}
              </Button>
            </DialogActions>
          </form>
        )}
        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}
        {serverMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {serverMessage}
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default ForgotPasswordDialog; 