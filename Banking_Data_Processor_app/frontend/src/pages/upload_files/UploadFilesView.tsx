import { Box, Button, Typography, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Optional: add icon

interface UploadFilesViewProps {
  file: File | null;
  message: string;
  loading: boolean;
  isError: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}

export default function UploadFilesView({
  file,
  message,
  loading,
  isError,
  onFileChange,
  onUpload,
}: UploadFilesViewProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 120px)" // Better centering accounting for header
    >
      <Paper
        elevation={3} // Slightly softer shadow
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight={600} 
          textAlign="center"
          mb={1}
        >
          Upload Transaction File
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={4}
        >
          Supported formats: CSV, XML
        </Typography>

        <Box
          sx={{
            border: "2px dashed",
            borderColor: file ? "primary.main" : "grey.300", // Change color when file selected
            borderRadius: 2,
            p: 5,
            textAlign: "center",
            mb: 3,
            backgroundColor: file ? "primary.50" : "grey.50",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.light",
              backgroundColor: "grey.100",
            },
          }}
        >
          <input
            type="file"
            accept=".csv,.xml"
            onChange={onFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />

          <label htmlFor="file-upload">
            <Button 
              variant="outlined" 
              component="span"
              size="large"
            >
              Choose File
            </Button>
          </label>

          {file && (
            <Typography 
              variant="body2" 
              mt={2}
              color="text.primary"
            >
              Selected: <strong>{file.name}</strong>
            </Typography>
          )}
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={onUpload}
          disabled={loading || !file}
          size="large"
          sx={{ py: 1.5 }}
        >
          {loading ? "Uploading..." : "Upload File"}
        </Button>

        {message && (
          <Typography
            variant="body2"
            textAlign="center"
            mt={2}
            sx={{
              p: 1.5,
              borderRadius: 1,
              color: isError ? "error.dark" : "success.dark",
              backgroundColor: isError ? "error.50" : "success.50"
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}