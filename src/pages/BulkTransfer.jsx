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
    Zoom
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import PinInput from '../components/PinInput';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';

const BulkTransfer = ({ user, setUser, transactions, setTransactions }) => {
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
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

            // Fix: Mapped indices based on user request (IBAN, Bank, Amount)
            // Assuming Excel structure: Column A = IBAN, Column B = Bank Name, Column C = Amount
            const parsedData = data.slice(1).map((row, index) => ({
                id: index,
                iban: row[0],
                bankName: row[1], // Swapped from row[2] based on user feedback
                amount: row[2],   // Swapped from row[1] based on user feedback
                status: 'pending'
            })).filter(row => row.iban && row.amount);

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
            // 2. Update Global Balance
            const newBalance = user.balance - totalAmount;
            setUser({ ...user, balance: newBalance });

            // 3. Add to Global History
            const newHistoryItems = localTransactions.map((tx, index) => ({
                id: Date.now() + index,
                date: new Date().toISOString().split('T')[0],
                description: `Bulk Transfer to ${tx.bankName} (${tx.iban})`,
                amount: -parseFloat(tx.amount),
                type: 'debit'
            }));
            setTransactions([...transactions, ...newHistoryItems]);

            // Update local statuses
            setLocalTransactions(prev => prev.map(tx => ({ ...tx, status: 'Success' })));
            setIsProcessed(true);

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

            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 4, minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: !localTransactions.length ? 'center' : 'flex-start' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom fontWeight="bold">Bulk Fund Transfer</Typography>
                        <Typography variant="subtitle1" color="text.secondary">Upload an Excel file to review and process multiple transfers.</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<CloudUploadIcon />}
                            onClick={() => fileInputRef.current.click()}
                            sx={{ borderRadius: 3, px: 4, py: 1.5 }}
                        >
                            Upload Excel File
                        </Button>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                    </Box>
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
                                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Bank</TableCell>
                                            <TableCell sx={{ fontWeight: 600, py: 2 }}>IBAN / Account</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Amount</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {localTransactions.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.bankName}</TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{row.iban}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>{parseFloat(row.amount).toLocaleString()}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={row.status}
                                                        size="small"
                                                        color={row.status === 'Success' ? 'success' : 'default'}
                                                        variant={row.status === 'Success' ? 'filled' : 'outlined'}
                                                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                                    />
                                                </TableCell>
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
                                    {processing ? 'Processing...' : isProcessed ? 'Done' : `Confirm & Process (${localTransactions.length})`}
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Paper>

            {/* Confirmation & FPIN Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: { xs: 300, md: 400 } } }}>
                <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>Confirm Bulk Transfer</DialogTitle>
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
                        {processing ? 'Processing...' : 'Confirm'}
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
                    <Button onClick={handleDownloadPDF} variant="outlined" color="primary" size="large" fullWidth startIcon={<DownloadIcon />}>
                        Download Transaction Receipt
                    </Button>
                    <Button onClick={() => setSuccess(false)} variant="contained" color="success" size="large" fullWidth>
                        View Status Table
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BulkTransfer;