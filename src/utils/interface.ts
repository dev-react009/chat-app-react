export interface IFormData {
  username: string;
  email: string;
  password: string;
  mobile:string;
}

export const initialValues: IFormData = {
  username: "",
  email: "",
  password: "",
  mobile:""
};

export type ChatType = {
  conversation: {
    messageId: string;
    receiver: string;
    sender: string;
    timestamp: string;
    content: string;
    avatar?:string;
  }[];
  chatRoomId: string;
  receiver: {
    id: string;
    username: string;
    email: string;
    avatar?:string;
  };
} | null;

export type Chat = {
  id: number;
  username: string;
  lastMessage: string;
  history: { message: string; sender: string }[];
} | null;



export interface userData {
  username?: string;
  email: string;
  password: string;
  mobile?: string;
}

export interface authState{
  message: null,
  loading: "initial"|"pending"|"success"|"reject",
  success: boolean,
  error:null,

}

export interface loginState {
  message: null;
  loadingAction: "initial" | "pending" | "success" | "reject";
  success: boolean;
  error: null;
  loginUser?: {
    userId: string | null;
    email: string | null;
    username: string | null;
  } | null;
}

export interface IErrors{
username:string;
email:string;
password:string;
mobile:string
};

export const values:IErrors={
username:"",
email:"",
password:"",
mobile:""
}

export type searchResults={
  id:string,
  userId: string;
  username: string;
  email:string
}[];

export type friendsList ={
userId:string;
username:string;
email:string;
}[];

export type chatRoom = {
status:boolean;
statusCode:number | null;
message:string |null;
chatRoomId:string|null;
participants:string[] | null;
};

export type chatHistory = {
  loading: "initial" | "success" | "rejected" | "pending";
  status: boolean;
  statusCode: number | null;
  message: string | null;
  error: string | null;
  chats: {
    id: string;
    participants: Participant[];
    messages: Message[];
  }[] | null;
} | null;


export type getHistory =
  | {
      id: string;
      participants: Participant[];
      messages: {
        chatRoomId: string;
        content: string;
        receiver: string;
        sender: string;
        timestamp: string;
      }[];
    }[]
  | null;

interface Message {
  _id: string;
  chatId: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

interface Participant {
  _id: string;
  username: string;
  email: string;
}


export interface selectedChat {
  id: string;
  participants: Participant[];
  messages: Message[];
}


export interface ChatResponse {
  status: boolean;
  statusCode: number;
  chatRoom: ChatRoomDetails;
}

interface ChatRoomDetails {
  participants: string[];
  messages: ChatMessage[];
}

interface ChatMessage {
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  id: string;
  messageId: string;
  chatRoomId?: string; // Optional property since it's not present in all messages
}


export type  friendHistoryResponse = {
loading:"initial"|"pending"|"fulfill"|"reject";
status:boolean;
statusCode:number | null;
message:string| null;
error:string| null
}



