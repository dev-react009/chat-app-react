import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  Avatar,
  useMediaQuery,
  AppBar,
  Toolbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { ChatType } from "../utils/interface";
import { useTheme } from "@mui/material/styles";
import { MoreVert, Search } from "@mui/icons-material";
import Cookies from "js-cookie";
import { Socket } from "socket.io-client";
import useSocket from "../utils/socket";

interface ChatWindowProps {
  selectedChat: ChatType;
  sendMessage: (chatId: string, message: string) => Promise<void>;
  // socket: Socket | null;
  handleNewMessage: (message: any) => void;
}

const userCookie = Cookies.get("user");
const currentUser = userCookie ? JSON.parse(userCookie) : null;

const ChatWindow: React.FC<ChatWindowProps> = React.memo(
  ({ selectedChat, sendMessage, handleNewMessage }) => {
    const theme = useTheme();
    const socket = useSocket("http://localhost:9200");
    const [newMessage, setNewMessage] = useState("");
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [user, setUser] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (!socket) {
        console.warn("Socket is not initialized");
        return;
      }
        if (selectedChat && selectedChat?.chatRoomId) {
          socket.emit("joinRoom", {chatId:selectedChat?.chatRoomId});
        }

        const handleMessageReceived = (message: any) => {
        handleNewMessage(message);
        scrollToBottom();   
      };
      socket.on("messageReceived", handleMessageReceived);

      return () => {
        // socket.emit("leaveRoom", selectedChat?.chatRoomId);
        socket.off("messageReceived", handleMessageReceived);
      };
    }, [socket, selectedChat, handleNewMessage]);
    
    const handleSendMessage = () => {
      if (selectedChat) {
        sendMessage(selectedChat?.chatRoomId, newMessage);
        setNewMessage("");
        scrollToBottom();
      }
    };

    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    };

    useEffect(() => {
      setUser(currentUser?.userId || null);
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [selectedChat?.conversation]);


    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        {!socket ? (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginTop: "50%" }}
          >
            Initializing connection...
          </Typography>
        ) : (
          <>
            {selectedChat && (
              <AppBar
                position="static"
                color="primary"
                sx={{ mb: 2, backgroundColor: "#1e3a8a", boxShadow: "none" }}
              >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                  <Stack
                    direction={"row"}
                    justifyContent={"start"}
                    alignItems={"center"}
                  >
                    <Avatar
                      src={
                        selectedChat?.receiver?.avatar ||
                        "/path/to/default-avatar.jpg"
                      }
                      alt={selectedChat?.receiver?.username}
                      sx={{ width: 30, height: 30, mr: 2 }}
                    />
                    <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
                      {selectedChat?.receiver?.username || "Chat"}
                    </Typography>
                  </Stack>
                  <Stack direction={"row"}>
                    <IconButton color="inherit">
                      <Search />
                    </IconButton>
                    <IconButton color="inherit">
                      <MoreVert />
                    </IconButton>
                  </Stack>
                </Toolbar>
              </AppBar>
            )}
          </>
        )}

        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            mb: 2,
            overflowY: "auto",
            padding: 2,
            maxHeight: "78vh",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {selectedChat ? (
            <>
              {!selectedChat && (
                <Typography variant="h2" gutterBottom>
                  👋
                </Typography>
              )}

              {selectedChat?.conversation?.map((entry, index) => (
                <Stack
                  key={index + "msg"}
                  direction={"row"}
                  spacing={1}
                  justifyContent={
                    entry.sender === user ? "flex-end" : "flex-start"
                  }
                  alignItems={entry.sender === user ? "flex-end" : "flex-start"}
                  sx={{ mb: 2 }}
                  width={"100%"}
                >
                  {entry.sender !== user && (
                    <Avatar
                      src={entry?.avatar || "/path/to/default-avatar.jpg"}
                      alt={"a"}
                    />
                  )}
                  <Box
                    sx={{
                      padding: 1,
                      margin: 1,
                      borderRadius:
                        entry.sender === user
                          ? "25px 25px 0px 30px"
                          : "0px 25px 25px 25px",
                      minWidth: isSmallScreen
                        ? "30%"
                        : { sm: "30%", md: "40%", lg: "8%" },
                      maxWidth: { xs: "85%", sm: "25%" },
                      display: "flex",
                      fontWeight: "bold",
                      justifyContent:
                        entry.sender !== user ? "flex-start" : "flex-end",
                      alignItems:
                        entry.sender === user ? "flex-start" : "flex-end",
                      backgroundColor:
                        entry.sender === user ? "#1e3a8a" : "#ffffff",
                      color: entry.sender === user ? "#ffffff" : "#000000",
                      position: "relative",
                      wordBreak: "break-word",
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", pl: 1, pr: 1 }}
                    >
                      {entry.content}
                    </Typography>
                  </Box>
                  {entry.sender === user && (
                    <Avatar
                      //avatar
                      src={"/path/to/default-avatar.jpg"}
                      alt={selectedChat.receiver.username}
                    />
                  )}
                </Stack>
              ))}
            </>
          ) : (
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              height={"50vh"}
            >
              <Typography variant="h6" gutterBottom>
                Select a chat to start messaging
              </Typography>
            </Stack>
          )}
        </Box>
        {selectedChat && (
          <Box sx={{ padding: 1, backgroundColor: "#f0f0f0" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: 2,
                zIndex: 2, // Ensure it's above other elements
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton color="default">
                      <EmojiEmotionsIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="default">
                      <AttachFileIcon />
                    </IconButton>
                    <IconButton
                      disabled={newMessage === ""}
                      onClick={handleSendMessage}
                    >
                      <SendIcon
                        sx={{
                          color: newMessage === "" ? "#d3d3d3" : "#1e3a8a",
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </Box>
    );
  }
);

export default ChatWindow;
