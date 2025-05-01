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
  Grid,
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
import MenuIcon from '@mui/icons-material/Menu';

export type UserForSignUp = {
  userName: string,
  password: string,
  company: string,
  email: string
};

const validationSchema = Yup.object({
  userName: Yup.string().required("שם המשתמש חובה").min(5, "שם המשתמש צריך להיות לפחות 5 תווים"),
  password: Yup.string().required("הסיסמה חובה").min(8, "הסיסמה צריכה להיות לפחות 8 תווים"),
  company: Yup.string().required("שם החברה חובה"),
  email: Yup.string().email("כתובת אימייל לא תקינה").required("האימייל חובה"),
}).required();

const SignUp = () => {
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { register, handleSubmit, formState: { errors } } = useForm<UserForSignUp>({
    resolver: yupResolver(validationSchema),
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit: SubmitHandler<UserForSignUp> = (data) => {
    signInUser(data);
  };

  const signInUser = async (data: UserForSignUp) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post<User>(`${apiUrl}/api/users/signup`, {
        UserName: data.userName,
        Password: data.password,
        Company: data.company,
        Email: data.email,
      });
      setUser({
        Id: response.data.Id,
        UserName: response.data.UserName,
        Password: response.data.Password,
        Company: response.data.Company,
        Email: response.data.Email,
      });
      navigate('/home');
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
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
              <IconButton
                color="primary"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button 
                  component={Link} 
                  to="/Login" 
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
              <PersonAddIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
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
              TeamTrack
            </Typography>

            <Typography
              variant="h5"
              color="#3f51b5"
              align="center"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              ניהול וסיכום ישיבות צוות בקליק
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              מלא את הפרטים הבאים כדי ליצור חשבון חדש
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id="userName"
                  label="שם משתמש"
                  variant="outlined"
                  fullWidth
                  {...register("userName")}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonAddIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  dir="rtl"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="סיסמה"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
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
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  dir="rtl"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="company"
                  label="חברה"
                  variant="outlined"
                  fullWidth
                  {...register("company")}
                  error={!!errors.company}
                  helperText={errors.company?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  dir="rtl"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="email"
                  type="email"
                  label="אימייל"
                  variant="outlined"
                  fullWidth
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  dir="rtl"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
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
                  {isLoading ? 'מתחבר...' : 'הירשם עכשיו'}
                </Button>
              </Grid>
            </Grid>

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
          </form>
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

export default SignUp;
