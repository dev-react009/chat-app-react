import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { verifyOTPAction } from "../redux/reducers/auth/login/loginReducer";
import useCustomNavigate from "../utils/navigate";
import { log } from "../utils/logger";

const CreateNewPasswordScreen = () => {
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
// const [otpExpired, setOtpExpired] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const dispatch = useDispatch<AppDispatch>();
const {navigateTo} = useCustomNavigate();
const {state} = useLocation();
log(state);

const handleSubmit = async () => {
    if (newPassword === confirmPassword && newPassword!=="") {
    
    const credentials = {
        email:state.email,
        newPassword:newPassword,
        otp:state.newOTP
    }
        const response = await dispatch(verifyOTPAction(credentials));
        const fulfilled = response.payload;
        if(fulfilled.status===true){
            toast.success("Password reset successfully");
                navigateTo('/');
        }else{
            toast.error(fulfilled.error);
            // setOtpExpired(true);
            setTimeout(()=>{
                navigateTo('/forgot');
            },1000)
        }
    } else {
      toast.warning("Passwords do not match");
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          Create New Password
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 3 }}>
          Please enter your new password and confirm it.
        </Typography>

        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ marginBottom: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowConfirmPassword}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: "100%",
            textTransform: "capitalize",
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            "&:hover": {
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
            },
          }}
        >
          Submit
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateNewPasswordScreen;
