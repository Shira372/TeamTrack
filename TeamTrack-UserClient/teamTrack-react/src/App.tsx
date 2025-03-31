import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/signUp">Sign Up</Link>
    </div>
  );
}

export default App;
