import React, { useState, useRef } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GroupsIcon from "@mui/icons-material/Groups";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<{
    message: string;
    success: boolean;
    fileUrl?: string;
    s3Key?: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.name.toLowerCase().endsWith(".txt")) {
        setUploadResponse({
          message: "ניתן להעלות רק קבצי טקסט מסוג .txt בלבד.",
          success: false,
        });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadResponse(null);
      setUploadProgress(0);
    }
  };

  const fileUploadHandler = () => {
    if (!selectedFile) return;

    if (!apiUrl) {
      setUploadResponse({
        message: "שגיאה: כתובת השרת לא מוגדרת.",
        success: false,
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadResponse(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      xhrRef.current = null;

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setUploadResponse({
            message: "הקובץ הועלה בהצלחה!",
            success: true,
            fileUrl: data.fileUrl,
            s3Key: data.s3Key,
          });

          if (data.s3Key) {
            localStorage.setItem("s3Key", data.s3Key);
          }
        } catch {
          setUploadResponse({
            message: "העלאה הצליחה אך לא ניתן לקבל קישור לקובץ.",
            success: true,
          });
        }
      } else if (xhr.status === 401) {
        localStorage.removeItem("tt_token"); // שים לב לשם החדש
        navigate("/login");
      } else {
        setUploadResponse({
          message: `שגיאה בהעלאה: ${xhr.statusText || xhr.status}`,
          success: false,
        });
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      xhrRef.current = null;
      setUploadResponse({
        message: "שגיאה ברשת בהעלאת הקובץ.",
        success: false,
      });
    };

    xhr.open("POST", `${apiUrl}/api/fileupload/upload`);

    const token = localStorage.getItem("tt_token"); // כאן משתמש ב-tt_token
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.send(formData);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // העתקת הקישור ללוח
  const handleCopyLink = () => {
    if (uploadResponse?.fileUrl) {
      navigator.clipboard.writeText(uploadResponse.fileUrl);
      setCopySuccess(true);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GroupsIcon sx={{ mr: 1, color: "#3f51b5" }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TeamTrack
              </Typography>
            </Box>
            {isMobile ? (
              <IconButton color="primary" aria-label="menu">
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  startIcon={<LoginIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  התחברות
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  color="primary"
                  startIcon={<HowToRegIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  הרשמה
                </Button>
                <Button
                  component={Link}
                  to="/"
                  variant="outlined"
                  color="primary"
                  startIcon={<GroupsIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  דף הבית
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(to bottom right, #fff, #f5f5f5)",
            border: "1px solid #e8eaf6",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
                bgcolor: "rgba(63, 81, 181, 0.05)",
                borderRadius: "50%",
                width: 80,
                height: 80,
                alignItems: "center",
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: "#3f51b5" }} />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 2,
                background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              align="center"
            >
              TeamTrack
            </Typography>
            <Typography variant="h5" color="#3f51b5" align="center" sx={{ mt: 1, fontWeight: 500 }}>
              העלאת קובץ למערכת
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mt: 1 }}>
              ניתן להעלות רק קבצי טקסט מסוג <b>.txt</b>
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              border: "2px dashed #3f51b5",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              bgcolor: "rgba(63, 81, 181, 0.03)",
              cursor: "pointer",
              "&:hover": { bgcolor: "rgba(63, 81, 181, 0.05)", boxShadow: "0 2px 8px rgba(63, 81, 181, 0.15)" },
            }}
            onClick={openFileDialog}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                openFileDialog();
              }
            }}
          >
            <input
              id="file-input"
              type="file"
              accept=".txt"
              onChange={fileSelectedHandler}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: "#3f51b5", mb: 1 }} />
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              {selectedFile ? selectedFile.name : "גרור קובץ לכאן או לחץ לבחירה"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedFile ? `גודל: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "עד 100MB"}
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={fileUploadHandler}
              disabled={!selectedFile || uploading}
              startIcon={<CloudUploadIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s",
                },
              }}
            >
              {uploading ? "מעלה..." : "העלה קובץ"}
            </Button>
          </Box>

          {uploading && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: "center" }}>
                {`מעלה... ${uploadProgress}%`}
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}

          {uploadResponse && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Alert
                severity={uploadResponse.success ? "success" : "error"}
                icon={uploadResponse.success ? <CheckCircleIcon /> : <ErrorIcon />}
                sx={{ borderRadius: 2, mb: 2 }}
              >
                {uploadResponse.message}
              </Alert>

              {/* הודעת UX נוספת – מופיעה רק כשיש הצלחה */}
              {uploadResponse.success && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  הקובץ האחרון שהועלה ישמש לעיבוד בהמשך.
                </Typography>
              )}

              {/* כפתור העתקת קישור */}
              {uploadResponse.success && uploadResponse.fileUrl && (
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyLink}
                  sx={{ borderRadius: 2 }}
                >
                  העתק קישור לקובץ
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Container>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="הקישור הועתק ללוח!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default UploadFile;
