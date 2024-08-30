import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import { IErrors, IFormData } from "../utils/interface";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useCustomNavigate from "../utils/navigate";

interface AuthFormProps {
  title: string;
  isLogin?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  formData: IFormData;
  handlerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  handleClickShowPassword: () => void;
  errors: IErrors;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  isLogin,
  onSubmit,
  formData,
  errors,
  handlerChange,
  showPassword,
  handleClickShowPassword,
}) => {
  const { loading } = useSelector((state: RootState) => state.registerReducer);
  const {loadingAction} = useSelector((state:RootState)=>state.loginReducer)

  const { navigateTo } = useCustomNavigate();
  const handleToggle = () => {
    isLogin ? navigateTo("/reg") : navigateTo("/");
  };

  const handleNavigate = () => {
    navigateTo("/forgot");
  };
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      autoComplete="off"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        height: "100%",
        width: { xs: "100%", md: "70%" },
        padding: { xs: 3, sm: 3 },
        backgroundColor: "rgba(255, 255, 255, 0.1) transparent",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: 8,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(50px)",
        transition: "all 0.5s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 6px 40px rgba(0, 0, 0, 0.15)",
        },
        "@media (min-width: 768px)": {
          padding: 3,
        },
      }}
    >
      <Stack direction="column" alignItems="flex-start" width={"100%"}>
        <Typography
          variant="h4"
          color="white"
          // width={"100%"}
          component="h3"
          fontSize="15px"
          gutterBottom
          my={1}
          textAlign={"justify"}
        >
          {title}
        </Typography>
      </Stack>
      <Box
        sx={{
          minHeight: "5%",
          transition: "all 1s ease-in-out",
        }}
      >
        {!isLogin && (
          <Typography color="white" fontSize={"15px"}>
            {loading === "pending" && "please wait a moment..."}
          </Typography>
        )}
      </Box>
      {!isLogin && (
        <TextField
          margin="normal"
          fullWidth
          id="name"
          label="Name"
          name="username"
          value={formData.username}
          onChange={handlerChange}
          autoComplete="current-username"
          autoFocus={formData.username !== ""}
          error={!!errors?.username}
          helperText={errors?.username}
          sx={inputStyles}
        />
      )}
      <TextField
        margin="normal"
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        value={formData.email}
        onChange={handlerChange}
        autoComplete="user-email"
        autoFocus={isLogin}
        error={!!errors.email}
        helperText={errors.email}
        sx={inputStyles}
      />
      <TextField
        type={showPassword ? "text" : "password"}
        margin="normal"
        fullWidth
        id="password"
        label="Password"
        name="password"
        value={formData.password}
        onChange={handlerChange}
        autoComplete="user-password"
        autoFocus
        error={!!errors.password}
        helperText={errors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
                aria-label="toggle password visibility"
                sx={{ color: "white" }}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={inputStyles}
      />
      {!isLogin && (
        <TextField
          margin="normal"
          fullWidth
          name="mobile"
          value={formData.mobile}
          onChange={handlerChange}
          label="Mobile"
          type="text"
          id="mobile"
          autoComplete="current-mobile"
          autoFocus
          error={!!errors.mobile}
          helperText={errors.mobile}
          sx={inputStyles}
        />
      )}
      {isLogin && (
        <Stack direction={"column"} width={"100%"} alignItems={"flex-end"}>
          <Typography
            onClick={handleNavigate}
            color={"whitesmoke"}
            fontSize={"12px"}
            sx={{ cursor: "pointer", "&:hover": { opacity: 0.9 } }}
          >
            Forgot Password?
          </Typography>
        </Stack>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loadingAction === ("pending" || "reject")}
        // sx={{
        //   mt: 2,
        //   mb: 2,
        //   py: 1.5,
        //   background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
        //   borderRadius: 3,
        //   fontWeight: "bold",
        //   fontSize: "0.8rem",
        //   textTransform: "none",
        //   transition: "all 2s",
        //   boxShadow: "0 4px 14px rgba(0, 118, 255, 0.39)",
        //   "&:hover": {
        //     background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
        //     boxShadow: "0 6px 20px rgba(0, 118, 255, 0.5)",
        //     transform: "translateY(-8px)",
        //     transition: "all 1s ease-in-out",
        //   },
        // }}
        sx={{
          position: "relative",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
          paddingBlock: "0.5rem",
          paddingInline: "1.25rem",
          textTransform: "capitalize",
          fontWeight: "bold",
          fontSize: "0.8rem",
          background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          gap: "10px",
          outline: "none",
          overflow: "hidden",

          "& .icon": {
            width: "24px",
            height: "24px",
            transition: "all 0.3s ease-in-out",
          },
          "&:hover": {
            borderColor: "#fff9",
            background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
            boxShadow: 5,
            "&::before": {
              // animation: "shine 2.5s ease-out infinite",
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100px",
            height: "100%",
            backgroundImage:
              "linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 70%)",
            top: 0,
            left: "-100px",
            opacity: 0.6,
            animation: "shine 2.5s ease-out infinite",
          },
          "@keyframes shine": {
            "0%": {
              left: "-100px",
            },
            "100%": {
              left: "100%",
            },
          },
        }}
      >
        {loadingAction === "pending" ? (
          <Typography color={"inherit"}>Loading ...</Typography>
        ) : isLogin ? (
          "Access Your Account"
        ) : (
          "JoinNow"
        )}
      </Button>
      {isLogin ? (
        <Typography
          variant="body2"
          color="white"
          sx={styles.authFormHelperText}
        >
          Don't have an account?
          <Box component={"span"} onClick={handleToggle}>
            Create New One?
          </Box>
        </Typography>
      ) : (
        <Typography
          variant="body2"
          color="white"
          sx={styles.authFormHelperText}
        >
          Already have an account?
          <Box component={"span"} onClick={handleToggle}>
            Login?
          </Box>
        </Typography>
      )}
    </Box>
  );
};

export default AuthForm;

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.6)",
      color: "#ffffff",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.9)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2e8ff0",
      color: "rgba(255, 255, 255, 0.8)",
    },
    "& input": {
      color: "white",
    },
    "& input:-webkit-autofill": {
      border: "none",
      WebkitTextFillColor: "#ffffff",
      WebkitBoxShadow: "0 0 0px 1000px rgb(33, 33, 128) inset",
      transition: "background-color 5000s ease-in-out 0s",
      backgroundColor: "transparent !important",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.8)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgba(255, 255, 255, 1)",
  },
};



const styles = {
  authFormHelperText: {
    "& span": {
      color: "#00d4ff",
      ml: 1,
      cursor: "pointer",
      fontWeight: "bold",
      transition: "color 0.3s",
      "&:hover": {
        color: "#c2f715",
      },
    },
  },
};
