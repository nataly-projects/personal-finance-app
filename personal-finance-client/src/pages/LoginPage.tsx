import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
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
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: "24px",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          // maxWidth: 400,
          // mx: "auto",
          // mt: 5,
          // display: "flex",
          // flexDirection: "column",
          // gap: 2,
          // border: '1px solid #795B4A',
          // borderRadius: '10px',
          // padding: '20px',
        }}
      >
        <Typography 
          variant="h5" 
          // gutterBottom 
          sx={{ 
            fontWeight: "bold",
            textAlign: "center",
            color: theme.customColors.lightBlue,
            // color: '#795B4A',
            // textAlign: 'center',
            // fontWeight: 'bold',
            // mb: 3
          }}
        >
          Welcome Back
        </Typography>

        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ 
            backgroundColor: theme.customColors.lightBlue,
            "&:hover": { backgroundColor: theme.customColors.hoverBlue }, 
          }}
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
            variant="body1"
            onClick={() => setIsForgotPasswordOpen(true)}
            sx={{ 
              color: theme.customColors.lightBlue,
              textDecoration: "none",
            }}
          >
            Forgot password?
          </Link>

          <Typography 
          variant="body1" 
          sx={{ 
            textAlign: "center",
              color: theme.palette.text.secondary,
            }}>
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body1"
              onClick={() => setIsLoginPage(false)}
              sx={{ 
                color: theme.customColors.lightBlue,
                textDecoration: "none",
              }}
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
