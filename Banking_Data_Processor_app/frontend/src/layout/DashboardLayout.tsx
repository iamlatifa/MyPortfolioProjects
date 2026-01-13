import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Box, Toolbar } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          p: 3, // Add padding around the content
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}