import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Divider
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useUser } from "../use-Context/userProvider";

interface NewMeetingFormValues {
  MeetingName: string;
  SummaryLink?: string;
}

const NewMeeting = () => {
  const { user } = useUser();
  const { register, handleSubmit, formState: { errors } } = useForm<NewMeetingFormValues>();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onSubmit = async (data: NewMeetingFormValues) => {
    try {
      if (!user) {
        alert('משתמש לא מחובר');
        return;
      }
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("MeetingName", data.MeetingName);
      formData.append("CreatedByUserId", user.Id.toString());
      formData.append("SummaryLink", data.SummaryLink || "");

      await axios.post(`${apiUrl}/api/meetings`, formData);
      navigate('/meetings');
    } catch (error) {
      console.error("Error adding meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileSelected(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <CircularProgress sx={{ color: '#3f51b5' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#3f51b5' }}>TeamTrack</Typography>
            </Box>
            {isMobile ? (
              <IconButton color="primary"><MenuIcon /></IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button component={RouterLink} to="/home" variant="outlined" startIcon={<HomeIcon />}>דף הבית</Button>
                <Button component={RouterLink} to="/meetings" variant="outlined" startIcon={<ListAltIcon />}>הפגישות שלי</Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <AddCircleOutlineIcon sx={{ fontSize: 50, color: '#3f51b5' }} />
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>יצירת פגישה חדשה</Typography>
            <Typography variant="subtitle1" color="text.secondary">מלא את הפרטים ליצירת פגישה חדשה</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="שם הפגישה"
              variant="outlined"
              fullWidth
              {...register("MeetingName", { required: "שדה חובה" })}
              error={!!errors.MeetingName}
              helperText={errors.MeetingName?.message}
            />

            {/* השדה CreatedByUserId הוסר מהטופס כי הוא מתמלא אוטומטית */}

            <TextField
              label="קישור לסיכום"
              variant="outlined"
              fullWidth
              {...register("SummaryLink")}
            />

            <Box
              sx={{
                border: '2px dashed #C5CAE9',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                bgcolor: 'rgba(63, 81, 181, 0.03)',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#3f51b5',
                  bgcolor: 'rgba(63, 81, 181, 0.05)',
                }
              }}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <CloudUploadIcon sx={{ fontSize: 40, color: '#3f51b5', mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#3f51b5' }}>
                {fileSelected ? 'הקובץ נטען בהצלחה' : 'העלאת קובץ מתומלל'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fileSelected && file ? file.name : 'גרור קובץ לכאן או לחץ'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                component={RouterLink}
                to="/meetings"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
              >
                חזרה
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !fileSelected}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />}
              >
                {loading ? "מעלה..." : "צור פגישה"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default NewMeeting;
