import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Button,
} from "@mui/material";

const Settings: React.FC = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <FormControl component="fieldset" fullWidth>
        <Typography variant="subtitle1">General Settings</Typography>
        <FormControlLabel control={<Switch />} label="Enable Notifications" />
        <FormControlLabel control={<Switch />} label="Dark Mode" />

      </FormControl>
    </Box>
  );
};

export default Settings;
