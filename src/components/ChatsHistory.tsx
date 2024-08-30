import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  InputBase,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Chat as ChatIcon, Search } from "@mui/icons-material";
import { ChatType } from "../utils/interface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getFriendChatsAction } from "../redux/reducers/chatReducer/createChatRoom";
import { log } from "../utils/logger";
import { formatTimestamp } from "../utils/timeStamp";

interface ChatsHistoryProps {
  onSelectChat: (chat: ChatType) => void;
  selectedChat: ChatType;
  togglePaperVisibility:()=> void
}

const ChatsHistory: React.FC<ChatsHistoryProps> = ({
  onSelectChat,
  selectedChat,
  togglePaperVisibility
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getRecentChats } = useSelector(
    (state: RootState) => state.chatRoomReducer
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(getRecentChats?.chats);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredChats(getRecentChats?.chats);
    } else {
      const filtered = getRecentChats?.chats?.filter((chat) =>
        chat.participants.some((participant) =>
          participant.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredChats(filtered);
    }
  }, [searchTerm, getRecentChats?.chats]);

  const handleStartChat = useCallback(
  async (friendId: string) => {

    setActiveChatId(friendId);
    const response = await dispatch(getFriendChatsAction(friendId));
    const fulfilled = response.payload;
    log("select",filteredChats);
    if (fulfilled.status === true) {
      const chat = {
        conversation:fulfilled.conversation,
        chatRoomId:fulfilled.chatRoomId,
        receiver:fulfilled.receiver
      }
      onSelectChat(chat);
      setTimeout(()=>{togglePaperVisibility()},1500);
    }
  },[dispatch,filteredChats, onSelectChat,togglePaperVisibility])
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  console.log(getRecentChats);


  return (
    <Box sx={{ padding: 2, transition: "all 1s ease-in-out", flexGrow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Chats History
      </Typography>-
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
        }}
      >
        <InputBase
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ ml: 1, flex: 1 }}
        />
        <IconButton type="submit" sx={{ p: "10px" }}>
          <Search />
        </IconButton>
      </Box>
      {getRecentChats?.loading === "pending" ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {filteredChats?.length === 0 ? (
            <Typography color={"#ccc"}>No chats found...</Typography>
          ) : (
            filteredChats?.map((chat) => (
              <ListItem
                key={chat?.messages[0]?._id}
                sx={{
                  fontSize: "12px",
                  mt: 2,
                  width: "100%",
                  cursor: "pointer",
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: 5,
                  backgroundColor:
                    chat?.messages[0]?._id === activeChatId
                      ? "#e0f7fa"
                      : "inherit",
                  "&:hover": { backgroundColor: "#efefef" },
                  "&:nth-of-type(even)": {
                    backgroundColor:
                      chat?.messages[0]?._id === activeChatId
                        ? "#c4c5c5"
                        : "#f5f5f5",
                  },
                }}
                onClick={() =>
                  handleStartChat(chat?.participants[0]?._id)
                }
              >
                <ChatIcon sx={{ color: "#3f51b5", mr: 2 }} />
                <ListItemText
                  primary={
                    <Tooltip
                      title={
                        chat?.participants[0]?.username.length > 45 &&
                        chat?.participants[0]?.username
                      }
                      arrow
                    >
                      <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography
                          variant="body1"
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {chat?.participants[0]?.username}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "block", mt: 1 }}
                        >
                          {formatTimestamp(chat?.messages[0]?.timestamp)}
                        </Typography>
                      </Stack>
                    </Tooltip>
                  }
                  secondary={
                    <Tooltip
                      title={
                        chat?.messages[0]?.content.length > 45 &&
                        chat?.messages[0]?.content
                      }
                      arrow
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        noWrap
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {chat?.messages[0]?.content}
                      </Typography>
                    </Tooltip>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      )}
    </Box>
  );
};

export default ChatsHistory;
