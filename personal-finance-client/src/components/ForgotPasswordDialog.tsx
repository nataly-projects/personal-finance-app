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

const codeSchema = yup.object().shape({
  code: yup
    .string()
    .required("Verification code is required")
    .min(6, "Code is too short") 
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
  const { passwordResetRequest, isRequestingCode, requestError, verifyResetCode, isVerifyingCode, verifyError, resetPassword, isResettingPassword, resetError, forgetPasswordAuthForms } = useAuth();

  const [resetStep, setResetStep] = useState<'email' | 'code' | 'new-password'>('email');
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const currentError = requestError || verifyError || resetError;
  const isLoading = isRequestingCode || isVerifyingCode || isResettingPassword;

  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    mode: "onChange"
  });

  const codeForm = useForm({ 
    resolver: yupResolver(codeSchema),
    defaultValues: { code: "" } 
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleRequestReset = async (data: { email: string }) => {
    try {
      setServerMessage(null);
      await passwordResetRequest(data.email);
      setServerMessage("Reset code has been sent to your email");
      setResetStep('code');
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleVerifyCode = async (data: { code: string }) => {
    try {
      setServerMessage(null);
      const email = emailForm.getValues('email');
      await verifyResetCode({email, code: data.code});
      setServerMessage("Code verified successfully");
      setResetStep('new-password');
    } catch (error: any) {
      console.error(error);
    } 
  };

  const handleResetPassword = async (data: { newPassword: string, confirmPassword: string }) => {
    try {
      setServerMessage(null);
      await resetPassword({
        email: emailForm.getValues('email'),
        code: codeForm.getValues('code'), 
        newPassword: data.newPassword
      });
       setServerMessage("Password has been reset successfully");
        setTimeout(() => {
          handleClose();
        }, 2000);
    } catch (error: any) {
      console.error(error);
    } 
  };

  const handleClose = () => {
    onClose();
    setResetStep('email');
    setServerMessage(null);
    emailForm.reset();
    codeForm.reset();
    passwordForm.reset();
    forgetPasswordAuthForms();
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
              disabled={isLoading}
            />
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: theme.customColors.lightBlue }}>
                Cancel
              </Button>
             <Button 
                type="submit"
                disabled={isLoading || !emailForm.watch('email')?.trim()}
                sx={{
                  backgroundColor: theme.customColors.lightBlue,
                  color: '#fff',
                  '&:hover': { backgroundColor: theme.customColors.hoverBlue },
                }}
              >
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </DialogActions>
          </form>
        )}

        {resetStep === 'code' && (
          <form onSubmit={codeForm.handleSubmit(handleVerifyCode)}>
            <Typography variant="body1" sx={{ m: 1 }}>
              Enter the reset code sent to your email.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Reset Code"
              fullWidth
              {...codeForm.register("code")}
              error={!!codeForm.formState.errors.code}
              helperText={codeForm.formState.errors.code?.message}
              disabled={isLoading}
              inputProps={{ style: { textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem' } }}
            />
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: theme.customColors.lightBlue }}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                sx={{
                  backgroundColor: theme.customColors.lightBlue,
                  color: '#fff',
                  '&:hover': { backgroundColor: theme.customColors.hoverBlue },
                }}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </DialogActions>
          </form>
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
              disabled={isLoading}
            />
            <TextField
              margin="dense"
              label="Confirm Password"
              type="password"
              fullWidth
              {...passwordForm.register("confirmPassword")}
              error={!!passwordForm.formState.errors.confirmPassword}
              helperText={passwordForm.formState.errors.confirmPassword?.message}
              disabled={isLoading}
            />
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: theme.customColors.lightBlue }}>
                Cancel
              </Button>
             <Button 
                type="submit"
                disabled={isLoading}
                sx={{
                  backgroundColor: theme.customColors.lightBlue,
                  color: '#fff',
                  '&:hover': { backgroundColor: theme.customColors.hoverBlue },
                }}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </DialogActions>
          </form>
        )}
        {currentError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(currentError as any).response?.data?.message || "Operation failed"}
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