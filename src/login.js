import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from '@mui/material';
import supabase from './supabase/supabase'; // Assuming Supabase is initialized

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Set loading to true when starting the login process

    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError('Login failed: ' + loginError.message);
      setLoading(false); // Reset loading state
      return;
    }

    // Fetch user data and check role
    const user = data.user; // Get the authenticated user
    if (!user || !user.id) { // Ensure user and user.id are defined
      setError('User not found.');
      setLoading(false); // Reset loading state
      return;
    }

    const { data: userDetails, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id) // Ensure user.id is defined
      .limit(1) // Ensure only one row is returned
      .single(); // Expect a single result

    if (userError) {
      setError('Error fetching user details: ' + userError.message);
      setLoading(false); // Reset loading state
      return;
    }

    // Check if userDetails is not null
    if (!userDetails) {
      setError('No user details found.');
      setLoading(false); // Reset loading state
      return;
    }

    // Redirect based on role
    if (userDetails.role === 'admin') {
      navigate('/admin_dashboard');
    } else {
      navigate('/user_dashboard');
    }

    setLoading(false); // Reset loading state after redirection
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
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', marginBottom: '20px' }}>{error}</Alert>}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '20px' }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : 'Login'} {/* Show loading indicator */}
          </Button>
        </form>

        {/* Forgot Password and Register options */}
        <Box mt={3}>
          <Typography variant="body2">
            Forgot your password?{' '}
            <Link to="/forgotpassword" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Reset Password
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '10px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
