// export const baseURL = "https://chat-app-express-tyat.onrender.com/api";
export const baseURL = "http://localhost:9200/api"
export const endpoints = {
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  REQUEST_OTP: "auth/requestOtp",
  RESET_PASSWORD_WITH_OTP: "auth/resetPasswordWithOtp",
  ADD_NEW_FRIEND: "auth/addFriend",
  SEARCH_USER: "auth/search-user",
  GET_FRIENDS_LIST: "auth/getFriendsList",
  CREATE_CHAT_ROOM: "chat/createChatRoom",
  GET_CHATS_HISTORY: "chat/getRecentChatsHistory",
  GET_CHATS_WITH_FRIEND: "chat/getChatsWithFriend",
};
