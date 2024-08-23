import React from "react";
import { Box, Typography } from "@mui/material";

export const Notifications: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Notifications</Typography>
      <Typography>This is the notifications page.</Typography>
    </Box>
  );
};

export const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Settings</Typography>
      <Typography>This is the settings page.</Typography>
    </Box>
  );
};

export const Help: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Help</Typography>
      <Typography>This is the help page.</Typography>
    </Box>
  );
};
