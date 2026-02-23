import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    FormControl,
    Select
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { banks } from '../data/mockData';
import PinInput from '../components/PinInput';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';

const SingleTransfer = ({ user, setUser, transactions, setTransactions, pendingBatches, setPendingBatches, balance = 0 }) => {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    // Top Section State
    const [companyName, setCompanyName] = useState(user?.name || '');
    const [productName, setProductName] = useState('');
    const [debitAccount, setDebitAccount] = useState('');
    const [fileTemplate, setFileTemplate] = useState('INTERNAL TRANSFER- STANDARD');

    // Transaction Detail State
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
    const [beneAccNo, setBeneAccNo] = useState('');
    const [beneName, setBeneName] = useState('');
    const [beneAccountTitle, setBeneAccountTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [bankCode, setBankCode] = useState('BOK');
    const [bankNameField, setBankNameField] = useState('');
    const [custRef, setCustRef] = useState('');
    const [ref1, setRef1] = useState('');
    const [purposeOfPayment, setPurposeOfPayment] = useState('RAAST FUND TRANSFER');

    const [error, setError] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);

    // OTP & Confirmation State
    const [openConfirm, setOpenConfirm] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');
    const [success, setSuccess] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleProductChange = (e) => {
        const val = e.target.value;
        setProductName(val);
        if (val === 'INTERNAL FUNDS TRANSFER') {
            setFileTemplate('IFT-STANDARD');
            setBankCode('BOK');
        } else if (val === 'INTER BANK FUNDS TRANSFER') {
            setFileTemplate('IBFT-STANDARD');
            setBankCode('');
        }
    };

    const handleAccountChange = (e) => {
        setDebitAccount(e.target.value);
    };

    const handleVerifyAccount = () => {
        if (!beneAccNo) {
            setError('Please enter an account number to verify.');
            setOpenErrorDialog(true);
            return;
        }

        if (productName === 'INTER BANK FUNDS TRANSFER' && !bankCode) {
            setError('Please select a bank for IBFT verification.');
            setOpenErrorDialog(true);
            return;
        }

        setVerifying(true);
        // Simulate API call to verify account
        setTimeout(() => {
            if (productName === 'INTERNAL FUNDS TRANSFER') {
                // Internal BOK Simulation
                if (beneAccNo.includes('123')) {
                    setBeneAccountTitle('Syed Ahmed Ali');
                    setBeneName('Syed Ahmed Ali');
                } else if (beneAccNo.includes('987')) {
                    setBeneAccountTitle('Innovarge Technologies');
                    setBeneName('Innovarge Technologies');
                } else {
                    setError('BOK Account not found. Please check the number.');
                    setOpenErrorDialog(true);
                    setBeneAccountTitle('');
                }
            } else if (productName === 'INTER BANK FUNDS TRANSFER') {
                // IBFT Simulation
                // In a real scenario, this would call a 1-Link/PayPak API
                if (beneAccNo.length >= 8) {
                    const mockNames = ['Zeeshan Khan', 'Ayesha Bibi', 'Muhammad Usman', 'Fatima Zahra'];
                    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
                    setBeneAccountTitle(randomName);
                    setBeneName(randomName);
                } else {
                    setError('Invalid Account Number format for IBFT.');
                    setOpenErrorDialog(true);
                    setBeneAccountTitle('');
                }
            } else {
                const simulatedTitle = beneName ? beneName.toUpperCase() : 'EXTERNAL CUSTOMER';
                setBeneAccountTitle('VERIFIED: ' + simulatedTitle);
            }
            setVerifying(false);
        }, 1200);
    };

    const handleTransferInit = () => {
        if (!debitAccount || !beneAccNo || !amount || (productName.includes('INTER') && !bankCode)) {
            setError('Please fill in all required fields.');
            setOpenErrorDialog(true);
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0.');
            setOpenErrorDialog(true);
            return;
        }
        if (parseFloat(amount) > balance) {
            setError('Insufficient institution funds.');
            setOpenErrorDialog(true);
            return;
        }
        setError('');
        setOtpInput('');
        setOtpError('');
        setOpenConfirm(true);
    };

    const confirmTransfer = () => {
        if (otpInput !== user.otp) {
            setOtpError('Invalid OTP code.');
            return;
        }

        setProcessing(true);
        const transferAmount = parseFloat(amount);

        setTimeout(() => {
            const newBatch = {
                id: Date.now(),
                maker: user.name,
                makerId: user.userId,
                timestamp: new Date().toLocaleString(),
                totalAmount: transferAmount,
                count: 1,
                customerName: companyName,
                debitAccount: debitAccount,
                productName: productName,
                fileTemplate: fileTemplate,
                fileName: `Single_${beneName}_${Date.now()}.tx`,
                transactions: [
                    {
                        id: Date.now(),
                        date: transactionDate,
                        beneName: beneName,
                        accountNumber: beneAccNo,
                        bank: bankCode || 'BOK',
                        bankName: bankNameField,
                        amount: transferAmount,
                        custRef: custRef,
                        ref1: ref1,
                        purpose: purposeOfPayment,
                        status: 'pending'
                    }
                ],
                status: 'Pending Approval'
            };

            setPendingBatches([...pendingBatches, newBatch]);
            setProcessing(false);
            setOpenConfirm(false);
            setSuccess(true);
        }, 1500);
    };

    const handleDownloadReceipt = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(0, 33, 71); // BOK Dark Blue
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text('Bank of Khyber', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Transaction Acknowledgement Receipt', 105, 30, { align: 'center' });

        // Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleString()}`, 14, 50);
        doc.text(`Reference No: BOK-${Date.now()}`, 14, 55);

        autoTable(doc, {
            startY: 65,
            head: [['Description', 'Details']],
            body: [
                ['Product', productName],
                ['Debit Account', maskAccountNumber(debitAccount)],
                ['Beneficiary Name', beneName],
                ['Beneficiary Account', beneAccNo],
                ['Bank', bankCode || 'BOK'],
                ['Amount', `PKR ${parseFloat(amount || 0).toLocaleString()}`],
                ['Status', 'Submitted for Approval'],
                ['Transaction Date', transactionDate],
                ['Purpose', purposeOfPayment]
            ],
            theme: 'grid',
            headStyles: { fillColor: [0, 33, 71] },
            columnStyles: { 0: { fontStyle: 'bold', width: 50 } }
        });

        doc.setFontSize(8);
        doc.setTextColor(100);
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.text('This is a computer-generated acknowledgement and does not require a signature.', 105, finalY, { align: 'center' });
        doc.text('The transaction is subject to final approval by the authorized checker.', 105, finalY + 5, { align: 'center' });

        doc.save(`BOK_Receipt_${beneName || 'Transfer'}.pdf`);
    };

    const handleReset = () => {
        setBeneAccNo('');
        setBeneName('');
        setBeneAccountTitle('');
        setAmount('');
        setCustRef('');
        setRef1('');
        setBankNameField('');
        setPurposeOfPayment('RAAST FUND TRANSFER');
        if (productName === 'INTER BANK FUNDS TRANSFER') setBankCode('');
    };

    const FormLabel = ({ children, required }) => (
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {children} {required && '*'}
        </Typography>
    );

    const maskAccountNumber = (acc) => {
        if (!acc) return '';
        return acc.substring(0, 4) + '**********' + acc.substring(acc.length - 4);
    };

    return (
        <Container maxWidth={false} sx={{ mt: 3, mb: 5, width: '100%', px: { xs: 2, md: 5 } }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ color: 'text.secondary', textTransform: 'none' }}>
                    Back to Dashboard
                </Button>
                <Typography variant="subtitle2" color="text.secondary">Create Transaction</Typography>
            </Box>

            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>

                {/* Top Section: Basic Info */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <FormLabel>Company Name</FormLabel>
                        <TextField
                            fullWidth
                            size="small"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            sx={{ bgcolor: '#fff' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl fullWidth size="small">
                            <Select value={productName} displayEmpty onChange={handleProductChange} sx={{ bgcolor: '#fff' }}>
                                <MenuItem value="" disabled>Select Account</MenuItem>

                                <MenuItem value="INTERNAL FUNDS TRANSFER">INTERNAL FUNDS TRANSFER</MenuItem>
                                <MenuItem value="INTER BANK FUNDS TRANSFER">INTER BANK FUNDS TRANSFER</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormLabel>Debit Account</FormLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={debitAccount}
                                onChange={handleAccountChange}
                                displayEmpty
                                sx={{ bgcolor: '#fff' }}
                            >
                                <MenuItem value="" disabled>Select Account</MenuItem>
                                {user?.accounts?.map((acc) => (
                                    <MenuItem key={acc.accountNumber} value={acc.accountNumber}>
                                        {maskAccountNumber(acc.accountNumber)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormLabel>File Template</FormLabel>
                        <FormControl fullWidth size="small">
                            <Select value={fileTemplate} onChange={(e) => setFileTemplate(e.target.value)} sx={{ bgcolor: '#fff' }}>
                                <MenuItem value="IFT-STANDARD">IFT-STANDARD</MenuItem>
                                <MenuItem value="IBFT-STANDARD">IBFT-STANDARD</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box sx={{ bgcolor: '#f8f9fa', p: 1, mb: 3, borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">File Transactions Summary</Typography>
                </Box>

                {/* Transaction Detail Section */}
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, borderBottom: '2px solid #002147', display: 'inline-block', pb: 0.5 }}>
                        Transaction Detail
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormLabel>DATEOFREME</FormLabel>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                value={transactionDate}
                                onChange={(e) => setTransactionDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormLabel>Customer Reference No</FormLabel>
                            <TextField
                                fullWidth
                                size="small"
                                value={custRef}
                                onChange={(e) => setCustRef(e.target.value)}
                                placeholder="1 to 100 characters"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormLabel>ACCOUNTNUMBER</FormLabel>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={beneAccNo}
                                    onChange={(e) => setBeneAccNo(e.target.value)}
                                    placeholder="1 to 100 characters"
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ bgcolor: '#002147', textTransform: 'none', px: 3, height: 40 }}
                                    onClick={handleVerifyAccount}
                                    disabled={verifying}
                                >
                                    {verifying ? '...' : 'Verify'}
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormLabel>BENENAME</FormLabel>
                            <TextField
                                fullWidth
                                size="small"
                                value={beneName}
                                onChange={(e) => setBeneName(e.target.value)}
                                placeholder="1 to 100 characters"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormLabel>TRANSAMOUNT</FormLabel>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="1 to 100 characters"
                            />
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <FormLabel>BANK CODE</FormLabel>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                value={bankCode}
                                onChange={(e) => setBankCode(e.target.value)}
                                disabled={productName === 'INTERNAL FUNDS TRANSFER'}
                            >
                                <MenuItem value="" disabled>Select Bank</MenuItem>

                                {banks.map((option) => (
                                    <MenuItem key={option.code} value={option.code}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormLabel>REFERENCE#1</FormLabel>
                            <TextField
                                fullWidth
                                size="small"
                                value={ref1}
                                onChange={(e) => setRef1(e.target.value)}
                                placeholder="1 to 100 characters"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormLabel>PURPOSEOFPAYMENT</FormLabel>
                            <FormControl fullWidth size="small">
                                <Select value={purposeOfPayment} onChange={(e) => setPurposeOfPayment(e.target.value)}>
                                    <MenuItem value="RAAST FUND TRANSFER">RAAST FUND TRANSFER</MenuItem>
                                    <MenuItem value="SALARY PAYMENT">SALARY PAYMENT</MenuItem>
                                    <MenuItem value="VENDOR PAYMENT">VENDOR PAYMENT</MenuItem>
                                    <MenuItem value="OTHER">OTHER</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormLabel>BeneAccTitle</FormLabel>
                            <TextField
                                fullWidth
                                size="small"
                                value={beneAccountTitle}
                                onChange={(e) => setBeneAccountTitle(e.target.value)}
                                placeholder="Title"
                                sx={{ bgcolor: '#f0f4f8' }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                {/* Action Buttons Top */}
                <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'end' }}>
                    <Button variant="contained" size="small" sx={{ bgcolor: '#002147', '&:hover': { bgcolor: '#001a35' }, textTransform: 'none', px: 3 }} onClick={handleTransferInit}>
                        Submit
                    </Button>
                    <Button variant="contained" size="small" sx={{ bgcolor: '#002147', '&:hover': { bgcolor: '#001a35' }, textTransform: 'none', px: 3 }} onClick={handleReset}>
                        Reset
                    </Button>
                </Box>
            </Paper>

            {/* Confirmation & OTP Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: { xs: 300, md: 400 } } }}>
                <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>Confirm Transfer</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ textAlign: 'center', mb: 3 }}>
                        You are about to transfer <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>PKR {parseFloat(amount || 0).toLocaleString()}</Box><br />
                        to <Box component="span" sx={{ fontWeight: 'bold' }}>{beneName}</Box> ({bankCode}) account <Box component="span" sx={{ fontFamily: 'monospace' }}>{beneAccNo}</Box>.
                    </DialogContentText>

                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>Enter 6-Digit OTP</Typography>
                        <Box sx={{ mt: 1, mb: 2 }}>
                            <PinInput
                                length={6}
                                onChange={(val) => {
                                    setOtpInput(val);
                                    setOtpError('');
                                }}
                                error={!!otpError}
                            />
                        </Box>
                        {otpError && <Typography variant="caption" color="error" sx={{ mb: 1 }}>{otpError}</Typography>}
                        <Typography variant="caption" color="text.secondary" align="center">
                            Enter the OTP code sent to your registered mobile number.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit" variant="outlined" sx={{ minWidth: 100 }}>Cancel</Button>
                    <Button onClick={confirmTransfer} variant="contained" sx={{ minWidth: 100, bgcolor: '#002147' }} disabled={processing}>
                        {processing ? 'Submitting...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={success} onClose={() => navigate('/dashboard')} PaperProps={{ sx: { borderRadius: 3, p: 3, textAlign: 'center', minWidth: 320 } }}>
                <Box sx={{ color: 'success.main', mb: 2 }}>
                    <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#E6FCF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        <Typography variant="h4">✓</Typography>
                    </Box>
                </Box>
                <DialogTitle sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1.5rem', p: 0, mb: 1 }}>Submitted for Approval</DialogTitle>
                <DialogContentText sx={{ mb: 3 }}>
                    Your single transfer request has been submitted successfully and is now awaiting checker approval.
                </DialogContentText>
                <DialogActions sx={{ justifyContent: 'center', p: 0, mt: 3, flexDirection: 'column', gap: 2 }}>
                    <Button
                        onClick={handleDownloadReceipt}
                        variant="outlined"
                        color="success"
                        fullWidth
                        startIcon={<DownloadIcon />}
                        sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        Download Receipt (PDF)
                    </Button>
                    <Button
                        onClick={() => navigate('/dashboard')}
                        variant="contained"
                        color="success"
                        size="large"
                        fullWidth
                        sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        Return to Dashboard
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" color="error" fontWeight="bold">Error</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>{error}</Typography>
                    <Button fullWidth variant="contained" onClick={() => setOpenErrorDialog(false)} color="error">OK</Button>
                </Box>
            </Dialog>
        </Container>
    );
};

export default SingleTransfer;