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
  Divider,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useUser } from "../use-Context/userProvider";

interface NewMeetingFormValues {
  MeetingName: string;
  SummaryLink?: string;
}

const NewMeeting = () => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewMeetingFormValues>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ הזרקת הטוקן לבקשות axios
  React.useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt_token");
      if (token && config.url?.startsWith(process.env.REACT_APP_API_URL || "")) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const onSubmit = async (data: NewMeetingFormValues) => {
    try {
      if (!user) {
        alert("משתמש לא מחובר");
        return;
      }

      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        alert("שגיאה בהגדרות השרת");
        return;
      }

      setLoading(true);

      const payload = {
        MeetingName: data.MeetingName,
        CreatedByUserId: user.id.toString(),
        SummaryLink: data.SummaryLink || "", // משתמשים בערך שהוקלד, לא ב-localStorage
      };

      await axios.post(`${apiUrl}/api/meetings`, payload);
      navigate("/meetings");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("jwt_token");
        navigate("/login");
        return;
      }
      console.error("Error adding meeting:", error);
      alert("שגיאה ביצירת הפגישה, נסה שנית");
    } finally {
      setLoading(false);
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
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#3f51b5" }}>
                TeamTrack
              </Typography>
            </Box>
            {isMobile ? (
              <IconButton color="primary" aria-label="menu">
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button component={RouterLink} to="/home" variant="outlined" startIcon={<HomeIcon />}>
                  דף הבית
                </Button>
                <Button component={RouterLink} to="/meetings" variant="outlined" startIcon={<ListAltIcon />}>
                  הפגישות שלי
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <AddCircleOutlineIcon sx={{ fontSize: 50, color: "#3f51b5" }} />
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
              יצירת פגישה חדשה
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              מלא את הפרטים ליצירת פגישה חדשה
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="שם הפגישה"
              variant="outlined"
              fullWidth
              {...register("MeetingName", { required: "שדה חובה" })}
              error={!!errors.MeetingName}
              helperText={errors.MeetingName?.message}
            />

            <TextField
              label="קישור לסיכום (אופציונלי)"
              variant="outlined"
              fullWidth
              {...register("SummaryLink", {
                pattern: {
                  value: /^(https?:\/\/)?([\w.-]+)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                  message: "כתובת URL לא תקינה",
                },
              })}
              error={!!errors.SummaryLink}
              helperText={errors.SummaryLink?.message}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button component={RouterLink} to="/meetings" variant="outlined" startIcon={<ArrowBackIcon />}>
                חזרה
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
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
