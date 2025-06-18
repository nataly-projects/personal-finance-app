import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RegisterFormData } from "../utils/types";
import { useAuth } from "../hooks/useAuth";

const schema = yup.object().shape({
  fullName: yup
    .string()
    .matches(/^[a-zA-Z]+ [a-zA-Z]+$/, "Full Name must include first and last name")
    .required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(3, "Password must be at least 3 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterPage: React.FC<{ setIsLoginPage: (isLogin: boolean) => void }> = ({ setIsLoginPage }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await register(data.email, data.password, data.fullName);
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        alert(result.error || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    }
  };

  return (
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
        component="h1" 
        gutterBottom 
        sx={{ 
          color: '#795B4A',
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 3
        }}
      >
        Join our community <br />
        Start managing your finances today
      </Typography>

      <TextField
        label="Full Name"
        {...formRegister("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        fullWidth
        required
      />
      <TextField
        label="Email"
        {...formRegister("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        {...formRegister("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        {...formRegister("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        fullWidth
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ width: "fit-content" }}
      >
        Sign Up
      </Button>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 1,
        mt: 2 
      }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => setIsLoginPage(true)}
            sx={{ color: '#795B4A' }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
