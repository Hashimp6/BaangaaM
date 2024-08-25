import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link,  } from "react-router-dom";
import bg from "../../public/pics/logbg.jpg";
import axios from "axios";
import GoogleLoginButton from "../components/GoogleButton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset error messages
    setEmailError("");
    setPasswordError("");

    // Check if email and password fields are filled
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
        const response = await axios.post("http://localhost:3200/login", {
          email: email.trim(),
          password: password.trim(),
        });

        setEmail("");
        setPassword("");
        if (response) {
          console.log(response);
          setLoginStatus(true);
        } else {
          setLoginStatus(false);
        }
      } catch (error) {
        console.log("Error fetching:", error);
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
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          height: "auto",
          width: "35%",
          padding: 3,
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
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#009688", fontWeight: "bold", marginBottom: "2vh" }}
          >
            Log in
          </Typography>
          {loginStatus === false && (
            <Alert fullWidth severity="error">
              Invalid username or Password. please try again..
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="standard"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(""); // Clear the error when user starts typing
              }}
              fullWidth
              error={!!emailError}
              helperText={emailError}
              sx={{
                marginBottom: 2,
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#009688",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#009688",
                },
                "& .MuiInputLabel-root": {
                  color: "#009688",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#009688",
                },
              }}
            />
            <TextField
              label="Password"
              variant="standard"
              type="password"
              name="password"
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(""); // Clear the error when user starts typing
              }}
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                marginBottom: 2,
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#009688",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#009688",
                },
                "& .MuiInputLabel-root": {
                  color: "#009688",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#009688",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#009688",
                "&:hover": {
                  backgroundColor: "#00796b",
                },
                color: "#fff",
                marginTop: 2,
              }}
              fullWidth
            >
              Sign in
            </Button>
            <GoogleLoginButton />
          </form>
          <Typography variant="h7" sx={{ color: "#009688", marginTop: "30px" }}>
            I want to
            <Link
              to="/register"
              style={{
                marginLeft: "5px",
                color: "#009688",
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

export default LoginForm;
