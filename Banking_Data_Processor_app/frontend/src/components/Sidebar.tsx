import {
  Drawer,List,ListItemButton,ListItemIcon,ListItemText,Toolbar
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ErrorIcon from "@mui/icons-material/Error";
import { Link } from "react-router";
const drawerWidth = 240;

export default function Sidebar() {

    return (
        <Drawer 
            variant="permanent"
            sx={{
                width: drawerWidth,
                // flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <List>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton component={Link} to="/upload">
                    <ListItemIcon>
                        <UploadFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Upload Data" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText primary="Error Logs" />
                </ListItemButton>
            </List>
        </Drawer>
    )

}