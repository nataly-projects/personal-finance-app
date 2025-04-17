import React, {useContext} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box } from "@mui/material";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoginFormData } from "../utils/types";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(3, "Password must be at least 3 characters").required("Password is required"),
});

const LoginPage = () => {
  const auth = useContext(AuthContext); 
  
  if (!auth) {
    throw new Error("AuthContext is not provided. Please wrap the app with AuthProvider.");
  }
  const { login } = auth;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await API.post("/users/login", data);
      console.log(response);
      login(response.data.user); 
      localStorage.setItem("token", response.data.token); 
      navigate("/");
      alert("Login successful!");
    } catch (error) {
      console.error(error);
      alert("Login failed.");
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
    }} > 
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
      sx={{ width: "fit-content"}}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
