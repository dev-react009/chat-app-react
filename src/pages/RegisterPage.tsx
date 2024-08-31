import React, { ChangeEvent, useState } from "react";
import { Box, Grid } from "@mui/material";
import AuthForm from "../components/AuthForm";
import { IErrors, IFormData, initialValues, values } from "../utils/interface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { registerAction } from "../redux/reducers/auth/register/registerReducer";
import { toast } from "react-toastify";
import useCustomNavigate from "../utils/navigate";
import assest from"../assests/asses-reg.jpg";
import MyLoadingComponent from "../components/loader";




const RegisterPage: React.FC = () => {
  const { navigateTo } = useCustomNavigate();
  const [formData, setFormData] = useState<IFormData>(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<IErrors>(values);
  const dispatch = useDispatch<AppDispatch>();
const { loading } = useSelector((state: RootState) => state.registerReducer);
  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "username":
        if (!value) error = "Username Is Required";
        break;
      case "email":
        if (!value) error = "Email Is Required";
        if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid Email Address";
        break;
      case "password":
        if (!value) error = "Password Is Required";
        if (value.length < 6)
          error = "Password must be at least 6 characters long";
        break;
      case "mobile":
        if(value.length>10) return;
        if (!value) error = "Cannot be Empty";
        else if (!/^[6-9]\d{9}$/.test(value))
          error = "Must be 10 characters & starts with [6-9]";
        else error = "";
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleChangeFormData = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    validateField(name, value);
    switch (name) {
      case "mobile":
        setFormData((prev) => ({
          ...prev,
          mobile: value?.replace(/\D/g, "").slice(0, 10),
        }));
        break;
      case "username":
        setFormData((prev) => ({
          ...prev,
          username: value?.trimStart(),
        }));
        break;
      case "email":
        setFormData((prev) => ({
          ...prev,
          email: value?.trimStart(),
        }));
        break;
      case "password":
        setFormData((prev) => ({
          ...prev,
          password: value?.trimStart(),
        }));
        break;
      default:
        setFormData({ ...formData, [name]: value?.trimStart });
        return;
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const response = await dispatch(registerAction(formData));
    const fulfilled = response.payload;
    
    if (fulfilled.status===true) {
      navigateTo("/");
      setFormData(initialValues);
      toast.success(response.payload.message);
    } else toast.warning(response.payload.error);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        transition: "all 1s",
        height: "100vh",
        background:
          "linear-gradient(125deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        lg={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {loading ==="pending" ? (
          <MyLoadingComponent />
        ) : (
          <AuthForm
            title="Ready to connect? Register now and start chatting instantly!"
            onSubmit={handleRegisterSubmit}
            formData={formData}
            handlerChange={handleChangeFormData}
            showPassword={showPassword}
            handleClickShowPassword={handleClickShowPassword}
            errors={errors}
          />
        )}
      </Grid>

      {/* Right side - Image */}
      {/* <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(254, 254, 254, 0.7)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            maxHeight: "100vh",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            // background: `url(${asset}) no-repeat center center`,
            backgroundSize: "cover",
          }}
        >
          
          <Box
            sx={{
              width: "100%",
              height: "100%",
              // maxHeight: "100vh",
              borderRadius: 0,
              
            }}
            component="img"
            src={assest}
            alt="Registration Visual"
          />
        </Box>
      </Grid> */}
    </Grid>
  );
};

export default RegisterPage;
