import { AppBar, Toolbar, Typography } from "@mui/material";

// const drawerWidth = 240;

export default function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#1976d2", // or your preferred color
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Banking Data Processor
        </Typography>
      </Toolbar>
    </AppBar>
  );
}