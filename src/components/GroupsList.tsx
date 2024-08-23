// src/components/GroupsList.tsx
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { Group as GroupIcon } from "@mui/icons-material"; // Use the Group icon

// Define a type for Group
interface Group {
  id: number;
  name: string;
  icon?: React.ReactNode; // Optional icon property
}

// Dummy data for groups with icons
const dummyGroups: Group[] = [
  { id: 1, name: "Developers", icon: <GroupIcon /> },
  { id: 2, name: "Designers", icon: <GroupIcon /> },
  { id: 3, name: "Marketing", icon: <GroupIcon /> },
  { id: 4, name: "Product", icon: <GroupIcon /> },
  { id: 5, name: "Sales", icon: <GroupIcon /> },
  { id: 6, name: "HR", icon: <GroupIcon /> },
  { id: 7, name: "Finance", icon: <GroupIcon /> },
  { id: 8, name: "Customer Support", icon: <GroupIcon /> },
  { id: 9, name: "IT Support", icon: <GroupIcon /> },
  { id: 10, name: "Legal", icon: <GroupIcon /> },
  { id: 11, name: "Operations", icon: <GroupIcon /> },
  { id: 12, name: "Strategy", icon: <GroupIcon /> },
  { id: 13, name: "Business Development", icon: <GroupIcon /> },
  { id: 14, name: "Quality Assurance", icon: <GroupIcon /> },
  { id: 15, name: "Content Creation", icon: <GroupIcon /> },
  { id: 16, name: "Research & Development", icon: <GroupIcon /> },
  { id: 17, name: "Training", icon: <GroupIcon /> },
  { id: 18, name: "Project Management", icon: <GroupIcon /> },
  { id: 19, name: "Engineering", icon: <GroupIcon /> },
  { id: 20, name: "Administration", icon: <GroupIcon /> },
];

const GroupsList: React.FC = () => {
  return (
    <div>
      <Typography variant="h6" sx={{ padding: 3, textAlign: "left" }}>
        Groups
      </Typography>
      <List>
        {dummyGroups.map((group) => (
          <ListItem
            key={group.id}
            sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
          >
            {group.icon && (
              <ListItemText primary={group.icon} sx={{ mr: 2 }} />
            )}
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
};

export default GroupsList;
