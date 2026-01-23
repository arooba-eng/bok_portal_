import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee', px: { xs: 2, md: 5 } }}>
            <Toolbar disableGutters>
                {/* Logo Section */}
                <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
                    onClick={() => navigate('/dashboard')}
                >
                    <Box
                        component="img"
                        src="/bok_logo.jpg"
                        alt="Bank of Khyber"
                        sx={{ height: { xs: 40, md: 50 }, mr: 2 }}
                    />
                </Box>

                {/* User Profile Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
                    <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user.userId}
                        </Typography>
                    </Box>

                    <Avatar sx={{ bgcolor: 'secondary.main', width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, fontWeight: 'bold' }}>
                        {user.name.charAt(0)}
                    </Avatar>

                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<LogoutIcon />}
                        onClick={onLogout}
                        sx={{
                            borderRadius: 8,
                            ml: 1,
                            minWidth: { xs: 35, md: 100 },
                            px: { xs: 1, md: 2 },
                            borderColor: 'divider',
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: 'error.main',
                                color: 'error.main',
                                bgcolor: 'error.lighter'
                            },
                            '& .MuiButton-startIcon': { mr: { xs: 0, md: 1 }, ml: { xs: 0, md: -0.5 } },
                            '& span:not(.MuiButton-startIcon)': { display: { xs: 'none', md: 'inline' } }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
