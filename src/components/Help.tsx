import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

const Help: React.FC = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Help & Support
      </Typography>
      <List>
        <ListItem>
          <HelpOutline sx={{ mr: 2 }} />
          <ListItemText
            primary="How to use this application"
            secondary="Learn how to get started and use all features."
          />
        </ListItem>
        <ListItem>
          <HelpOutline sx={{ mr: 2 }} />
          <ListItemText
            primary="FAQ"
            secondary="Find answers to the most common questions."
          />
        </ListItem>
        <ListItem>
          <HelpOutline sx={{ mr: 2 }} />
          <ListItemText
            primary="Contact Support"
            secondary="Get in touch with our support team for assistance."
          />
        </ListItem>
        {/* Add more help items here */}
      </List>
    </Box>
  );
};

export default Help;
