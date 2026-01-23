import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Box,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { banks } from '../data/mockData';
import PinInput from '../components/PinInput';

const SingleTransfer = ({ user, setUser, transactions, setTransactions }) => {
    const navigate = useNavigate();
    const [selectedBank, setSelectedBank] = useState('');
    const [iban, setIban] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);

    // FPIN & Confirmation State
    const [openConfirm, setOpenConfirm] = useState(false);
    const [fpinInput, setFpinInput] = useState('');
    const [fpinError, setFpinError] = useState('');

    const [success, setSuccess] = useState(false);

    const handleTransferInit = () => {
        if (!selectedBank || !iban || !amount) {
            setError('Please fill in all required fields.');
            setOpenErrorDialog(true);
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0.');
            setOpenErrorDialog(true);
            return;
        }
        if (parseFloat(amount) > user.balance) {
            setError('Insufficient funds.');
            setOpenErrorDialog(true);
            return;
        }
        setError('');
        setFpinInput('');
        setFpinError('');
        setOpenConfirm(true);
    };

    const confirmTransfer = () => {
        // Validate FPIN
        if (fpinInput !== user.fpin) {
            setFpinError('Invalid FPIN code.');
            return;
        }

        const transferAmount = parseFloat(amount);

        // 1. Deduct balance
        const newBalance = user.balance - transferAmount;
        const updatedUser = { ...user, balance: newBalance };
        setUser(updatedUser);

        // 2. Add to History
        const bankName = banks.find(b => b.code === selectedBank)?.name || selectedBank;
        const newTx = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            description: `Transfer to ${bankName} (${iban})`,
            amount: -transferAmount, // Negative for debit
            type: 'debit'
        };
        setTransactions([...transactions, newTx]);

        setOpenConfirm(false);
        setSuccess(true);
    };

    const handleCloseSuccess = () => {
        setSuccess(false);
        navigate('/dashboard');
    }

    const FormLabel = ({ children }) => (
        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5, color: 'text.primary' }}>
            {children}
        </Typography>
    );

    return (
        <Container maxWidth={false} sx={{ mt: 5, mb: 5, width: '100%', px: { xs: 2, md: 5 } }}>
            <Box sx={{ mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ color: 'text.secondary' }}>
                    Back to Dashboard
                </Button>
            </Box>

            <Grid container justifyContent="center">
                <Grid item xs={12} md={10} lg={8}>
                    <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Single Fund Transfer
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Securely transfer funds to any bank account in Pakistan.
                            </Typography>
                        </Box>

                        <form>
                            <Grid container spacing={3}>
                                {/* Row 1: Bank & IBAN */}
                                <Grid item xs={12} md={6}>
                                    <FormLabel>Select Bank</FormLabel>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        value={selectedBank}
                                        onChange={(e) => setSelectedBank(e.target.value)}
                                        placeholder="Select Bank"
                                    >
                                        {banks.map((option) => (
                                            <MenuItem key={option.code} value={option.code}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormLabel>IBAN / Account Number</FormLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={iban}
                                        onChange={(e) => setIban(e.target.value)}
                                        placeholder="PK36BOKK..."
                                    />
                                </Grid>

                                {/* Row 2: Amount & Description */}
                                <Grid item xs={12} md={6}>
                                    <FormLabel>Amount (PKR)</FormLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="e.g. Rent payment"
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    size="medium"
                                    sx={{ minWidth: 200, py: 1.5, borderRadius: 2 }}
                                    onClick={handleTransferInit}
                                >
                                    Proceed to Transfer
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>
            </Grid>


            {/* Confirmation & FPIN Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: { xs: 300, md: 400 } } }}>
                <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>Confirm Transfer</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ textAlign: 'center', mb: 3 }}>
                        You are about to transfer <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>PKR {parseFloat(amount || 0).toLocaleString()}</Box><br />
                        to <Box component="span" sx={{ fontWeight: 'bold' }}>{selectedBank}</Box> account <Box component="span" sx={{ fontFamily: 'monospace' }}>{iban}</Box>.
                    </DialogContentText>

                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FormLabel>Enter 4-Digit FPIN</FormLabel>
                        <Box sx={{ mt: 1, mb: 2 }}>
                            <PinInput
                                onChange={(val) => {
                                    setFpinInput(val);
                                    setFpinError('');
                                }}
                                error={!!fpinError}
                            />
                        </Box>
                        {fpinError && (
                            <Typography variant="caption" color="error" sx={{ mb: 1 }}>
                                {fpinError}
                            </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" align="center" display="block">
                            Enter the FPIN code associated with your account.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit" variant="outlined" sx={{ minWidth: 100 }}>Cancel</Button>
                    <Button onClick={confirmTransfer} variant="contained" sx={{ minWidth: 100 }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" color="error" fontWeight="bold">Error</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                        {error}
                    </Typography>
                    <Button fullWidth variant="contained" onClick={() => setOpenErrorDialog(false)} color="error">
                        OK
                    </Button>
                </Box>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={success} onClose={handleCloseSuccess} PaperProps={{ sx: { borderRadius: 3, p: 3, textAlign: 'center', minWidth: 320 } }}>
                <Box sx={{ color: 'success.main', mb: 2 }}>
                    <Box sx={{
                        width: 60, height: 60, borderRadius: '50%', bgcolor: '#E6FCF5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                    }}>
                        <Typography variant="h4">✓</Typography>
                    </Box>
                </Box>
                <DialogTitle sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1.5rem', p: 0, mb: 1 }}>Transfer Successful</DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <DialogContentText sx={{ mb: 3 }}>
                        Your transaction has been processed successfully.
                    </DialogContentText>
                    <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block">New Balance</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">PKR {(user.balance - parseFloat(amount)).toLocaleString()}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', p: 0, mt: 3 }}>
                    <Button onClick={handleCloseSuccess} variant="contained" color="success" size="large" fullWidth>
                        Return to Dashboard
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default SingleTransfer;