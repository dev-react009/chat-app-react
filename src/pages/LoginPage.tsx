import React, { ChangeEvent, useState } from "react";
import { Grid } from "@mui/material";
import { IErrors, IFormData, initialValues, values } from "../utils/interface";
import AuthForm from "../components/AuthForm";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { loginAction } from "../redux/reducers/auth/login/loginReducer";
import { ToastError, ToastSuccess } from "../utils/toastify";
import Cookies from "js-cookie";

import useCustomNavigate from "../utils/navigate";
import SecureRouting from "../utils/SecureRouting";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<IFormData>(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<IErrors>(values);
  const {navigateTo} = useCustomNavigate();
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) error = "Email Is Required";
        if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid Email Address";
        break;
      case "password":
        if (!value) error = "Password Is Required";
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleChangeFormData = (event: ChangeEvent<HTMLInputElement>) => {
  
    const { name, value } = event.target;
    validateField(name,value);
    setFormData({ ...formData, [name]: value });
  };
  
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await dispatch(loginAction(formData));
    const fulfilled = response.payload;
    console.log(fulfilled)
    if (fulfilled.status)  {
      ToastSuccess(fulfilled?.message);
      setFormData(initialValues);
      navigateTo("/dashboard")
      const expirationTime = new Date(new Date().getTime() + 24 * 60* 60 * 1000);
      Cookies.set("token", fulfilled.token, { expires: expirationTime });
      Cookies.set('user',JSON.stringify(fulfilled.data))
    }
    else{
      ToastError(fulfilled?.error)
    };
  };
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        transition: "all 1s",
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
        background:
          "linear-gradient(125deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={8}
        lg={7}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "10px",
        }}
      >
        <AuthForm
          title="Join the conversation the never ends"
          isLogin
          onSubmit={handleLoginSubmit}
          formData={formData}
          handlerChange={handleChangeFormData}
          showPassword={showPassword}
          handleClickShowPassword={handleClickShowPassword}
          errors={errors}
        />
      </Grid>
    </Grid>
  );
};

export default SecureRouting(LoginPage);
