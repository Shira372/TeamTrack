import React, { useState } from 'react';
import axios from "axios";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "../use-Context/userProvider";
import type { User } from '../moduls/user';

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
    useMediaQuery,
    Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import GroupsIcon from '@mui/icons-material/Groups';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export type UserForLogin = {
    userName: string,
    password: string
};

const validationSchema = Yup.object({
    userName: Yup.string().required("שם המשתמש חובה").min(5, "שם המשתמש צריך להיות לפחות 5 תווים"),
    password: Yup.string().required("הסיסמה חובה").min(8, "הסיסמה צריכה להיות לפחות 8 תווים"),
}).required();

const Login = () => {
    const { setUser } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const { register, handleSubmit, formState: { errors } } = useForm<UserForLogin>({
        resolver: yupResolver(validationSchema),
    });

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSubmit = (data: UserForLogin) => {
        const cleanedData: UserForLogin = {
            userName: data.userName.trim().toLowerCase(),
            password: data.password.trim(),
        };
        loginUser(cleanedData);
    };


    
    const loginUser = async (data: UserForLogin) => {
        try {
          setIsLoading(true);
          setErrorMessage(null);
      
          const apiUrl = process.env.REACT_APP_API_URL;
      
          if (process.env.NODE_ENV !== 'production') {
            console.log("🔐 login attempt:", data);
          }
      
          const response = await axios.post(`${apiUrl}/api/users/login`, {
            UserName: data.userName,
            PasswordHash: data.password
          });
      
          const token = response.data.Token || response.data.token;
          const user = response.data.User || response.data.user;
      
          if (!token || !user) {
            if (process.env.NODE_ENV !== 'production') {
              console.error("🚨 Missing token or user in login response:", response.data);
            }
            setErrorMessage("שגיאה בתשובת השרת. אנא נסה שוב או פנה למנהל המערכת.");
            return;
          }
      
          localStorage.setItem('tt_token', token);
          localStorage.setItem('user', JSON.stringify(user));
      
          if (process.env.NODE_ENV !== 'production') {
            console.log("✅ login success:", user);
          }
      
          setUser(user);
          navigate('/home');
      
        } catch (error: any) {
          if (process.env.NODE_ENV !== 'production') {
            console.error("❌ login error:", error);
          }
      
          if (error.response?.status === 401) {
            setErrorMessage("שם המשתמש או הסיסמה שגויים");
          } else if (error.request) {
            setErrorMessage("אין חיבור לשרת. נסה שוב מאוחר יותר.");
          } else {
            setErrorMessage("שגיאה לא צפויה. נסה שוב.");
          }
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
                            <LoginIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
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
                            התחברות למערכת
                        </Typography>

                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            align="center"
                            sx={{ mt: 1 }}
                        >
                            הזן את פרטי ההתחברות שלך כדי להמשיך
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {errorMessage && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                dir: 'rtl'
                            }}
                        >
                            {errorMessage}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ mb: 3 }}>
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
                                            <PersonIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                dir="rtl"
                                autoComplete="username"
                                disabled={isLoading}
                            />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <TextField
                                id="password"
                                label="סיסמה"
                                variant="outlined"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
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
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                dir="rtl"
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            size="large"
                            disabled={isLoading}
                            sx={{
                                borderRadius: 3,
                                fontWeight: 600,
                                boxShadow: '0 4px 10px rgba(63,81,181,0.3)',
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(63,81,181,0.6)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {isLoading ? 'טוען...' : 'התחבר'}
                        </Button>
                    </form>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 3, fontWeight: 400 }}
                    >
                        אין לך חשבון?{' '}
                        <Link to="/signup" style={{ color: '#3f51b5', fontWeight: 600 }}>
                            הרשם כאן
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
