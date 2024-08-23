import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import { AddCircleOutline, AddComment, AddIcCallTwoTone } from "@mui/icons-material";

interface NavbarProps {
  onMenuClick: (
    view: "help" | "groups" | "chats" | "settings" | "notifications" | "newChat"
  ) => void;
  onLogout: () => void;
  onCreateNewChat: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  onLogout,
  onCreateNewChat,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (
    view: "help" | "groups" | "chats" | "settings" | "notifications"| "newChat"
  ) => {
    onMenuClick(view);
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      sx={{
        display: isSmallScreen ? "flex" : "none",
        backgroundColor: "#3f51b5",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleMenuItemClick("chats")}>
            <ChatIcon sx={{ mr: 1, color: "#3f51b5" }} /> Chats
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("groups")}>
            <GroupIcon sx={{ mr: 1, color: "#3f51b5" }} /> Groups
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("help")}>
            <HelpIcon sx={{ mr: 1, color: "#3f51b5" }} /> Help
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("settings")}>
            <SettingsIcon sx={{ mr: 1, color: "#3f51b5" }} /> Settings
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("notifications")}>
            <NotificationsIcon sx={{ mr: 1, color: "#3f51b5" }} /> Notifications
          </MenuItem>
          <MenuItem onClick={onCreateNewChat}>
            <AddComment sx={{ mr: 1, color: "#3f51b5" }} /> New Chat
          </MenuItem>
          <MenuItem onClick={onLogout}>
            <LogoutIcon sx={{ mr: 1, color: "#3f51b5" }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
