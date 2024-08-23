import { baseURL, endpoints } from "../../../utils/config"
import Cookies from "js-cookie";

export const createChat =async(friendId:string)=>{
    const response = await fetch(`${baseURL}/${endpoints.CREATE_CHAT_ROOM}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ friendId: friendId }),
    });
return response;
} 

export const getRecentChatsHistory = async ()=>{
  const response = await fetch(`${baseURL}/${endpoints.GET_CHATS_HISTORY}`,{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${Cookies.get("token")}`
    }
  });

  return response;
}

export const getChatsWithFriend = async(friendId:string)=>{
  const response = await fetch(
    `${baseURL}/${endpoints.GET_CHATS_WITH_FRIEND}/${friendId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    }
  );

  return response;
}