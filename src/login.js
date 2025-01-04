import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from '@mui/material';
import { auth } from './supabase/firebase'; // Assuming Firebase is initialized
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use Firebase Authentication to log in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // User logged in successfully
      const user = userCredential.user;
      if (!user) {
        setError('User not found.');
        setLoading(false);
        return;
      }
      
      // Redirect to home page after successful login
      const db = getFirestore();
    const userDoc = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
      navigate('/home');

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const role = userData.role; 
      console.log('User role:', role); 
    }
    } catch (loginError) {
      setError('Login failed: ' + loginError.message);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>

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
