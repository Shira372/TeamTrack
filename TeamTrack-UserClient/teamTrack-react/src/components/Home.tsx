import { Link } from "react-router-dom";
import { Button, Grid } from "@mui/material"; // משתמשים ב-Material UI
import { useUser } from "../use-Context/userProvider";
import { useState, useEffect } from "react";
import React from 'react';

const Home = () => {
    const { user } = useUser(); // שימוש בפונקציה הבטוחה
    const [showUploadFile, setShowUploadFile] = useState(false); // מצב להצגת הכפתור

    useEffect(() => {
        if (user?.Id !== 0) {
            setShowUploadFile(true);
        } else {
            setShowUploadFile(false);
        }
    }, [user]);

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
                <div style={{ display: "flex", gap: "15px" }}>

                    <Link to="Login">
                        <Button variant="text" color="primary">Login</Button>
                    </Link>

                    <Link to="SignUp">
                        <Button variant="text" color="primary">Sign Up</Button>
                    </Link>

                    {user?.Id !== undefined && showUploadFile && ( // מציג רק אם המשתמש מחובר
                        <Link to="showUploadFile">
                            <Button
                                variant="contained"
                                color="primary"
                            >
                                Add New Recipe
                            </Button>
                        </Link>
                    )}
                </div>
            </header>
            <Grid container spacing={3}>
                {/* כאן אפשר להוסיף תוכן נוסף, אם צריך */}
            </Grid>
        </div>
    );
}

export default Home;
