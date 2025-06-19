import React, { useState, useRef } from "react";
import {
  Button, Box, Typography, Container, AppBar, Toolbar, IconButton,
  Divider, Alert, useTheme, useMediaQuery, LinearProgress, Link as MuiLink
} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GroupsIcon from '@mui/icons-material/Groups';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<{ message: string; success: boolean; fileUrl?: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate(); // ⬅️ בשביל המעבר האוטומטי

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.name.toLowerCase().endsWith(".txt")) {
        setUploadResponse({
          message: "ניתן להעלות רק קבצי טקסט מסוג .txt בלבד.",
          success: false
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
            fileUrl: data.fileUrl
          });

          if (data.s3Key) {
            localStorage.setItem("s3Key", data.s3Key); // ⬅️ שמירה ב-localStorage
            navigate("/keypoints"); // ⬅️ מעבר אוטומטי
          }
        } catch {
          setUploadResponse({
            message: "העלאה הצליחה אך לא ניתן לקבל קישור לקובץ.",
            success: true
          });
        }
      } else {
        setUploadResponse({
          message: `שגיאה בהעלאה: ${xhr.statusText || xhr.status}`,
          success: false
        });
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      xhrRef.current = null;
      setUploadResponse({ message: "שגיאה ברשת בהעלאת הקובץ.", success: false });
    };

    xhr.open("POST", "https://teamtrack-server.onrender.com/api/fileupload/upload");
    xhr.send(formData);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                TeamTrack
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton color="primary" aria-label="menu">
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button component={Link} to="/login" variant="outlined" color="primary" startIcon={<LoginIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>התחברות</Button>
                <Button component={Link} to="/signup" variant="outlined" color="primary" startIcon={<HowToRegIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>הרשמה</Button>
                <Button component={Link} to="/" variant="outlined" color="primary" startIcon={<GroupsIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>דף הבית</Button>
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
            background: 'linear-gradient(to bottom right, #fff, #f5f5f5)',
            border: '1px solid #e8eaf6',
            boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
              bgcolor: 'rgba(63, 81, 181, 0.05)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              alignItems: 'center'
            }}>
              <CloudUploadIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
            </Box>

            <Typography component="h1" variant="h4" fontWeight="bold"
              sx={{
                mb: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
              }} align="center">
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
              border: '2px dashed #3f51b5',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: 'rgba(63, 81, 181, 0.03)',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(63, 81, 181, 0.05)',
                boxShadow: '0 2px 8px rgba(63, 81, 181, 0.15)'
              }
            }}
            onClick={openFileDialog}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFileDialog() }}
            role="button"
            tabIndex={0}
          >
            <input
              id="file-input"
              type="file"
              accept=".txt"
              onChange={fileSelectedHandler}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: '#3f51b5', mb: 1 }} />
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              {selectedFile ? selectedFile.name : 'גרור קובץ לכאן או לחץ לבחירה'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedFile ? `גודל: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'עד 100MB'}
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
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.4)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s'
                }
              }}
            >
              {uploading ? 'מעלה...' : 'העלה קובץ'}
            </Button>
          </Box>

          {uploading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                {`מעלה... ${uploadProgress}%`}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(63, 81, 181, 0.1)' }}
              />
            </Box>
          )}

          {uploadResponse && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Alert
                severity={uploadResponse.success ? "success" : "error"}
                icon={uploadResponse.success ? <CheckCircleIcon /> : <ErrorIcon />}
                sx={{ borderRadius: 2, mb: 2 }}
              >
                {uploadResponse.message}
              </Alert>

              {uploadResponse.success && uploadResponse.fileUrl && (
                <MuiLink
                  href={uploadResponse.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{ fontWeight: 'bold', color: '#3f51b5' }}
                >
                  לחץ כאן לפתיחת הקובץ שהועלה
                </MuiLink>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default UploadFile;
