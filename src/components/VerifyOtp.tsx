

import  {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { Stack,Box, TextField, Button, Typography, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import useCustomNavigate from "../utils/navigate";
import { ToastError } from "../utils/toastify";
import { verifyOTPAction } from "../redux/reducers/auth/login/loginReducer";
import { log } from "../utils/logger";

const VerifyOtpScreen = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(10); // countdown timer
  const inputRefs = useRef<HTMLInputElement[]>([]);
const {state} = useLocation();
const {navigateTo} = useCustomNavigate();
log(state)
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    };
   
  }, []);


    useEffect(() => {
      // Handle countdown timer
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [timer]);

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

  const handleOtpChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newOtp = [...otp];
    const value = event.target.value;

    if (value !== "") {
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if the current one is filled and it's not the last one
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLDivElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
log(state)

  const handleInputClick=(index:number)=>{
    if(index>0 && inputRefs.current[index-1] ){
      inputRefs?.current[otp.indexOf("")]?.focus();
    }
  }
  const handleNavigateToBack = () => {
    navigateTo("/forgot");
  };

  const handleSubmit = async() => {
    // Add logic to verify OTP
    if (otp.every((item) => item !== "")) {
      // Verify OTP and handle the response
    log("OTP Submitted:", otp.join(""));
    const newOTP = otp.join("");
    const email =state.email;
    navigateTo("/createPassword",{email,newOTP});
    }
    else{
      ToastError("All Fields Should Be Required")
    }
  };

  const handleResendOtp = async() => {
    // Resend OTP logic
    // const response
    console.log("Resending OTP...");
    setTimer(10);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient background
        padding: 2,
      }}
    >
      <Box
        sx={{
          background: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Stack direction="row" alignItems={"start"} justifyContent={"start"}
        onClick={handleNavigateToBack}
        >
          <Box>
            <ArrowBackIosNew
              sx={{
                fontSize: "18px",
                "&:hover": {
                  transform: "translateX(-1px)",
                  transition: " 0.5s ease-in-out",
                  color:"#2575fc",
                  cursor:"pointer"
                },
              }}
            />
          </Box>
        </Stack>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          Verify OTP
        </Typography>

        <Typography variant="body2" sx={{ marginBottom: 3 }}>
          Enter the 6-Digit Code We Sent to Your Email
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {otp.map((_, index) => (
            <Grid item key={index} xs={2}>
              <TextField
                variant="outlined"
                size="small"
                inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
                value={otp[index]}
                onChange={(event) => handleOtpChange(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onClick={() => handleInputClick(index)}
                inputRef={(ref) => (inputRefs.current[index] = ref!)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#2575fc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#6a11cb",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2575fc",
                    },
                  },
                  width: "45px",
                  height: "45px",
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            marginTop: 3,
            width: "100%",
            textTransform: "capitalize",
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
          }}
        >
          Next
        </Button>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Didn’t receive an OTP?{" "}
            <Button
              variant="text"
              disabled={timer > 0}
              onClick={handleResendOtp}
              sx={{ textTransform: "capitalize" }}
            >
              Resend OTP {timer > 0 && `(${formatTime(timer)})s`}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOtpScreen;

