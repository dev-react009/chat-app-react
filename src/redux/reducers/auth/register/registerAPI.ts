import { baseURL, endpoints } from "../../../../utils/config";
import { userData } from "../../../../utils/interface";
// import networkCall from "../../../../utils/networkCall";

// url: string,
//   method: "GET" | "POST" | "PUT" | "DELETE",
//   body?: string,
//   headers: HeadersInit = {
//     "Content-Type": "application/json",

export const registerUser = async(userData:userData)=>{
  
    // const response =await networkCall(endpoints.REGISTER,"POST",JSON.stringify(userData));
    const response = await fetch(
      `${baseURL}/${endpoints.REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    return response;
}