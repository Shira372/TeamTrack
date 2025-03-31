import axios from "axios";
import { useForm } from 'react-hook-form';
import { Button, TextField, Grid } from '@mui/material'; // משתמשים ב-Material UI
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '../moduls/user';
import React, { useState } from 'react';
import { useUser } from "../use-Context/userProvider";
import { useNavigate } from 'react-router-dom';

export type UserForSignUp = {
    userName: string,
    password: string,
    company: string,
    email: string
};

// סכמת ולידציה
const validationSchema = Yup.object({
    userName: Yup.string().required("שם המשתמש חובה").min(5, "שם המשתמש צריך להיות לפחות 5 תווים"),
    password: Yup.string().required("הסיסמה חובה").min(8, "הסיסמה צריכה להיות לפחות 8 תווים"),
    company: Yup.string().required("שם החברה חובה"),
    email: Yup.string().email("כתובת אימייל לא תקינה").required("האימייל חובה"),
}).required();

const SignUp = () => {
    const { setUser } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // הגדרת useForm עם yupResolver
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    // יצירת פונקציה לשליחת הטופס
    const onSubmit = (data: UserForSignUp) => {
        signInUser(data);
    };

    const signInUser = async (data: UserForSignUp) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post<User>(`${apiUrl}/api/users/signup`, {
                UserName: data.userName,
                Password: data.password,
                Company: data.company,
                Email: data.email,
            });
            console.log('המשתמש נרשם בהצלחה:', response.data);
            setUser({
                Id: response.data.Id,
                UserName: response.data.UserName,
                Password: response.data.Password,
                Company: response.data.Company,
                Email: response.data.Email,
            });
            navigate('/home');  // ניווט לאחר ההתחברות
        } catch (error: any) {
            if (error.response) {
                console.error("שגיאת שרת:", error.response.status, error.response.data);
            } else if (error.request) {
                console.error("שגיאת רשת: אין תגובה מהשרת");
            } else {
                console.error("שגיאה לא צפויה:", error.message);
            }
        }
    };

    return (
        <div style={{ width: '50%', margin: '0 auto' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Sign Up</h2>
                <Grid container spacing={2} direction="column">
                    {/* שדה שם משתמש */}
                    <Grid item>
                        <TextField
                            id="userName"
                            label="UserName"
                            variant="outlined"
                            fullWidth
                            {...register("userName")}
                            error={!!errors.userName}
                            helperText={errors.userName?.message}
                        />
                    </Grid>

                    {/* שדה סיסמה */}
                    <Grid item>
                        <TextField
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            fullWidth
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <Button onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                ),
                            }}
                        />
                    </Grid>

                    {/* שדה חברה */}
                    <Grid item>
                        <TextField
                            id="company"
                            label="Company"
                            variant="outlined"
                            fullWidth
                            {...register("company")}
                            error={!!errors.company}
                            helperText={errors.company?.message}
                        />
                    </Grid>

                    {/* שדה אימייל */}
                    <Grid item>
                        <TextField
                            id="email"
                            type="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    {/* כפתור שליחה */}
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default SignUp;
