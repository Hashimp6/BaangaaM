import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import {
  adminLoginRequest,
  adminLoginSuccess,
} from "../redux/slices/admin/adminSlice";

// Color Scheme
const primaryColor = "#009688";
const hoverColor = "#FF4500";

// Animation
const slideIn = keyframes`
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(adminLoginRequest());

    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (email.trim().length === 0) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError("Invalid email format.");
      isValid = false;
    }

    if (password.trim().length === 0) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await axios.post(
          "http://localhost:3200/admin/login",
          {
            email: email.trim(),
            password: password.trim(),
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          dispatch(
            adminLoginSuccess({
              admin: response.data.admin,
              role: response.data.role,
            })
          );
          navigate("/adminhome");
          setLoginStatus(true);
        } else {
          setLoginStatus(false);
        }
      } catch (error) {
        console.error("Error fetching:", error);
        setLoginStatus(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        animation: `${slideIn} 1s ease-in-out`,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: {
            xs: "90%",
            md: "35%",
          },
          padding: { xs: 1, sm: 3, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            backgroundColor: "#ffffff",
            padding: 3,
            animation: `${slideIn} 1.5s ease-in-out`,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: primaryColor,
              fontWeight: "bold",
              marginBottom: "2vh",
            }}
          >
            Admin Login
          </Typography>
          {loginStatus === false && (
            <Alert severity="error" sx={{ width: "100%", marginBottom: 2 }}>
              Invalid email or password. Please try again.
            </Alert>
          )}
          <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
            <TextField
              label="Email"
              variant="standard"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              fullWidth
              error={!!emailError}
              helperText={emailError}
              sx={{
                marginBottom: 2,
                "& .MuiInput-underline:before": {
                  borderBottomColor: primaryColor,
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: primaryColor,
                },
                "& .MuiInputLabel-root": {
                  color: primaryColor,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: primaryColor,
                },
              }}
            />
            <TextField
              label="Password"
              variant="standard"
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              fullWidth
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                marginBottom: 2,
                "& .MuiInput-underline:before": {
                  borderBottomColor: primaryColor,
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: primaryColor,
                },
                "& .MuiInputLabel-root": {
                  color: primaryColor,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: primaryColor,
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                "&:hover": {
                  backgroundColor: hoverColor,
                },
                color: "#fff",
                marginTop: 2,
              }}
            >
              Sign in
            </Button>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: primaryColor,
              marginTop: "30px",
              animation: `${slideIn} 2s ease-in-out`,
            }}
          >
            I want to{" "}
            <Link
              to="/storeregister"
              style={{
                marginLeft: "5px",
                color: primaryColor,
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
