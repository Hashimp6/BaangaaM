import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../../public/pics/storelog.jpg";
import StoreIcon from "@mui/icons-material/Store";
import axios from "axios";
import { keyframes } from "@emotion/react";

// Color Scheme: Updated
const primaryColor = "#009688";
const hoverColor = "#FF4500"; // Orange Red

// Animation: Slide in from the top
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

function StoreLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

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
        const response = await axios.post("http://localhost:3200/store-login", {
          email: email.trim(),
          password: password.trim(),
        });

        setEmail("");
        setPassword("");
        if (response.data.success) {
          navigate("/store-home");
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
        animation: `${slideIn} 1s ease-in-out`, // Apply the slide-in animation
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
            animation: `${slideIn} 1.5s ease-in-out`, // Delay the animation slightly
          }}
        >
          <StoreIcon
            sx={{ fontSize: 60, color: "#009688", marginBottom: "10px" }} // Store icon in teal
          />
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: primaryColor,
              fontWeight: "bold",
              marginBottom: "2vh",
            }}
          >
            Store Login
          </Typography>
          {loginStatus === false && (
            <Alert fullWidth severity="error">
              Invalid email or password. Please try again.
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
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
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
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                "&:hover": {
                  backgroundColor: hoverColor,
                },
                color: "#fff",
                marginTop: 2,
              }}
              fullWidth
            >
              Sign in
            </Button>
          </form>
          <Typography
            variant="h7"
            sx={{
              color: primaryColor,
              marginTop: "30px",
              animation: `${slideIn} 2s ease-in-out`,
            }}
          >
            I want to
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

export default StoreLoginForm;
