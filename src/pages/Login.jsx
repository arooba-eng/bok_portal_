import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Grid,
    Alert,
    Link
} from '@mui/material';
import { users } from '../data/mockData';

const Login = ({ onLogin }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(u => u.userId === userId && u.password === password);
        if (user) {
            setError('');
            onLogin(user);
        } else {
            setError('Invalid User ID or Password');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh'}}>
            {/* Left Side - Brand Content */}
            <Grid container sx={{ height: '100vh' }}>
                <Grid item xs={12} md={6} sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 6,
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%'
                }}>
                    {/* Abstract Pattern */}
                    <Box sx={{
                        position: 'absolute',
                        top: -100,
                        left: -100,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.05)',
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: -50,
                        right: -50,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main',
                        opacity: 0.2,
                    }} />

                    <Box component="img" src="/bok_logo.jpg" sx={{ width: 180, mb: 4, borderRadius: 2, bgcolor: 'white', p: 1 }} />

                    <Typography variant="h3" component="h1" fontWeight="800" gutterBottom align="center">
                        Internet Banking
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, textAlign: 'center', maxWidth: 450, fontWeight: 400 }}>
                        Experience secure and seamless banking with The Bank of Khyber.
                    </Typography>
                </Grid>

                {/* Right Side - Login Form */}
                <Grid item xs={12} md={6} sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'background.default',
                    height: '100%'
                }}>
                    <Container maxWidth="xs">
                        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, bgcolor: 'white', boxShadow: '0px 8px 40px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Typography variant="h5" color="primary.main" fontWeight="bold" gutterBottom>
                                    Welcome Back
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Please enter your credentials to login.
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="User ID"
                                    variant="outlined"
                                    margin="normal"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    InputProps={{
                                        sx: { bgcolor: '#FAFAFA' }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    margin="normal"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        sx: { bgcolor: '#FAFAFA' }
                                    }}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
                                    <Link href="#" variant="body2" underline="hover" color="secondary.main">
                                        Forgot Password?
                                    </Link>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    type="submit"
                                    sx={{ py: 1.8, fontSize: '1rem' }}
                                >
                                     Login
                                </Button>
                            </form>
                        </Paper>
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                &copy; 2026 The Bank of Khyber. All rights reserved.
                            </Typography>
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;