import  { useState } from "react";
import PropTypes from "prop-types";
import { Typography, TextField, Button, Box } from "@mui/material";
import axios from "axios";

const OtpVerification = ({ email, setVarified, setOtpWindow }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message,setMessage]=useState('')

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Focus on the next input field
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOTPVerify = async() => {
    const otpValue = otp.join("");
    const response = await axios.post("http://localhost:3200/auth/otpvarify", {
        otp:otpValue,email:email
      });
      if(response.data.success)
      {
        console.log(response);
    console.log("OTP Submitted: ", otpValue);
    setVarified(true);
    setOtpWindow(false);
    }
    else{
        setMessage('invalid otp')
        setOtp(["", "", "", "", "", ""])
        console.log('invalid otp');
    }
  };
  

  const handleResendOtp=async()=>{
    const response = await axios.post("http://localhost:3200/auth/resendOtp", {
       email:email
      });
      if(response)
      {
        setMessage('otp sended')
      }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#009688", fontWeight: "bold", marginBottom: "2vh" }}
      >
        OTP Verification
      </Typography>
      {message && (
        <Typography
          variant="body1"
          color="error"
          sx={{ marginBottom: "2vh" }}
        >
          {message}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2vh",
        }}
      >
        {otp.map((digit, index) => (
          <TextField
            key={index}
            id={`otp-${index}`}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: { textAlign: "center", fontSize: "1.5rem" },
            }}
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            sx={{
              width: "3rem",
              marginRight: index < otp.length - 1 ? "0.5rem" : 0,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#009688",
                },
                "&:hover fieldset": {
                  borderColor: "#009688",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#009688",
                },
              },
            }}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        onClick={handleOTPVerify}
        sx={{
          backgroundColor: "#009688",
          "&:hover": {
            backgroundColor: "#00796b",
          },
          color: "#fff",
          marginTop: 2,
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        Verify
      </Button>
      <Button
        variant="text"
        onClick={handleResendOtp}
        sx={{
          color:  "#009688",
          marginTop: 2,
        }}
      >
        Resend OTP
      </Button>
    </Box>
  );
};

// Define the prop types
OtpVerification.propTypes = {
  setVarified: PropTypes.func.isRequired,
  setOtpWindow: PropTypes.func.isRequired,
  email: PropTypes.func.isRequired,
};

export default OtpVerification;
