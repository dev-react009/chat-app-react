import { baseURL, endpoints } from "../../../../utils/config";
import { userData } from "../../../../utils/interface";


export const loginUser = async(userData:userData)=>{
const response = await fetch(`${baseURL}/${endpoints.LOGIN}`,{
    method: 'POST',
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(userData),
});
return response;
}

export const requestOTP = async(user:{email:string})=>{
    const response = await fetch(`${baseURL}/${endpoints.REQUEST_OTP}`,{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(user)
    }); 
return response;
}

export const resetPasswordWithOTP = async (credentials: {
  otp: string;
  email: string;
  newPassword: string;
}) => {
  const response = await fetch(`${baseURL}/${endpoints.RESET_PASSWORD_WITH_OTP}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response;
};