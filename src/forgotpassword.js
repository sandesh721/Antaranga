import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from '@mui/material';
import supabase from './supabase/supabase'; // Assuming Supabase is initialized

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Set loading to true

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError('Password reset failed: ' + error.message);
    } else {
      setSuccess('Password reset email sent! Please check your inbox.');
    }

    setLoading(false); // Set loading to false
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
          Forgot Password
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', marginBottom: '20px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', marginBottom: '20px' }}>{success}</Alert>}

        <form onSubmit={handleForgotPassword} style={{ width: '100%' }}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '20px' }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'} {/* Show loading indicator */}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default ForgotPasswordPage;
