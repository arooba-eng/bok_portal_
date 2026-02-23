import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Button, Divider, Dialog, Fade, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Dashboard = ({ user, transactions, pendingBatches = [], balance = 0 }) => {
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState(false);

    return (
        <Fade in={true} timeout={800}>
            <Container maxWidth={false} sx={{ mt: 3, mb: 6, width: '100%', px: { xs: 2, md: 4 } }}>
                {/* Page Header */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">Dashboard</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Welcome back, <strong>{user.name}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ bgcolor: user.hierarchy === 'Maker' ? '#e8f5e9' : '#e3f2fd', px: 2, py: 0.5, borderRadius: 2, border: '1px solid', borderColor: user.hierarchy === 'Maker' ? '#c8e6c9' : '#bbdefb' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: user.hierarchy === 'Maker' ? '#2e7d32' : '#1565c0' }}>
                            ROLE: {user.role === 'admin' ? 'Bank Admin' : (user.hierarchy || 'GENERAL USER')}
                        </Typography>
                    </Box>
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
                                        <Typography variant="overline" color="text.secondary" fontWeight="bold">Institution Balance</Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'primary.main', mb: 1 }}>
                                        PKR {balance.toLocaleString()}
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
                                    {(user.hierarchy?.toLowerCase() === 'maker' || user.role === 'admin') && (
                                        <>
                                            <Grid item xs={6} sm={3}>
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
                                            <Grid item xs={6} sm={3}>
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
                                        </>
                                    )}
                                    {(user.hierarchy?.toLowerCase() === 'checker/approver' || user.role === 'admin') && (
                                        <Grid item xs={6} sm={3}>
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
                                                    position: 'relative',
                                                    '&:hover': {
                                                        bgcolor: '#E3F2FD',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }
                                                }}
                                                onClick={() => navigate('/transfer/approvals')}
                                            >
                                                {pendingBatches.length > 0 && (
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: 10,
                                                        right: 15,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: 'error.main',
                                                        borderRadius: '50%',
                                                        border: '2px solid white'
                                                    }} />
                                                )}
                                                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'white', color: 'success.main', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                    <CheckCircleIcon fontSize="small" />
                                                </Box>
                                                <Typography variant="subtitle2" fontWeight="600">Approvals</Typography>
                                            </Button>
                                        </Grid>
                                    )}
                                    <Grid item xs={6} sm={3}>
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

                {/* Pending Approvals Section - Only for Approvers/Admins */}
                {(user.hierarchy?.toLowerCase() === 'checker/approver' || user.role === 'admin') && pendingBatches.length > 0 && (
                    <Fade in={true} timeout={1200}>
                        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, borderLeft: '6px solid #2e7d32', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a4f3e' }}>Items Pending Your Approval</Typography>
                                <Button size="small" variant="text" onClick={() => navigate('/transfer/approvals')}>View All</Button>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {pendingBatches.map((batch) => (
                                <Box key={batch.id} sx={{ py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="body2" fontWeight="600">{batch.customerName || 'Standard Transaction'}</Typography>
                                        <Typography variant="caption" color="text.secondary">{batch.productName} • {batch.timestamp}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body2" fontWeight="700" color="primary.main">PKR {batch.totalAmount.toLocaleString()}</Typography>
                                        <Typography variant="caption" sx={{ bgcolor: '#fff3e0', color: '#e65100', px: 1, borderRadius: 1 }}>Pending</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Paper>
                    </Fade>
                )}

                {/* Recent Activity - Compact */}
                <Fade in={true} timeout={1500}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recent Activity</Typography>

                        {/* Filtered Activity based on Role */}
                        {user.hierarchy === 'Maker' && pendingBatches.filter(b => b.makerId === user.userId).map((pb, idx) => (
                            <Box key={'pb-' + pb.id}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                            bgcolor: '#FFF9DB',
                                            color: '#F59F00',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2
                                        }}>
                                            <CloudUploadIcon sx={{ fontSize: '1rem' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight="600" sx={{ mb: 0 }}>{pb.productName} (Submitted)</Typography>
                                            <Typography variant="caption" color="text.secondary">{pb.timestamp}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '0.95rem' }}>
                                            PKR {pb.totalAmount.toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'warning.main' }}>Awaiting Approval</Typography>
                                    </Box>
                                </Box>
                                <Divider />
                            </Box>
                        ))}

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