
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Box } from '@mui/material';

const Layout = ({ user, onLogout }) => {
    return (
        <>
            <Header user={user} onLogout={onLogout} />
            <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </Box>
        </>
    );
};

export default Layout;
