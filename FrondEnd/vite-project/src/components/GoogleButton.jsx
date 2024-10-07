// src/components/LoginForm/GoogleLoginButton.js
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_Backend_api}/auth/google`;
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="outlined"
      startIcon={<GoogleIcon />}
      sx={{
        marginTop: 2,
        borderColor: "#DB4437",
        color: "#DB4437",
        "&:hover": {
          backgroundColor: "#fbe9e7",
          borderColor: "#DB4437",
        },
      }}
      fullWidth
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
