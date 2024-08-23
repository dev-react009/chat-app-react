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
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Change Password
        </Typography>
        <TextField
          label="Current Password"
          type="password"
          fullWidth
          margin="normal"
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </FormControl>
    </Box>
  );
};

export default Settings;
