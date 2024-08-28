import React, { ChangeEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Stack,
  IconButton,
  Box,
  InputBase,
  Avatar,
} from "@mui/material";
import {
  Chat,
  Group,
  Settings,
  Notifications,
  Help,
  Logout,
  ArrowBack,
  Search,
  AccountCircle,

} from "@mui/icons-material";
import LogoutDialog from "./LogoutDialog";
import { AppDispatch} from "../redux/store";
import { useDispatch} from "react-redux";
import { ChatType, friendsList, searchResults } from "../utils/interface";
import Cookies from "js-cookie";
import { baseURL, endpoints } from "../utils/config";
import { createChatRoomAction } from "../redux/reducers/chatReducer/createChatRoom";
import { ToastError} from "../utils/toastify";
import useSocket from "../utils/socket";
import { log } from "../utils/logger";

interface SidebarProps {
  open: boolean;
  isSmallScreen: boolean;
  additionalDrawerOpen:boolean;
  OnSelectChat: (Chat: ChatType) => void;
  toggleAdditionalDrawer:()=> void;
  onLogout: () => void;

  viewChange: (
    newView:
      | "chats"
      | "groups"
      | "settings"
      | "notifications"
      | "help"
      | "logout"
      | "newChat"
  ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  isSmallScreen,
  additionalDrawerOpen,
  toggleAdditionalDrawer,
  viewChange,
  OnSelectChat,
  onLogout,
}) => {
  const userCookie = Cookies.get("user");
  const userData = userCookie ? JSON.parse(userCookie) : null;
  const [activeItem, setActiveItem] = useState<
    "chats" | "groups" | "settings" | "notifications" | "help" | "logout" |"newChat"| null
  >(null);
  const dispatch = useDispatch<AppDispatch>();
  // const socket = useSocket("https://chat-app-express-seven.vercel.app");
  // const socket = useSocket("http://localhost:9200");
  const socket = useSocket("https://chat-app-express-tyat.onrender.com");


  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<searchResults>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("No Data Found");
  const [friendsList, setFriendsList] = useState<friendsList>([]);
  const handleItemClick = (
    view: "chats" | "groups" | "settings" | "notifications" | "help" | "logout" |"newChat"
  ) => {
    setActiveItem(view);
    switch (view) {
      case "logout":
        handleLogout();
        break;
      case "chats":
      case "groups":
      case "settings":
      case "notifications":
      case "newChat":
      case "help":
        viewChange(view);
        break;
      default:
        return;
    }
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    onLogout();
  };

  
  const toggleProfileDrawer = () => {
    setProfileDrawerOpen((prev) => !prev);
  };

  const handleSearchFriend = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleStartChat = async (friendId: string) => {
    const response = await dispatch(createChatRoomAction(friendId));
    const fulfilled = response.payload;
    if (fulfilled.status === true) {
      const chat = {
        conversation: fulfilled.conservation,
        chatRoomId: fulfilled.chatRoomId,
        receiver: fulfilled.receiver,
      };

      log("Connected to the server1");
      socket?.emit("joinRoom", { chatId: fulfilled?.chatRoomId });
      OnSelectChat(chat);
    } else {
      ToastError(fulfilled.message);
    }
  };

  const onAddFriend = (friendId: string) => {
    // Add friend logic here
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        setLoading(true);
        fetch(`${baseURL}/${endpoints.SEARCH_USER}?query=${searchTerm}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.statusCode === 200) {
              setSearchResults(data.users);
            }
            if (data.statusCode === 404) {
              setSearchResults([]);
              setMessage(data.message);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching search results:", error.message);
            setMessage(error.message);
            setLoading(false);
          });
      } else {
        setSearchResults([]);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn); 
   }, [socket, searchTerm]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getAllFriendsList();
        const data = await response.json();
        if (data.status === true) {
          setFriendsList(data.allFriends);
          setMessage("");
        }
        if (data.statusCode === 404) {
          setFriendsList([]);
          setMessage(data.error);
        } else {
          setFriendsList([]);
          setMessage(data.error || data.message);
        }
      } catch (error) {
        console.error("Error fetching friends list:", error);
      }
    };
    fetchFriends();
  }, []);
  
  const getAllFriendsList = async () => {
    const response = await fetch(
      `${baseURL}/${endpoints.GET_FRIENDS_LIST}?userId=${userData?.userId!}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
    }
    );
    return response;
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? 300 : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            position: "fixed",
            width: open ? 300 : 0,
            boxSizing: "border-box",
            backgroundColor: "#3f51b5",
            color: "#fff",
            transition: "width 0.3s",
            zIndex: 100,
          },
        }}
      >
        {open && !isSmallScreen && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ padding: 2, textAlign: "left" }}>
              Chats
            </Typography>
            <IconButton color="inherit" onClick={toggleAdditionalDrawer}>
              <Chat/>
            </IconButton>
          </Stack>
        )}
        <List>
          <ListItem
            button
            onClick={() => handleItemClick("chats")}
            sx={
              activeItem === "chats" ? styles.activeListItem : styles.listItem
            }
          >
            <Chat sx={styles.listItemText} />
            {open && (
              <ListItemText
                id="listItemText"
                primary="Chats"
                sx={styles.listItemText}
              />
            )}
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("groups")}
            sx={
              activeItem === "groups" ? styles.activeListItem : styles.listItem
            }
          >
            <Group sx={styles.listItemText} />
            {open && (
              <ListItemText
                id="listItemText"
                primary="Groups"
                sx={styles.listItemText}
              />
            )}
          </ListItem>
          <Divider sx={{ borderColor: "#fff" }} />
          <ListItem
            button
            onClick={() => handleItemClick("settings")}
            sx={
              activeItem === "settings"
                ? styles.activeListItem
                : styles.listItem
            }
          >
            <Settings sx={styles.listItemText} />
            {open && (
              <ListItemText
                id="listItemText"
                primary="Settings"
                sx={styles.listItemText}
              />
            )}
          </ListItem>
          <ListItem
            onClick={() => handleItemClick("notifications")}
            sx={
              activeItem === "notifications"
                ? styles.activeListItem
                : styles.listItem
            }
          >
            <Notifications sx={styles.listItemText} />
            {open && (
              <ListItemText
                id="listItemText"
                primary="Notifications"
                sx={styles.listItemText}
              />
            )}
          </ListItem>
          <ListItem
            onClick={() => handleItemClick("help")}
            sx={activeItem === "help" ? styles.activeListItem : styles.listItem}
          >
            <Help sx={styles.listItemText} />
            {open && (
              <ListItemText
                id="listItemText"
                primary="Help"
                sx={styles.listItemText}
              />
            )}
          </ListItem>
          <Divider sx={styles.listItemText} />
          <ListItem
            button
            onClick={() => handleItemClick("logout")}
            sx={
              activeItem === "logout" ? styles.activeListItem : styles.listItem
            }
          >
            <Logout sx={styles.listItemText} />
            {open && (
              <ListItemText
                id="listItemText"
                primary="Logout"
                sx={styles.listItemText}
              />
            )}
          </ListItem>
        </List>
        <IconButton
          color="inherit"
          sx={{
            position: "absolute",
            bottom: 16,
            left: "12%",
            transform: "translateX(-50%)",
          }}
          onClick={toggleProfileDrawer}
        >
          <AccountCircle sx={{ fontSize: 40 }} />
        </IconButton>
      </Drawer>

      {/* Additional Drawer */}
      <Drawer
        anchor="left"
        open={additionalDrawerOpen}
        onClose={toggleAdditionalDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            backgroundColor: "#303f9f",
            color: "#fff",
            zIndex: 110,
          },
        }}
      >
        <Stack direction={"row"} justifyContent={"start"}>
          <IconButton
            onClick={toggleAdditionalDrawer}
            sx={{ padding: 2, color: "#fff" }}
          >
            <ArrowBack sx={{ ml: 1 }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", fontSize: "17px" }}
          >
            New Chat
          </Typography>
        </Stack>
        <Divider sx={{ borderColor: "#fff" }} />
        <Divider sx={{ borderColor: "#fff" }} />
        <Box
          sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}
        >
          <Search sx={{ color: "#fff", mr: 1 }} />
          <InputBase
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => handleSearchFriend(event)}
            sx={{
              color: "#fff",
              backgroundColor: "#424f99",
              borderRadius: 1,
              padding: "0 8px",
              width: "100%",
            }}
          />
        </Box>
        <List>
          {loading ? (
            <ListItem sx={{ justifyContent: "center" }}>
              <Typography>Loading...</Typography>
            </ListItem>
          ) : searchResults?.length > 0 ? (
            searchResults.map((item) => (
              <ListItem
                key={item.userId}
                disableGutters
                sx={styles.list_Item}
                onClick={() => handleStartChat(item.userId)}
              >
                <Avatar
                  sx={styles.avatar}
                  src={"/path/to/profile-pic.jpg"}
                  alt={item.username}
                />
                <ListItemText
                  primary={item.username}
                  sx={styles.list_Item_Text}
                />
              </ListItem>
            ))
          ) : friendsList?.length > 0 ? (
            <>
              <ListItem sx={{ justifyContent: "center" }}>
                <Typography>{message || "No mutual friends found."}</Typography>
              </ListItem>
              {friendsList.map((friend) => (
                <ListItem
                  key={friend.userId}
                  disableGutters
                  sx={styles.list_Item}
                >
                  <Avatar
                    sx={styles.avatar}
                    src={"/path/to/profile-pic.jpg"}
                    alt={friend.username}
                  />
                  <ListItemText
                    primary={friend.username}
                    sx={styles.list_Item_Text}
                  />
                </ListItem>
              ))}
            </>
          ) : (
            <ListItem sx={{ justifyContent: "center" }}>
              <Typography>{message}</Typography>
            </ListItem>
          )}
        </List>
      </Drawer>
      {/* Profile Drawer */}
      <Drawer
        anchor="left"
        open={profileDrawerOpen}
        onClose={toggleProfileDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            backgroundColor: "#303f9f",
            color: "#fff",
            zIndex: 110,
          },
        }}
      >
        <Stack direction={"row"} justifyContent={"start"}>
          <IconButton
            onClick={toggleProfileDrawer}
            sx={{ padding: 2, color: "#fff" }}
          >
            <ArrowBack sx={{ ml: 1 }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", fontSize: "17px" }}
          >
            Profile
          </Typography>
        </Stack>
        <Divider sx={{ borderColor: "#fff" }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{ width: 80, height: 80, marginBottom: 2 }}
            src="/path/to/profile-pic.jpg" // Replace with your profile image source
          />
          <Typography variant="h6">{userData?.username}</Typography>
          <Typography variant="body2">{userData?.email}</Typography>
        </Box>
        <Divider sx={{ borderColor: "#fff" }} />
        <List>
          <ListItem>
            <ListItemText
              primary="About"
              secondary="This is the about section."
            />
          </ListItem>
        </List>
      </Drawer>

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default Sidebar;

const styles = {
  listItem: {
    mt: 1,
    "&:hover": { backgroundColor: "#162349" },
  },
  activeListItem: {
    mt: 1,
    backgroundColor: "#1e3a8a",
    "&:hover": { backgroundColor: "#1e3a8a", "#listItemText": {} },
  },
  listItemText: { color: "#ffffff" },
  list_Item: {
    display: "flex",
    alignItems: "center",
    marginBottom: 1,
    "&:hover": {
      backgroundColor: "#1e3a8a",
      cursor: "pointer",
    },
  },
  avatar: {
    marginRight: 2,
  },
  list_Item_Text: {
    color: "#efecec",
  },
  username: {
    fontWeight: "bold", // Make username bold
  },
  iconButton: {
    color: "#3f51b5", // Icon color
  },
};
