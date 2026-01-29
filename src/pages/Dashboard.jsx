import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Button, Divider, Dialog, Fade, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Dashboard = ({ user, transactions }) => {
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState(false);

    return (
        <Fade in={true} timeout={800}>
            <Container maxWidth={false} sx={{ mt: 3, mb: 6, width: '100%', px: { xs: 2, md: 4 } }}>
                {/* Page Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back, <strong>{user.name}</strong>
                    </Typography>
                </Box>

                {/* Top Row: Balance & Actions */}
                <Grow in={true} timeout={1000}>
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                        <Grid container spacing={4} alignItems="center" justifyContent={"space-between"}>
                            {/* Balance Section */}
                            <Grid item xs={12} md={5} lg={4}>
                                <Box sx={{ p: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <AccountBalanceWalletIcon color="primary" sx={{ mr: 1, fontSize: 24 }} />
                                        <Typography variant="overline" color="text.secondary" fontWeight="bold">Current Balance</Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'primary.main', mb: 1 }}>
                                        PKR {user.balance.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', bgcolor: '#F8F9FA', px: 1.5, py: 0.5, borderRadius: 1 }}>
                                        {user.accountNumber}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Vertical Divider for desktop */}
                            <Grid item md={0.5} sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
                                <Divider orientation="vertical" flexItem sx={{ height: '100px', mx: 'auto' }} />
                            </Grid>
                            <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Divider />
                            </Grid>

                            {/* Quick Actions Section */}
                            <Grid item xs={12} md={6.5} lg={7.5}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={4}>
                                        <Button
                                            fullWidth
                                            sx={{
                                                flexDirection: 'column',
                                                gap: 1.5,
                                                p: 2,
                                                color: 'text.primary',
                                                bgcolor: '#F8F9FA',
                                                borderRadius: 3,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: '#E3F2FD',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                            onClick={() => navigate('/transfer/single')}
                                        >
                                            <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'white', color: 'primary.main', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <SendIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="subtitle2" fontWeight="600">Single Transfer</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                        <Button
                                            fullWidth
                                            sx={{
                                                flexDirection: 'column',
                                                gap: 1.5,
                                                p: 2,
                                                color: 'text.primary',
                                                bgcolor: '#F8F9FA',
                                                borderRadius: 3,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: '#E3F2FD',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                            onClick={() => navigate('/transfer/bulk')}
                                        >
                                            <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'white', color: 'secondary.main', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <CloudUploadIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="subtitle2" fontWeight="600">Bulk Transfer</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Button
                                            fullWidth
                                            sx={{
                                                flexDirection: 'column',
                                                gap: 1.5,
                                                p: 2,
                                                color: 'text.disabled',
                                                bgcolor: '#F8F9FA',
                                                borderRadius: 3,
                                                opacity: 0.7,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: '#F1F3F5',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                            onClick={() => setOpenAlert(true)}
                                        >
                                            <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'white', color: '#ADB5BD', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <ReceiptIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="subtitle2" fontWeight="600">Bill Pay</Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grow>

                {/* Recent Activity - Compact */}
                <Fade in={true} timeout={1500}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recent Activity</Typography>

                        {transactions.slice(0).reverse().map((tx, index) => (
                            <Box key={tx.id}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                            bgcolor: tx.type === 'debit' ? '#FFF5F5' : '#E6FCF5',
                                            color: tx.type === 'debit' ? '#FA5252' : '#28A745',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2
                                        }}>
                                            {tx.type === 'debit' ? <SendIcon sx={{ transform: 'rotate(-45deg)', fontSize: '1rem' }} /> : <ReceiptIcon sx={{ fontSize: '1rem' }} />}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight="600" sx={{ mb: 0 }}>{tx.description}</Typography>
                                            <Typography variant="caption" color="text.secondary">{tx.date}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body1" fontWeight="bold" color={tx.type === 'debit' ? 'text.primary' : 'success.main'} sx={{ fontSize: '0.95rem' }}>
                                            {tx.type === 'debit' ? '-' : '+'} PKR {Math.abs(tx.amount).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                {index < transactions.length - 1 && <Divider />}
                            </Box>
                        ))}

                        {transactions.length === 0 && (
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                                No recent transactions found.
                            </Typography>
                        )}
                    </Paper>
                </Fade>

                <Dialog open={openAlert} onClose={() => setOpenAlert(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Feature Coming Soon</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                            The Bill Payment module is currently under development and will be available shortly.
                        </Typography>
                        <Button fullWidth variant="contained" onClick={() => setOpenAlert(false)}>
                            OK, Got it
                        </Button>
                    </Box>
                </Dialog>
            </Container>
        </Fade>
    );
};

export default Dashboard;