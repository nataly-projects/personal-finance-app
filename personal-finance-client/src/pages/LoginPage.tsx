import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoginFormData } from "../utils/types";
import { useAuth } from "../hooks/useAuth";
import ForgotPasswordDialog from "../components/ForgotPasswordDialog";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(3, "Password must be at least 3 characters").required("Password is required"),
});

const LoginPage = ({ setIsLoginPage }: { setIsLoginPage: (isLogin: boolean) => void }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        alert(result.error || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed.");
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: '1px solid #795B4A',
          borderRadius: '10px',
          padding: '20px',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: '#795B4A',
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Welcome back to Personal Finance
        </Typography>

        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "fit-content" }}
        >
          Sign In
        </Button>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 1,
          mt: 2 
        }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => setIsForgotPasswordOpen(true)}
            sx={{ color: '#795B4A' }}
          >
            Forgot password?
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => setIsLoginPage(false)}
              sx={{ color: '#795B4A' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>

      <ForgotPasswordDialog 
        open={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </>
  );
};

export default LoginPage;
