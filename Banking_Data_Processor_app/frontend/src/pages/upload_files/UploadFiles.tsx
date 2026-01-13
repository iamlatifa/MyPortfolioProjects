import { useState } from "react";
import UploadFilesView from "./UploadFilesView";

export default function UploadFiles() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      setIsError(false)
      const data = await response.json();
      setMessage(data.message || "File uploaded successfully.");
    } catch (error){
      setIsError(true)
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UploadFilesView
      file={file}
      message={message}
      loading={loading}
      onFileChange={handleFileChange}
      onUpload={handleUpload}
    />
  );
}
