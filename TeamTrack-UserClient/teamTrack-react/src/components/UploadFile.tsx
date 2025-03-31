import React, { useState } from "react";
import AWS from "aws-sdk";  // Import AWS SDK

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResponse, setUploadResponse] = useState<string | null>(null);

  // פונקציה שתעדכן את הקובץ שנבחר
  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // פונקציה שתשלח את הקובץ ל-S3
  const fileUploadHandler = async () => {
    if (selectedFile) {
      setUploading(true);

      // הגדרת הקונפיגורציה של AWS SDK
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,  // מפתח גישה
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,  // מפתח סודי
        region: "us-east-1",  // האזור של ה-bucket
      });

      const s3 = new AWS.S3();

      // הגדרת פרמטרים להעלאת הקובץ ל-S3
      const params = {
        Bucket: "your-bucket-name",  // שם ה-bucket שלך ב-S3
        Key: selectedFile.name,  // שם הקובץ
        Body: selectedFile,  // הקובץ עצמו
        ACL: "public-read",  // הגדרת הרשאות
      };

      try {
        // העלאת הקובץ ל-S3
        const data = await s3.upload(params).promise();
        setUploadResponse(`File uploaded successfully: ${data.Location}`);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadResponse("Error uploading file");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <h2>Upload a File to S3</h2>
      <input type="file" onChange={fileSelectedHandler} />
      <button onClick={fileUploadHandler} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadResponse && <p>{uploadResponse}</p>}
    </div>
  );
};

export default UploadFile;
