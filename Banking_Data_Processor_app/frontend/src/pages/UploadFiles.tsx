import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";


export default function UploadFiles() {

    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch("http://localhost:8000/api/upload/", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
                setMessage(data.message || "File uploaded successfully.");

        } catch (error) {
            setMessage("uploading failed.");
        }
    };
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
            Upload transaction Files
            </Typography>
        <input type="file" accept=".cvs , .xml" value="" onChange={handleFileChange}/>
            <Box>
            <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }}>
                Upload
            </Button>
            </Box>
            {message && (<Typography variant="body1" sx={{ mt: 2 }}>
                {message}
            </Typography>
            )}
        </Box>
    )
}