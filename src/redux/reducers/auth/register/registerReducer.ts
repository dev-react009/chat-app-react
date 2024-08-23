import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { authState, userData } from "../../../../utils/interface";
import { registerUser } from "./registerAPI";
// import { endpoints } from "../../utils/";



const initialState: authState = {
  loading: "initial",
  error: null,
  success: false,
  message: null,
};
export const registerAction = createAsyncThunk(
  "register/registerUser",
  async (userData:userData, { rejectWithValue }) => {
    try {
      
      const response = await registerUser(userData);
        const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      return rejectWithValue("Registration failed");
    }
  }
);

const registerSlice = createSlice({
  name:'register',
  initialState,
  reducers: {},
  extraReducers:builder=>{
    builder
    .addCase(registerAction.pending,(state)=>{
      state.loading = "pending";
      state.message=null;
      state.error=null;
      state.success=false;
    })
    .addCase(registerAction.fulfilled,(state,action)=>{
     
      state.loading="success";
      state.message=action.payload?.message;
      state.error=null;
      state.success=true;
    })
    .addCase(registerAction.rejected,(state)=>{
      state.loading="reject";
      state.message=null;
      state.error= null;
      state.success=false;
    })
  },
});





export default registerSlice.reducer ;

