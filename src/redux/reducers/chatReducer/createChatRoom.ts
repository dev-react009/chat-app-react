import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { chatHistory, chatRoom, friendHistoryResponse } from "../../../utils/interface";
import { createChat, getChatsWithFriend, getRecentChatsHistory } from "./chatApi";
import {consoleError,log} from "../../../utils/logger"
export const getChatsHistory:chatHistory={
    loading:"initial",
  status: false,
  statusCode:null,
  message: null,
  error:null,
  chats:[{
        id:" -1",
        participants: [{
          _id: "-1",
          username: "",
          email: "sg",
        }],
        messages:[ {
          _id: "string",
          chatId: "string",
          sender: "string",
          receiver: "string",
          content: "string",
          timestamp: "string",
        }]
      }]
}



interface chatReducer {
  createChatRoom: chatRoom;
  getRecentChats: chatHistory;
  getFriendChatHistory: friendHistoryResponse;
}

const initialState: chatReducer = {
  createChatRoom: {
    status: false,
    statusCode: null,
    message: null,
    chatRoomId: null,
    participants: null,
  },
  getRecentChats: getChatsHistory,
  getFriendChatHistory: {
    loading:"initial",
    status: false,
    statusCode: null,
    message:null,
    error:null
  },
};


export const createChatRoomAction =createAsyncThunk(
    "chat/createChatRoom",
    async(friendId:string, {rejectWithValue})=>{
        try{
            const response = await createChat(friendId);
            const jsonResponse =await response.json();
            log(jsonResponse);
            return jsonResponse;
        }
        catch(error:any){
            consoleError(error.message);
        }
    }
);
export const getChatsHistoryAction = createAsyncThunk("chat/chatsHistory",
  async(_,{rejectWithValue})=>{
    try{
      const response = await getRecentChatsHistory();
      const jsonResponse = await response.json();
      return jsonResponse;
    }catch(error:any){
      error("error",rejectWithValue(error.message));
    }
  }
)

export const getFriendChatsAction = createAsyncThunk("chat/friendChats",
  async(friendId: string, { rejectWithValue,fulfillWithValue }) => {
    try{
      const response = await getChatsWithFriend(friendId);
      const jsonResponse = await response.json();
      return fulfillWithValue(jsonResponse);
    }catch(error:any){
      error("error", rejectWithValue(error.message));
      return rejectWithValue(error.message);
    }
  }
)

// export const sendMessageAction = createAsyncThunk("chat/sendMessage",
//   async({},{rejectWithValue})=>{
    
//   }
// )

export const chatRoomReducer = createSlice({
  name: "createChatRoom",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createChatRoomAction.pending, (state) => {
      state.createChatRoom.status = false;
      state.createChatRoom.statusCode = null;
      state.createChatRoom.message = null;
      state.createChatRoom.chatRoomId = null;
      state.createChatRoom.participants = null;
    });
    builder.addCase(createChatRoomAction.fulfilled, (state, action) => {
      state.createChatRoom.status = action.payload;
    });
    builder.addCase(createChatRoomAction.rejected, (state) => {
      state.createChatRoom.status = false;
      state.createChatRoom.statusCode = null;
      state.createChatRoom.message = null;
      state.createChatRoom.chatRoomId = null;
      state.createChatRoom.participants = null;
    });

    // getChatsHistory
    builder.addCase(getChatsHistoryAction.pending, (state) => {
      state.getRecentChats!.loading = "pending";
      state.getRecentChats!.error = null;
      state.getRecentChats!.status = false;
    });
    builder.addCase(getChatsHistoryAction.fulfilled, (state, action) => {
      state.getRecentChats!.loading = "success";
      state.getRecentChats!.status = true;
      state.getRecentChats!.chats = action?.payload?.chats;
    });
    builder.addCase(getChatsHistoryAction.rejected, (state) => {
      state.getRecentChats!.loading = "rejected";
    });
    //getFriendChatsAction
     builder.addCase(getFriendChatsAction.pending, (state) => {
       state.getRecentChats!.loading = "pending";
       state.getRecentChats!.error = null;
       state.getRecentChats!.status = false;
     });
     builder.addCase(getFriendChatsAction.fulfilled, (state, action) => {
       state.getRecentChats!.loading = "success";
       state.getRecentChats!.status = true;
       state.getRecentChats!.chats = action?.payload?.chats;
     });
     builder.addCase(getFriendChatsAction.rejected, (state) => {
       state.getRecentChats!.loading = "rejected";
     });
  },
});


export default chatRoomReducer.reducer;