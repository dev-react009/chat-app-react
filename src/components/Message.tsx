import React from 'react';
import { Box, Typography } from '@mui/material';

interface MessageProps {
  sender: string;
  text: string;
}

const Message: React.FC<MessageProps> = ({ sender, text }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="textSecondary">
        {sender}
      </Typography>
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
};

export default Message;
