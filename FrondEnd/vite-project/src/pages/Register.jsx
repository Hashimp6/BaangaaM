import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import bg from "../../public/pics/logbg.jpg";
import OtpVerification from "../components/OtpVarify";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [varified, setVarified] = useState(false);
  const [otpWindow, setOtpWindow] = useState(false);
  //   const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Reset error messages
    setNameError("");
    setEmailError("");
    setPasswordError("");

    // Check if email and password fields are filled
    let isValid = true;
    if (name.trim().length === 0) {
      setNameError("Name is required.");
      isValid = false;
    }

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
        const response = await axios.post("http://localhost:3200/register", {
            name:name.trim(),
            email: email.trim(),
          password: password.trim(),
        });
        setName("");
        setEmail("");
        setPassword("");
        if (response) {
          console.log(response);
          //   setLoginStatus(true);
        } else {
          //   setLoginStatus(false);
        }
      } catch (error) {
        console.log("Error fetching:", error);
        // setLoginStatus(false);
      }
    }
  };

  const handleVerify = async () => {
    try {
        let isValid=true
        
        if (email.trim().length === 0) {
            setEmailError("Email is required.");
            isValid = false;
          } else if (!validateEmail(email.trim())) {
            setEmailError("Invalid email format.");
            isValid = false;
          }
if (isValid){
      const response =await axios.post("http://localhost:3200/auth/varify", {
        email: email.trim(),
      });
      if (response.data.success) {
        setOtpWindow(true);
        console.log(response);
      }
    }
    } catch (error) {
      console.log(error);
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
        {otpWindow ? (
          <OtpVerification email={email} setVarified={setVarified} setOtpWindow={setOtpWindow}/>
        ) : (
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
              Register
            </Typography>

            {/* Display error message
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        {/* Display success message */}
            {/* {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>} */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (varified) {
                  handleSubmit();
                } else {
                  handleVerify();
                }
              }}
            >
              <TextField
                label="Name"
                variant="standard"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                error={!!nameError}
                helperText={nameError}
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
                label="Email"
                variant="standard"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                error={!!emailError}
                helperText={emailError}
                InputProps={{
                  endAdornment: varified && (
                    <CheckCircleIcon
                      sx={{
                        color: "#009688",
                        marginLeft: 1,
                      }}
                    />
                  ),
                }}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                }
                label={
                  <span
                    style={{
                      color: acceptTerms ? "#009688" : "red",
                      fontSize: "0.75rem",
                    }}
                  >
                    *All terms and conditions apply
                  </span>
                }
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
                {varified ? "REGISTER" : "Varify Email"}
              </Button>
            </form>
            <Typography
              variant="h7"
              sx={{ color: "#009688", marginTop: "30px" }}
            >
              Already Registered?
              <Link
                to="/login"
                style={{
                  marginLeft: "5px",
                  color: "#009688",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default RegisterForm;
