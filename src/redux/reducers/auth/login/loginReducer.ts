import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginState, userData } from "../../../../utils/interface";
import { loginUser, requestOTP, resetPasswordWithOTP } from "./loginAPI";

const initialState: loginState = {
  loadingAction: "initial",
  error: null,
  success: false,
  message: null,
  loginUser: {
    email: null,
    username: null,
    userId: null,
  },
};
export const loginAction = createAsyncThunk(
  "login/loginUser",
  async (userData: userData, { rejectWithValue }) => {
    try {
      const response = await loginUser(userData);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      return rejectWithValue("login failed");
    }
  }
);

export const forgotPasswordAction = createAsyncThunk(
  "requestOtp",
  async(user:{email:string}, {rejectWithValue})=>{

try{
  const response = await requestOTP(user);
  const jsonData = await response.json();
  return jsonData;
}catch(error){
  return rejectWithValue("Failed to send OTP");
}
});

export const verifyOTPAction = createAsyncThunk(
  "verifyOTP",
  async(userCredentials:{otp:string,email:string,newPassword:string},{rejectWithValue})=>{
    try{
      const response = await resetPasswordWithOTP(userCredentials);
      const jsonData = await response.json();
      return jsonData;
    }catch(error){
      return rejectWithValue("Failed to verify OTP");
    }
  }
)

const loginSlice = createSlice({
  name:"login",
  initialState,
  reducers: {},
  extraReducers:(builder)=>{
    builder
      .addCase(loginAction.pending, (state) => {
        state.loadingAction = "pending";
        state.message = null;
        state.error = null;
        state.success = false;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.loadingAction = "success";
        state.message = null;
        state.error = null;
        state.success = true;
        state.loginUser= action.payload?.data
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.loadingAction = "reject";
        state.message = null;
        state.error = null;
        state.success = false;
      })
      //forgotPasswordAction
      .addCase(forgotPasswordAction.pending, (state) => {
        state.loadingAction = "pending";
        state.message = null;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPasswordAction.fulfilled, (state, action) => {
        state.loadingAction = "success";
        state.message = null;
        state.error = null;
        state.success = true;
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.loadingAction = "reject";
        state.message = null;
        state.error = null;
        state.success = false;
      })
    // verifyOTPAction
    .addCase(verifyOTPAction.pending, (state) => {
        state.loadingAction = "pending";
        state.message = null;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyOTPAction.fulfilled, (state, action) => {
        state.loadingAction = "success";
        state.message = null;
        state.error = null;
        state.success = true;
      })
      .addCase(verifyOTPAction.rejected, (state, action) => {
        state.loadingAction = "reject";
        state.message = null;
        state.error = null;
        state.success = false; 
      });
  }
})

export default loginSlice.reducer;