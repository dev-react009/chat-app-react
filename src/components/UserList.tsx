import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const UserList: React.FC = () => {
  const users = ['Alice', 'Bob', 'Charlie'];

  return (
    <List>
      {users.map((user) => (
        <ListItem button key={user}>
          <ListItemText primary={user} />
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
