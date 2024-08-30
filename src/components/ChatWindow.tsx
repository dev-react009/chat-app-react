import React, { useEffect, useState, useRef, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { ChatType } from "../utils/interface";
import { useTheme } from "@mui/material/styles";
import { AddComment,  MoreVert, Search } from "@mui/icons-material";
import Cookies from "js-cookie";
import useSocket from "../utils/socket";
import { formatTimestamp } from "../utils/timeStamp";
// import { Picker } from 'emoji-mart';
// import 'emoji-mart/react/css/emoji-mart.css';
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface ChatWindowProps {
  selectedChat: ChatType;
  loading:boolean;
  sendMessage: (chatId: string, message: string) => Promise<void>;
  onCreateNewChat: () => void;
  handleNewMessage: (message: any) => void;
}

type Emoji = {
  native: string;
};

const userCookie = Cookies.get("user");
const currentUser = userCookie ? JSON.parse(userCookie) : null;
const ChatWindow: React.FC<ChatWindowProps> = React.memo(
  ({
    selectedChat,
    sendMessage,
    handleNewMessage,
    onCreateNewChat,
    loading,
  }) => {
    const theme = useTheme();
    // const socket = useSocket("http://localhost:9200");
    const socket = useSocket("https://chat-app-express-tyat.onrender.com");
    const [newMessage, setNewMessage] = useState("");
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [user, setUser] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState<Boolean>(false);



    const toggleEmojiPicker = useCallback(() => {
      setShowEmojiPicker(!showEmojiPicker);
    },[showEmojiPicker])

    const handleEmojiSelect = useCallback((emoji: Emoji) => {
      setNewMessage((prevMessage) => prevMessage + emoji.native);
    },[]);

    useEffect(() => {
      if (!socket) {
        console.warn("Socket is not initialized");
        return;
      }
      if (selectedChat && selectedChat?.chatRoomId) {
        socket.emit("joinRoom", { chatId: selectedChat?.chatRoomId });
      }

      const handleMessageReceived = (message: any) => {
        handleNewMessage(message);
        scrollToBottom();
      };
      socket.on("messageReceived", handleMessageReceived);

      return () => {
        socket.emit("leaveRoom", selectedChat?.chatRoomId);
        socket.off("messageReceived", handleMessageReceived);
      };
    }, [socket, selectedChat, handleNewMessage]);

    const handleSendMessage = () => {
      if (selectedChat) {
        sendMessage(selectedChat?.chatRoomId, newMessage);
        setNewMessage("");
        setShowEmojiPicker(false);
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
                    entry.sender === currentUser?.userId
                      ? "flex-end"
                      : "flex-start"
                  }
                  alignItems={"flex-start"}
                  sx={{ mb: 2 }}
                  width={"100%"}
                >
                  {entry.sender !== currentUser?.userId && (
                    <Avatar
                      src={entry?.avatar || "/path/to/default-avatar.jpg"}
                      alt={selectedChat?.receiver?.username}
                    />
                  )}

                  <Box
                    sx={{
                      textAlign: "left",
                      borderRadius:
                        entry.sender === currentUser?.userId
                          ? "10px 0px 10px 10px"
                          : "0px 10px 10px 10px",
                      minWidth: isSmallScreen
                        ? "30%"
                        : { sm: "30%", md: "40%", lg: "8%" },
                      maxWidth: { xs: "85%", sm: "20%", md: "20%" },
                      display: "flex",
                      fontWeight: "bold",
                      justifyContent: "flex-start",
                      alignItems:
                        entry.sender === currentUser?.userId
                          ? "flex-start"
                          : "flex-start",
                      backgroundColor:
                        entry.sender === currentUser?.userId
                          ? "#1e3a8a"
                          : "#ffffff",
                      color:
                        entry.sender === currentUser?.userId
                          ? "#ffffff"
                          : "#000000",
                      position: "relative",
                      wordBreak: "break-word",
                      boxShadow: 5,
                      p: 0.2,
                    }}
                  >
                    <Stack direction={"column"} width={"100%"}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "13px",
                          pl: 1,
                          pr: 1,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {entry.content}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "inherit",
                          fontSize: "10px",
                          display: "flex",
                          alignSelf: "end",
                          pr: 1,
                        }}
                      >
                        {formatTimestamp(entry.timestamp)}
                      </Typography>
                    </Stack>
                  </Box>
                  {entry.sender === currentUser?.userId && (
                    <Avatar
                      //avatar
                      src={"/path/to/default-avatar.jpg"}
                      alt={currentUser?.username}
                    />
                  )}
                </Stack>
              ))}
            </>
          ) : (
            <Stack
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              width={"100%"}
              height={"70vh"}
            >
              <Typography variant="h6" gutterBottom color={"#2f2f2f"}>
                Hello,
                <Box component={"span"} color={"#1e3a8a"} fontWeight={"bold"}>
                  {`${currentUser?.username}!`} <Box component={"br"} />
                </Box>
                Chat Cloud is ready for you! <Box component={"br"} />
                Select a friend and spark up a chat! 🔥
              </Typography>
              {isSmallScreen && (
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  mt={5}
                  onClick={onCreateNewChat}
                >
                  <AddComment sx={{ fontSize: "50px", color: "#1e3a8a" }} />
                </Box>
              )}
            </Stack>
          )}
        </Box>
        {showEmojiPicker && (
          <Box sx={styles.pickerContainer}>
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              className="custom-emoji-picker"
            />
          </Box>
        )}
        {selectedChat && (
          <Box
            component={"form"}
            sx={{ padding: 1, backgroundColor: "#f0f0f0" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              multiline
              minRows={1}
              maxRows={3}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: 2,
                borderColor: "#1e3a8a",
                zIndex: 2,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton color="default" onClick={toggleEmojiPicker}>
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
                      {loading ? (
                        <CircularProgress size={"30px"} />
                      ) : (
                        <SendIcon
                          sx={{
                            color: newMessage === "" ? "#d3d3d3" : "#1e3a8a",
                          }}
                        />
                      )}
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


const styles = {
  pickerContainer: {
    position: 'absolute',
    bottom: '70px',
    right: '20px',
    zIndex: 1000,
  },
}