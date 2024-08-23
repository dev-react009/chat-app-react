import  { ChangeEvent, useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { forgotPasswordAction } from "../redux/reducers/auth/login/loginReducer";
import useCustomNavigate from "../utils/navigate";
import { ToastError, ToastSuccess } from "../utils/toastify";
import { toast } from "react-toastify";
import { log } from "../utils/logger";

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {navigateTo}=useCustomNavigate();

  const [email, setEmail] = useState("");
  const[isSending,setIsSending] = useState(false);
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSendOtp = async() => {
    if(email!==""){
        setIsSending(true);
    const response = await dispatch(forgotPasswordAction({email}));
    const fulfilled = response.payload;
log(fulfilled)
    if (fulfilled.status === true) {
        ToastSuccess(fulfilled.message);
      setTimeout(() => {
        navigateTo("/verifyOTP", {email});
      }, 500);
    }
    else{
        setIsSending(false)
        ToastError(fulfilled.error);
    }
}else{
    toast.warning("Email Field Cannot be empty")
}
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0f4f8",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, maxWidth: 400 }}>
        <Box sx={{ textAlign: "center", marginBottom: 2 }}>
          <LockOpenIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          <Typography variant="h5" gutterBottom>
            Forgot Your Password?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Don't worry! We'll help you reset it.
          </Typography>
        </Box>

        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your account's email"
          sx={{ marginBottom: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendOtp}
          disabled={isSending}
          sx={{
            marginBottom: 2,
            background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
            textTransform: "capitalize",
          }}
        >
          {isSending ? "Sending OTP..." : "Send OTP"}
        </Button>

        <Typography variant="body2" align="center" color="textSecondary">
          Remembered your password?{" "}
          <a href="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            Go back to Login
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordScreen;
