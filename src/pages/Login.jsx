import React, { useState } from 'react';
import { Grid, Box, TextField, Button, Typography, Alert, Container, Paper } from '@mui/material';
import { users } from '../data/mockData';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.userId === userId && u.password === password
    );
    if (user) {
      setError('');
      onLogin(user);
    } else {
      setError('Invalid User ID or Password');
    }
  };

  return (
    <Grid item sx={{ minHeight: '100vh' }}>
      {/* Left Side */}
      <Grid item  xs={12} md={6} sx={{display: 'flex',justifyContent: 'space-between',minHeight: '100vh'  }}>
      <Grid item   xs={0}      // hide on xs
       // half width on medium
    lg={6}      // half width on large
    sx={{
      display: { xs: 'none', sm: 'none', md: 'flex' }, // hide on small, show on md+
      bgcolor: 'primary.main',
      color: 'white',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      p: 6,
      width:"50%",
      position: 'relative',
      overflow: 'hidden',
    }}>
        <Box
            sx={{
              position: 'absolute',
              top: -100,
              left: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -50,
              right: -50,
              width: 300,
              height: 300,
              borderRadius: '50%',
              bgcolor: 'secondary.main',
              opacity: 0.2,
            }}
          />

          <Box
            component="img"
            src="/bok_logo.jpg"
            sx={{
              width: 180,
              mb: 4,
              borderRadius: 2,
              bgcolor: 'white',
              p: 1,
            }}
          />

          <Typography variant="h3" fontWeight={800} gutterBottom>
            Internet Banking
          </Typography>

          <Typography
            variant="h6"
            sx={{ opacity: 0.9, textAlign: 'center' ,color:"white" }}
          >
            Experience secure and seamless banking with The Bank of Khyber.
          </Typography>

      </Grid>
          <Grid   item
    xs={12}    // full width on xs
      // half width on md
    lg={6}     // half width on lg
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: 'background.default',
      width:{lg:'50%'}
    }}>
     <Container >
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 4,
                boxShadow: '0px 8px 40px rgba(0,0,0,0.05)',
                      justifyContent: 'center',
                      margin:{lg:8},
              }}
            >

              {/* MOBILE LOGO */}
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Box
                  component="img"
                  src="/bok_logo.jpg"
                  sx={{ width: 140 }}
                />
              </Box>

              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                  variant="h5"
                  color="primary.main"
                  fontWeight="bold"
                  gutterBottom
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please enter your credentials to login.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="User ID"
                  margin="normal"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

               
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
                                    <Link href="#" variant="body2" underline="hover" color="secondary.main">
                                        Forgot Password?
                                    </Link>
                                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </Paper>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                © 2026 The Bank of Khyber. All rights reserved.
              </Typography>
            </Box>
          </Container>

      </Grid>
      </Grid>

      {/* Right Side */}
     
    </Grid>
  );
};

export default Login;
