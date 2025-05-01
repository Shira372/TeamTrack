import React, { useState } from "react";
import AWS from "aws-sdk";  // Import AWS SDK
import { 
  Button, 
  Box, 
  Typography, 
  Container, 
  CircularProgress,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Grid,
  Alert,
  useTheme,
  useMediaQuery,
  LinearProgress
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
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResponse, setUploadResponse] = useState<{ message: string; success: boolean } | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // פונקציה שתעדכן את הקובץ שנבחר
  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      // איפוס תגובת ההעלאה בעת בחירת קובץ חדש
      setUploadResponse(null);
      setUploadProgress(0);
    }
  };

  // פונקציה שתשלח את הקובץ ל-S3
  const fileUploadHandler = async () => {
    if (selectedFile) {
      setUploading(true);
      setUploadProgress(0);

      // הגדרת הקונפיגורציה של AWS SDK
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,  // מפתח גישה
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,  // מפתח סודי
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
        // סימולציה של התקדמות העלאה
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 95) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 15;
          });
        }, 300);

        // העלאת הקובץ ל-S3
        const data = await s3.upload(params).promise();
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setUploadResponse({
          message: `הקובץ הועלה בהצלחה: ${data.Location}`,
          success: true
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadResponse({
          message: "שגיאה בהעלאת הקובץ",
          success: false
        });
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header/Navigation Bar */}
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                TeamTrack
              </Typography>
            </Box>

            {isMobile ? (
              <>
                <IconButton
                  color="primary"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button 
                  component={Link} 
                  to="/login" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<LoginIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  התחברות
                </Button>
                <Button 
                  component={Link} 
                  to="/signup" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<HowToRegIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  הרשמה
                </Button>
                <Button 
                  component={Link} 
                  to="/" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<GroupsIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  דף הבית
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
            border: '1px solid #e8eaf6',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2,
              bgcolor: 'rgba(63, 81, 181, 0.05)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              alignItems: 'center'
            }}>
              <CloudUploadIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
            </Box>

            {/* TeamTrack */}
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              sx={{ 
                mb: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
              }}
              align="center"
            >
              TeamTrack
            </Typography>

            <Typography
              variant="h5"
              color="#3f51b5"
              align="center"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              העלאת קובץ למערכת
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              בחר קובץ מהמחשב שלך להעלאה לענן
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed #3f51b5',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'rgba(63, 81, 181, 0.03)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(63, 81, 181, 0.05)',
                    boxShadow: '0 2px 8px rgba(63, 81, 181, 0.15)'
                  }
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  onChange={fileSelectedHandler}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: '#3f51b5', mb: 1 }} />
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  {selectedFile ? selectedFile.name : 'גרור קובץ לכאן או לחץ לבחירה'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedFile 
                    ? `גודל: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` 
                    : 'תומך בכל סוגי הקבצים עד 100MB'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
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
                    transition: 'all 0.3s',
                  }
                }}
              >
                {uploading ? 'מעלה...' : 'העלה קובץ'}
              </Button>
            </Grid>
            
            {uploading && (
              <Grid item xs={12}>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                    {`מעלה... ${Math.min(Math.round(uploadProgress), 100)}%`}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(uploadProgress, 100)} 
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(63, 81, 181, 0.1)'
                    }}
                  />
                </Box>
              </Grid>
            )}

            {uploadResponse && (
              <Grid item xs={12}>
                <Alert 
                  severity={uploadResponse.success ? "success" : "error"}
                  icon={uploadResponse.success ? <CheckCircleIcon /> : <ErrorIcon />}
                  sx={{ 
                    borderRadius: 2,
                    dir: 'rtl'
                  }}
                >
                  {uploadResponse.message}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Paper>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Shira Steinmetz | 055-6755372
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default UploadFile;