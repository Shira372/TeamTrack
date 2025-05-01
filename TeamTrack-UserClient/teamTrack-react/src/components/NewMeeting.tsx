import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Typography, 
  Paper,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Divider,
  Tooltip
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface FormData {
  MeetingName: string;
  CreatedByUserId: string;
  SummaryLink: string;
}

const NewMeeting = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [fileSelected, setFileSelected] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("MeetingName", data.MeetingName);
      formData.append("CreatedByUserId", data.CreatedByUserId);
      formData.append("SummaryLink", data.SummaryLink);

      const response = await axios.post(`${apiUrl}/api/meetings`, formData);
      // Navigate to meetings page after successful creation
      navigate('/meetings');
    } catch (error) {
      console.error("Error adding meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileSelected(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#f8f9fa'
      }}>
        <CircularProgress sx={{ color: '#3f51b5' }} />
      </Box>
    );
  }

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
                  component={RouterLink} 
                  to="/home" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<HomeIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  דף הבית
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/meetings" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<ListAltIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  הפגישות שלי
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
            border: '1px solid #e8eaf6',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
            mb: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4
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
              <AddCircleOutlineIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
            </Box>

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
              יצירת פגישה חדשה
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mt: 1, mb: 3 }}
            >
              מלא את הפרטים ליצירת פגישה חדשה במערכת
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="שם הפגישה"
                  variant="outlined"
                  {...register("MeetingName", { required: "שם הפגישה הוא שדה חובה" })}
                  error={!!errors.MeetingName}
                  helperText={errors.MeetingName ? errors.MeetingName.message : ""}
                  InputProps={{
                    sx: { 
                      borderRadius: 2,
                      bgcolor: 'white'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="מזהה משתמש"
                  variant="outlined"
                  {...register("CreatedByUserId", { required: "מזהה משתמש הוא שדה חובה" })}
                  error={!!errors.CreatedByUserId}
                  helperText={errors.CreatedByUserId ? errors.CreatedByUserId.message : ""}
                  InputProps={{
                    sx: { 
                      borderRadius: 2,
                      bgcolor: 'white'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="קישור לסיכום פגישה"
                  variant="outlined"
                  {...register("SummaryLink")}
                  InputProps={{
                    sx: { 
                      borderRadius: 2,
                      bgcolor: 'white'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed #C5CAE9',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'rgba(63, 81, 181, 0.03)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#3f51b5',
                      bgcolor: 'rgba(63, 81, 181, 0.05)',
                    }
                  }}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#3f51b5', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: '#3f51b5', mb: 1 }}>
                    {fileSelected ? 'הקובץ נטען בהצלחה' : 'העלאת קובץ הקלטה'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fileSelected 
                      ? file.name 
                      : 'גרור קובץ לכאן או לחץ לבחירת קובץ'}
                  </Typography>
                  {fileSelected && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mt: 1, 
                        color: 'success.main' 
                      }}
                    >
                      הקובץ מוכן לשליחה
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                component={RouterLink}
                to="/meetings"
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  }
                }}
              >
                חזרה לרשימת הפגישות
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !fileSelected}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                  boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                  pl: 3,
                  pr: 3,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.4)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s',
                  },
                  '&:disabled': {
                    background: '#E0E0E0',
                    boxShadow: 'none',
                    color: '#9E9E9E'
                  }
                }}
              >
                {loading ? "מעלה פגישה..." : "צור פגישה"}
              </Button>
            </Box>
          </Box>
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

export default NewMeeting;