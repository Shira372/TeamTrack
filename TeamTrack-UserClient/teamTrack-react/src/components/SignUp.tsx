import React, { useState } from 'react';
import axios from "axios";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "../use-Context/userProvider";
import { User } from '../moduls/user';

import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GroupsIcon from '@mui/icons-material/Groups';
import LoginIcon from '@mui/icons-material/Login';

export type UserForSignUp = {
  userName: string;
  password: string;
  company: string;
  email: string;
};

const validationSchema = Yup.object({
  userName: Yup.string().required("שם המשתמש חובה").min(5, "לפחות 5 תווים"),
  password: Yup.string().required("הסיסמה חובה").min(8, "לפחות 8 תווים"),
  company: Yup.string().required("שם החברה חובה"),
  email: Yup.string().email("כתובת אימייל לא תקינה").required("האימייל חובה"),
});

const SignUp = () => {
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { register, handleSubmit, formState: { errors } } = useForm<UserForSignUp>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<UserForSignUp> = async (data) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL;

      const payload = {
        UserName: data.userName,
        PasswordHash: data.password,
        Company: data.company,
        Email: data.email
      };

      console.log("נשלח לשרת:", payload);

      const response = await axios.post(`${apiUrl}/api/users/signup`, payload);

      // שמירת המשתמש והטוקן שנשלחו מהשרת
      setUser(response.data.User);
      localStorage.setItem('tt_token', response.data.Token);

      navigate('/meetings');
    } catch (err) {
      console.error("שגיאה בהרשמה:", err);
      // כאן אפשר להוסיף הודעות שגיאה למשתמש, לפי שיקולך
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography variant="h6" sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                TeamTrack
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={Link} to="/Login" variant="outlined" color="primary" startIcon={<LoginIcon />}>
                התחברות
              </Button>
              <Button component={Link} to="/" variant="outlined" color="primary" startIcon={<GroupsIcon />}>
                דף הבית
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Form Container */}
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
          border: '1px solid #e8eaf6',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              bgcolor: 'rgba(63, 81, 181, 0.05)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              <PersonAddIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{
              background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TeamTrack
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mt: 1 }}>ניהול וסיכום ישיבות צוות</Typography>
            <Typography variant="subtitle1" color="text.secondary">מלא את הפרטים כדי להירשם</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="שם משתמש"
                fullWidth
                {...register("userName")}
                error={!!errors.userName}
                helperText={errors.userName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonAddIcon color="primary" />
                    </InputAdornment>
                  )
                }}
                dir="rtl"
              />

              <TextField
                label="סיסמה"
                type={showPassword ? "text" : "password"}
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end" aria-label="toggle password visibility">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                dir="rtl"
              />

              <TextField
                label="חברה"
                fullWidth
                {...register("company")}
                error={!!errors.company}
                helperText={errors.company?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="primary" />
                    </InputAdornment>
                  )
                }}
                dir="rtl"
              />

              <TextField
                label="אימייל"
                type="email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  )
                }}
                dir="rtl"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                  boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s',
                  }
                }}
              >
                {isLoading ? 'נרשם...' : 'הירשם עכשיו'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              כבר יש לך חשבון?{' '}
              <Typography
                component="span"
                variant="body2"
                color="primary"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/login')}
              >
                התחבר כאן
              </Typography>
            </Typography>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;
