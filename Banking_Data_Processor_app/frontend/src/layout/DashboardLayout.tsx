import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Box, Toolbar } from "@mui/material";
import { main } from "@popperjs/core";

type Props = {
    children: React.ReactNode
}
export default function DashboardLayout({ children }: Props) {
    return (
        <Box sx={{ Display: "flex" }}>
            <Header />
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: "#f5f5f5",
                    minHeight: "100vh",
                }}

            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}