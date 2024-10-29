import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import supabase from './supabase/supabase'; // Assuming Supabase is initialized

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Sign up the user
    const { data, error: signupError } = await supabase.auth.signUp({ email, password });

    if (signupError) {
      setError('Registration failed: ' + signupError.message);
      return;
    }

    // Insert the user into the users table
    const { user } = data;
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ id: user.id, email, role: 'user' }]); // Assuming a default role of 'user'

    if (insertError) {
      setError('Error saving user details: ' + insertError.message);
      return;
    }

    setSuccess('Registration successful! Please check your email to confirm your account.');
    navigate('/login'); // Redirect to login page after successful registration
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', marginBottom: '20px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', marginBottom: '20px' }}>{success}</Alert>}

        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '20px' }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default RegisterPage;
