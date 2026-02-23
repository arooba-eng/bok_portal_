import React, { useState, useRef } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Fade,
    Zoom,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Link,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as XLSX from 'xlsx';
import PinInput from '../components/PinInput';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';

const BulkTransfer = ({ user, setUser, transactions, setTransactions, pendingBatches, setPendingBatches }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [localTransactions, setLocalTransactions] = useState([]);
    const [fileName, setFileName] = useState('');
    const [processing, setProcessing] = useState(false);

    // OTP & Confirmation State
    const [openConfirm, setOpenConfirm] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isProcessed, setIsProcessed] = useState(false);

    // Alert State
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Pre-filled form state
    const [customerName, setCustomerName] = useState('');
    const [productName, setProductName] = useState('Internal Fund Transfer');
    const [fileTemplate, setFileTemplate] = useState('Internal Transfer-Standard');
    const [debitAccount, setDebitAccount] = useState('');
    const [currentBalance, setCurrentBalance] = useState(0);

    const maskAccountNumber = (acc) => {
        if (!acc) return '';
        return acc.substring(0, 4) + '**********' + acc.substring(acc.length - 4);
    };

    const handleAccountChange = (e) => {
        const accNo = e.target.value;
        setDebitAccount(accNo);
        // "fetch the customer name which is me"
        setCustomerName(user?.name || '');

        // Find balance for the selected account
        const selectedAcc = user?.accounts?.find(a => a.accountNumber === accNo);
        if (selectedAcc) {
            setCurrentBalance(selectedAcc.balance);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            // header: 1 returns data as an array of arrays
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

            const isIBFT = productName === 'Inter Bank Fund Transfer';

            const parsedData = data.slice(1).map((row, index) => {
                if (!row || row.length === 0) return null;

                if (isIBFT) {
                    // IBFT Mapping based on your provided file
                    return {
                        // id: index,
                        date: row[0],
                        custRef: row[1],
                        accountNumber: row[2],
                        beneName: row[3],
                        amount: row[4], // <--- Fixed: TRANSAMOUNT is at Index 4
                        bank: row[5],
                        bankCode: row[6],
                        ref1: row[7],
                        purpose: row[8],
                        beneTitle: row[9],
                        status: 'pending'
                    };
                } else {
                    // IFT Mapping based on your provided file
                    return {
                        id: index,
                        date: row[0],
                        accountNumber: row[1],
                        beneName: row[2],
                        amount: row[3], // <--- Fixed: TRANSAMOUNT is at Index 3
                        bankCode: row[4],
                        custRef: row[5],
                        bank: 'BOK',
                        status: 'pending'
                    };
                }
            }).filter(row => row !== null && row.accountNumber && row.amount);

            setLocalTransactions(parsedData);
        };
        reader.readAsBinaryString(file);
    };
    const handleProcessClick = () => {
        // Calculate total amount
        const totalAmount = localTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

        if (totalAmount > user.balance) {
            setAlertMessage("Insufficient funds for bulk transfer!");
            setOpenAlert(true);
            return;
        }

        setOtpInput('');
        setOtpError('');
        setOpenConfirm(true);
        setIsProcessed(true)
    };

    const confirmTransfer = () => {
        // Validate OTP
        if (otpInput !== user.otp) {
            setOtpError('Invalid OTP code.');
            return;
        }

        setProcessing(true);
        const totalAmount = localTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

        setTimeout(() => {
            // Create a new batch for Checker approval
            const newBatch = {
                id: Date.now(),
                maker: user.name,
                makerId: user.userId,
                timestamp: new Date().toLocaleString(),
                totalAmount: totalAmount,
                count: localTransactions.length,
                customerName: customerName,
                debitAccount: debitAccount,
                productName: productName,
                fileTemplate: fileTemplate,
                fileName: fileName,
                transactions: [...localTransactions],
                status: 'Pending Approval'
            };

            setPendingBatches([...pendingBatches, newBatch]);

            setProcessing(false);
            setOpenConfirm(false);
            setSuccess(true);
        }, 1500);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Add Header
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102); // BOK Blue
        doc.text('Bank of Khyber - Bulk Transfer Report', 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Batch Size: ${localTransactions.length} items`, 14, 35);

        // Add Table
        const tableData = localTransactions.map(tx => [
            tx.bankName,
            tx.iban,
            `PKR ${parseFloat(tx.amount).toLocaleString()}`,
            tx.status.toUpperCase()
        ]);

        autoTable(doc, {
            startY: 45,
            head: [['Bank Name', 'IBAN / Account', 'Amount', 'Status']],
            body: tableData,
            headStyles: { fillColor: [0, 51, 102] },
            theme: 'striped'
        });

        const totalAmount = localTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
        const finalY = (doc).lastAutoTable.finalY + 10;

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Processed Amount: PKR ${totalAmount.toLocaleString()}`, 14, finalY);

        doc.save(`Bulk_Transfer_Report_${Date.now()}.pdf`);
    };

    const handleCloseSuccess = () => {
        setSuccess(false);
        setLocalTransactions([]);
        setFileName('');
        navigate('/dashboard');
    }

    return (
        <Container maxWidth={false} sx={{ mt: 5, mb: 10, width: '100%', px: { xs: 2, md: 5 } }}>
            <Box sx={{ mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ color: 'text.secondary' }}>
                    Back to Dashboard
                </Button>
            </Box>

            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 4, minHeight: 400 }}>
                {/* New Form Top Section */}
                <Grid container spacing={3} sx={{ mb: 4, alignItems: 'flex-start', width: '100%', }}>
                    {/* Row 1: All inputs in one row */}
                    <Grid item xs={12} sm={6} md={3} >
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Customer Name:
                        </Typography>
                        <TextField

                            size="small"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Customer Name"
                            sx={{ bgcolor: '#fff', borderRadius: 1 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            File Template:
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                value={fileTemplate}
                                onChange={(e) => setFileTemplate(e.target.value)}
                                sx={{ bgcolor: '#fff', borderRadius: 1 }}
                            >
                                <MenuItem value="Internal Transfer-Standard">Internal Transfer-Standard</MenuItem>
                                <MenuItem value="Inter Bank Fund Transfer-Standard">Inter Bank Fund Transfer-Standard</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Product Name:
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                sx={{ bgcolor: '#fff', borderRadius: 1 }}
                            >
                                <MenuItem value="Internal Fund Transfer">Internal Fund Transfer</MenuItem>
                                <MenuItem value="Inter Bank Fund Transfer">Inter Bank Fund Transfer</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Debit Account:
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                value={debitAccount}
                                onChange={handleAccountChange}
                                displayEmpty
                                sx={{ bgcolor: '#fff', borderRadius: 1 }}
                            >
                                <MenuItem value="" disabled>Select Account</MenuItem>
                                {user?.accounts?.map((acc) => (
                                    <MenuItem key={acc.accountNumber} value={acc.accountNumber}>
                                        {maskAccountNumber(acc.accountNumber)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ minHeight: '20px' }}>
                            <Link
                                component="button"
                                variant="caption"
                                onClick={() => {
                                    if (!debitAccount) {
                                        setAlertMessage("Please select a debit account first.");
                                    } else {
                                        setAlertMessage(`Current Balance for ${debitAccount}: PKR ${currentBalance.toLocaleString()}`);
                                    }
                                    setOpenAlert(true);
                                }}
                                sx={{ mt: 0.5, display: 'block', textAlign: 'left', textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
                            >
                                Balance Check
                            </Link>
                        </Box>
                    </Grid>


                </Grid>
                {/* Row 2: Upload Section Full Width */}
                <Grid item xs={12} md={10} sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Upload File:
                    </Typography>
                    <Box sx={{
                        border: '1px solid #ced4da',
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        bgcolor: '#fff',
                        height: '42px'
                    }}>
                        <Box sx={{
                            px: 2,
                            color: 'text.secondary',
                            flexGrow: 1,
                            fontSize: '0.875rem'
                        }}>
                            {fileName || 'Upload File'}
                        </Box>
                        <Button
                            variant="contained"
                            onClick={() => fileInputRef.current.click()}
                            sx={{
                                borderRadius: 0,
                                bgcolor: '#002147',
                                '&:hover': { bgcolor: '#001a35' },
                                boxShadow: 'none',
                                textTransform: 'none',
                                height: '100%',
                                px: 4
                            }}
                        >
                            Select File
                        </Button>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                    </Box>
                </Grid>
                <Box sx={{ borderBottom: '1px solid #DEE2E6', mb: 3 }} />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>Recent Uploaded File(s)</Typography>
                </Box>

                {fileName && (
                    <Fade in={true}>
                        <Chip
                            label={`Selected File: ${fileName}`}
                            onDelete={() => { setFileName(''); setLocalTransactions([]); }}
                            sx={{ mb: 3, bgcolor: '#F1F3F5', fontWeight: 500, alignSelf: 'flex-start' }}
                        />
                    </Fade>
                )}

                {localTransactions.length > 0 && (
                    <Fade in={localTransactions.length > 0} timeout={800}>
                        <Box>
                            <TableContainer sx={{ maxHeight: 600, border: '1px solid #DEE2E6', borderRadius: 3 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Customer Ref</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Account Number</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Beneficiary Name</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Bank</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Bank Code</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Ref#1</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Purpose</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {localTransactions.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell sx={{ fontSize: '0.7rem' }}>{row.date}</TableCell>
                                                <TableCell sx={{ fontSize: '0.7rem' }}>{row.custRef}</TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{row.accountNumber}</TableCell>
                                                <TableCell sx={{ fontWeight: 500, fontSize: '0.75rem' }}>{row.beneName}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{parseFloat(row.amount).toLocaleString()}</TableCell>
                                                <TableCell sx={{ fontSize: '0.7rem' }}>{row.bank}</TableCell>
                                                <TableCell sx={{ fontSize: '0.7rem' }}>{row.bankCode}</TableCell>
                                                <TableCell sx={{ fontSize: '0.7rem' }}>{row.ref1 || '-'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.7rem' }}>{row.purpose || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                {isProcessed && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                        startIcon={<DownloadIcon />}
                                        onClick={handleDownloadPDF}
                                        sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }}
                                    >
                                        Download Report (PDF)
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    color={isProcessed ? "inherit" : "success"}
                                    size="large"
                                    onClick={isProcessed ? handleCloseSuccess : handleProcessClick}
                                    disabled={processing}
                                    sx={{ minWidth: 240, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
                                >
                                    {processing ? 'Processing...' : isProcessed ? 'Done' : `Process (${localTransactions.length})`}
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Paper>

            {/* Process & FPIN Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: { xs: 300, md: 400 } } }}>
                <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>Process Bulk Transfer</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ textAlign: 'center', mb: 3 }}>
                        You are about to process <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{localTransactions.length} transactions</Box><br />
                        Total Amount: <Box component="span" sx={{ fontWeight: 'bold' }}>PKR {localTransactions.reduce((a, b) => a + parseFloat(b.amount || 0), 0).toLocaleString()}</Box>
                    </DialogContentText>

                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5, color: 'text.primary' }}>Enter 6-Digit OTP</Typography>
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
                        {otpError && (
                            <Typography variant="caption" color="error" sx={{ mb: 1 }}>
                                {otpError}
                            </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" align="center" display="block">
                            Enter the OTP code sent to your registered mobile number authorize this batch.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit" variant="outlined" sx={{ minWidth: 100 }}>Cancel</Button>
                    <Button onClick={confirmTransfer} variant="contained" sx={{ minWidth: 100 }} disabled={processing}>
                        {processing ? 'Processing...' : 'Process'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alert Dialog */}
            <Dialog open={openAlert} onClose={() => setOpenAlert(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" color="error" fontWeight="bold">Alert</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                        {alertMessage}
                    </Typography>
                    <Button fullWidth variant="contained" onClick={() => setOpenAlert(false)} color="error">
                        OK
                    </Button>
                </Box>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={success} onClose={handleCloseSuccess} PaperProps={{ sx: { borderRadius: 3, p: 3, textAlign: 'center', minWidth: 320 } }}>
                <Box sx={{ color: 'success.main', mb: 2 }}>
                    <Zoom in={success}>
                        <Box sx={{
                            width: 60, height: 60, borderRadius: '50%', bgcolor: '#E6FCF5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                        }}>
                            <Typography variant="h4">✓</Typography>
                        </Box>
                    </Zoom>
                </Box>
                <DialogTitle sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1.5rem', p: 0, mb: 1 }}>Batch Processed</DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <DialogContentText sx={{ mb: 3 }}>
                        All valid transactions have been processed successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', p: 0, mt: 3, flexDirection: 'column', gap: 2 }}>
            
                    <Button onClick={() => setSuccess(false)} variant="contained" color="success" size="large" fullWidth>
                       OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BulkTransfer;