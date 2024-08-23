import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { Box, Paper, useMediaQuery, Fab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import GroupsList from "../components/GroupsList";
import ChatsHistory from "../components/ChatsHistory";
import Navbar from "../components/Navbar";
import { ChatType, } from "../utils/interface";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Help from "../components/Help";
import Settings from "../components/Settings";
import { Notifications } from "../components/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";
import useSocket from "../utils/socket";
import Cookies from "js-cookie";
import { getChatsHistoryAction } from "../redux/reducers/chatReducer/createChatRoom";
import useCustomNavigate from "../utils/navigate";
import { ToastSuccess } from "../utils/toastify";
import useAuth from "../utils/useAuth";

const MemoizedSidebar = React.memo(Sidebar);
const MemoizedChatWindow = React.memo(ChatWindow);
const MemoizedGroupsList = React.memo(GroupsList);
const MemoizedChatsHistory = React.memo(ChatsHistory);
const MemoizedNavbar = React.memo(Navbar);
const MemoizedHelp = React.memo(Help);
const MemoizedSettings = React.memo(Settings);
const MemoizedNotifications = React.memo(Notifications);

const userCookie = Cookies.get("user");
const currentUser = userCookie ? JSON.parse(userCookie) : null;

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { loginUser } = useSelector((state: RootState) => state.loginReducer);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
const { navigateTo} = useCustomNavigate(); 
  const [view, setView] = useState<
    "chats" | "groups" | "settings" | "notifications" | "help" | "logout"| "newChat"
  >("chats");
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [isPaperVisible, setIsPaperVisible] = useState(true);
  const [fabOpacity, setFabOpacity] = useState(1);
  const [additionalDrawerOpen, setAdditionalDrawerOpen] = useState(false);
  const socket = useSocket("https://chat-app-express-seven.vercel.app");

  const dispatch = useDispatch<AppDispatch>();

  useAuth();
  const toggleAdditionalDrawer = () => {
    setAdditionalDrawerOpen((prev) => !prev);
  };

  const handleNewMessage = (message: any) => {
    setSelectedChat((prevChat) =>
      prevChat && prevChat.chatRoomId === message.chatRoomId
        ? {
            ...prevChat,
            conversation: [...(prevChat.conversation ?? []), message],
          }
        : prevChat
    );
  }


  const sendMessage = useCallback(
    async (chatId: string, message: string) => {
      if (!selectedChat) return;
      try {
        const response = await fetch(
          `https://chat-app-express-seven.vercel.app/api/chat/${chatId}/message`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({
              content: message,
              receiver: selectedChat?.receiver?.id,
            }),
          }
        );

        const data = await response.json();
        socket?.emit("sendMessage", {
          chatRoomId: chatId,
          content: data?.newMessage?.content,
          senderId: data?.newMessage?.sender,
          receiver: data?.newMessage?.receiver,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [selectedChat, socket]
  );

  const handleViewChange = useCallback(
    (
      newView:
        | "chats"
        | "groups"
        | "settings"
        | "notifications"
        | "help"
        | "logout"
        | "newChat"
    ) => {
      setView(newView);
      setIsPaperVisible(true);
      setFabOpacity(1);
    },
    []
  );

  const togglePaperVisibility = useCallback(() => {
    setIsPaperVisible((prev) => !prev);
    setFabOpacity(1);
  }, []);

  const onSelectChat = useCallback(
    (chat: ChatType) => {
      if (chat?.chatRoomId === selectedChat?.chatRoomId) {
        toast.warning("You are already in Chat Room");
        return;
      }
      setSelectedChat(chat);
    },
    [selectedChat]
  );

  
  const handleSetSelectChatHistory = useCallback((chat: ChatType) => {
    if (chat === null) {
      return;
    } else {
      setSelectedChat(chat);
    }
  },
  []);

  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigateTo("/");
    ToastSuccess("Successfully Logged out")
  },[navigateTo])

  const sidebarProps = useMemo(
    () => ({
      open: !isSmallScreen,
      isSmallScreen,
      viewChange: handleViewChange,
      OnSelectChat: onSelectChat,
      onLogout: handleLogout,
      additionalDrawerOpen,
      toggleAdditionalDrawer: toggleAdditionalDrawer,
    }),
    [
      isSmallScreen,
      handleViewChange,
      onSelectChat,
      handleLogout,
      additionalDrawerOpen,
    ]
  );


  useEffect(() => {
    const fadeInterval = 3000 / ((1 - 0.2) / 0.05);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setFabOpacity((prev) => {
          if (prev <= 0.2) {
            clearInterval(interval);
            return 0.2;
          }
          return prev - 0.05;
        });
      }, fadeInterval);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [isPaperVisible]);


  useEffect(()=>{
      dispatch(getChatsHistoryAction());
  },[dispatch, selectedChat]);

  // useEffect(()=>{

    
  // },[navigateTo])


  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <MemoizedSidebar {...sidebarProps} />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <Box sx={{ flex: 3, display: "flex", position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                zIndex: 99,
                width: "100%",
              }}
            >
              <MemoizedChatWindow
                selectedChat={selectedChat}
                sendMessage={sendMessage}
                socket={socket}
                handleNewMessage={handleNewMessage}
              />
            </Box>
            <Paper
              sx={{
                overflowY: "scroll",
                maxHeight: "100vh",
                transition: "transform 0.5s ease-in-out",
                transform: isPaperVisible
                  ? "translateX(0)"
                  : "translateX(100%)",
                position: "absolute",
                top: 0,
                right: 0,
                width: isSmallScreen ? "100vw" : "35%",
                height: "100%",
                zIndex: 100,
              }}
              elevation={2}
            >
              {view === "groups" && <MemoizedGroupsList />}
              {view === "chats" && (
                <MemoizedChatsHistory
                  onSelectChat={(chat) => handleSetSelectChatHistory(chat)}
                  selectedChat={selectedChat}
                  togglePaperVisibility={togglePaperVisibility}
                />
              )}
              {view === "help" && <MemoizedHelp />}
              {view === "settings" && <MemoizedSettings />}
              {view === "notifications" && <MemoizedNotifications />}
            </Paper>

            {isPaperVisible && (
              <Fab
                onClick={togglePaperVisibility}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 16,
                  transform: "translateY(-50%)",
                  backgroundColor: "#3f51b5",
                  color: "#ffffff",
                  boxShadow: 3,
                  width: "45px",
                  height: "45px",
                  opacity: fabOpacity,
                  transition: "opacity 0.5s ease",
                  "&:hover": {
                    opacity: 0.7,
                    backgroundColor: "#3f51b5",
                    color: "#ffffff",
                  },
                }}
              >
                {isPaperVisible ? <ArrowBackIcon /> : <ArrowForwardIcon />}
              </Fab>
            )}
          </Box>
        </Box>
        {isSmallScreen && (
          <MemoizedNavbar
            onMenuClick={handleViewChange}
            onLogout={handleLogout}
            onCreateNewChat={toggleAdditionalDrawer}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
