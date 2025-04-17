import React, {useContext} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box } from "@mui/material";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { RegisterFormData } from "../utils/types";

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

const RegisterPage: React.FC = () => {
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
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
        const response = await API.post("/users/register", data);
        console.log('response', response);
        login(response.data.user); 
        localStorage.setItem("token", response.data.token);
        // Redirect the user to the home page
        navigate("/");
        alert("Registration successful!");
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
      gap: 2, // Add spacing between form fields
    }} > 
      <TextField
        label="Full Name"
        {...register("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        fullWidth
        required
      />
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
     <TextField
        label="Confirm Password"
        type="password"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        fullWidth
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ width: "fit-content"}}
      >
        Register
      </Button>
    </Box>

  );
};

export default RegisterPage;
