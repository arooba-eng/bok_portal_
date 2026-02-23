import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Grid,
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
    IconButton,
    TextField,
    Alert,
    Snackbar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PinInput from '../components/PinInput';

const BulkApproval = ({ user, setUser, transactions, setTransactions, pendingBatches, setPendingBatches, balance = 0, updateBalance }) => {
    const navigate = useNavigate();

    const [selectedBatch, setSelectedBatch] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [repairDialogOpen, setRepairDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [isBulkAction, setIsBulkAction] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    // Menu state
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeBatch, setActiveBatch] = useState(null);

    const handleMenuOpen = (event, batch) => {
        setAnchorEl(event.currentTarget);
        setActiveBatch(batch);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveBatch(null);
    };

    const handleAction = (type) => {
        const batch = activeBatch;
        handleMenuClose();
        if (type === 'view') handleViewBatch(batch);
        if (type === 'approve') handleConfirmRequest(batch);
        if (type === 'repair') handleRepairRequest(batch);
        if (type === 'reject') handleRejectRequest(batch);
    };

    // OTP State
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');
    const [processing, setProcessing] = useState(false);

    // Repair State
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Notification
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const showMessage = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleViewBatch = (batch) => {
        setSelectedBatch(batch);
        setViewDialogOpen(true);
    };

    const handleConfirmRequest = (batch) => {
        setSelectedBatch(batch);
        setOtpInput('');
        setOtpError('');
        setConfirmDialogOpen(true);
    };

    const handleRejectRequest = (batch) => {
        setSelectedBatch(batch);
        setRejectDialogOpen(true);
    };

    const handleRepairRequest = (batch) => {
        setSelectedBatch(batch);
        setRepairDialogOpen(true);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(pendingBatches.map(b => b.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        setIsBulkAction(true);
        setOtpInput('');
        setOtpError('');
        setConfirmDialogOpen(true);
    };

    const handleBulkReject = () => {
        if (selectedIds.length === 0) return;
        setIsBulkAction(true);
        setRejectDialogOpen(true);
    };

    const handleEditTransaction = (tx) => {
        setEditingTransaction(tx);
        setEditFormData({ ...tx });
    };

    const saveEditedTransaction = () => {
        const updatedTransactions = selectedBatch.transactions.map(t =>
            t.id === editingTransaction.id ? { ...editFormData } : t
        );

        // Update batch in local state
        const updatedBatch = {
            ...selectedBatch,
            transactions: updatedTransactions,
            totalAmount: updatedTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
        };

        setSelectedBatch(updatedBatch);

        // Update in global pendingBatches
        setPendingBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));

        setEditingTransaction(null);
        showMessage('Transaction updated successfully');
    };

    const processConfirm = () => {
        if (otpInput !== user.otp) {
            setOtpError('Invalid OTP code.');
            return;
        }

        const batchesToProcess = isBulkAction
            ? pendingBatches.filter(b => selectedIds.includes(b.id))
            : [selectedBatch];

        const totalToDeduct = batchesToProcess.reduce((sum, b) => sum + b.totalAmount, 0);

        setProcessing(true);
        setTimeout(() => {
            if (totalToDeduct > balance) {
                setOtpError('Insufficient institution balance to process selected transaction(s).');
                setProcessing(false);
                return;
            }

            // Update shared institution balance via App.js function
            updateBalance(totalToDeduct);

            const newHistoryItems = [];
            batchesToProcess.forEach(batch => {
                batch.transactions.forEach((tx, idx) => {
                    newHistoryItems.push({
                        id: Date.now() + Math.random(),
                        date: new Date().toISOString().split('T')[0],
                        description: `${batch.productName} to ${tx.beneName} (${tx.accountNumber})`,
                        amount: -parseFloat(tx.amount),
                        type: 'debit',
                        reference: tx.custRef || tx.ref1
                    });
                });
            });

            setTransactions([...transactions, ...newHistoryItems]);

            const processedIds = batchesToProcess.map(b => b.id);
            setPendingBatches(prev => prev.filter(b => !processedIds.includes(b.id)));

            setSelectedIds([]);
            setProcessing(false);
            setConfirmDialogOpen(false);
            setViewDialogOpen(false);
            setIsBulkAction(false);
            showMessage(`${batchesToProcess.length} transaction(s) processed successfully`);
        }, 1500);
    };

    const processReject = () => {
        const idsToRemove = isBulkAction ? selectedIds : [selectedBatch.id];
        setPendingBatches(prev => prev.filter(b => !idsToRemove.includes(b.id)));

        setSelectedIds([]);
        setRejectDialogOpen(false);
        setViewDialogOpen(false);
        setIsBulkAction(false);
        showMessage(`${idsToRemove.length} transaction(s) rejected`, 'info');
    };

    return (
        <Container maxWidth={false} sx={{ mt: 5, mb: 10, width: '100%', px: { xs: 2, md: 5 } }}>
            <Box sx={{ mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ color: 'text.secondary' }}>
                    Back to Dashboard
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Transfer Approvals</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Review and process transfer requests submitted by makers.
                    </Typography>
                </Box>
                {selectedIds.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 2, bgcolor: '#f0f4f8', p: 2, borderRadius: 2, border: '1px solid #d0e2ff' }}>
                        <Typography variant="body2" color="primary.main" fontWeight="bold" sx={{ alignSelf: 'center' }}>
                            {selectedIds.length} item(s) selected
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={handleBulkApprove}
                            startIcon={<CheckCircleOutlineIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            Approve Selected
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={handleBulkReject}
                            startIcon={<CancelOutlinedIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            Reject Selected
                        </Button>
                    </Box>
                )}
            </Box>

            <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #eee' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < pendingBatches.length}
                                        checked={pendingBatches.length > 0 && selectedIds.length === pendingBatches.length}
                                        onChange={handleSelectAll}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Submission Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Maker</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>File / Ref Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Count</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingBatches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                        <Typography color="text.secondary">No pending batches found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingBatches.map((batch) => (
                                    <TableRow key={batch.id} hover selected={selectedIds.includes(batch.id)}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedIds.includes(batch.id)}
                                                onChange={() => handleSelectOne(batch.id)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{batch.timestamp}</TableCell>
                                        <TableCell>{batch.maker}</TableCell>
                                        <TableCell>{batch.fileName}</TableCell>
                                        <TableCell>{batch.productName}</TableCell>
                                        <TableCell>{batch.count}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>PKR {batch.totalAmount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Chip label={batch.status} size="small" color="warning" variant="outlined" sx={{ fontWeight: 600 }} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, batch)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: { minWidth: 150, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 }
                    }}
                >
                    <MenuItem onClick={() => handleAction('view')}>
                        <ListItemIcon><VisibilityOutlinedIcon fontSize="small" /></ListItemIcon>
                        <ListItemText primary="View Details" />
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('approve')} sx={{ color: 'success.main' }}>
                        <ListItemIcon><CheckCircleOutlineIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="Approve" />
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('repair')} sx={{ color: 'info.main' }}>
                        <ListItemIcon><BuildOutlinedIcon fontSize="small" color="info" /></ListItemIcon>
                        <ListItemText primary="Repair" />
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('reject')} sx={{ color: 'error.main' }}>
                        <ListItemIcon><CancelOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
                        <ListItemText primary="Reject" />
                    </MenuItem>
                </Menu>
            </Paper>

            {/* Batch Detail View Dialog */}
            < Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth >
                <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                    Batch Details - {selectedBatch?.fileName}
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={3}>
                            <Typography variant="caption" color="text.secondary">Customer Name</Typography>
                            <Typography variant="body1" fontWeight="500">{selectedBatch?.customerName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="caption" color="text.secondary">Debit Account</Typography>
                            <Typography variant="body1" fontWeight="500">{selectedBatch?.debitAccount}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="caption" color="text.secondary">Product Type</Typography>
                            <Typography variant="body1" fontWeight="500">{selectedBatch?.productName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                            <Typography variant="body1" fontWeight="bold" color="primary">PKR {selectedBatch?.totalAmount.toLocaleString()}</Typography>
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Transactions</Typography>
                    <TableContainer sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#fafafa' }}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Bene Name</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Account Number</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Bank</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Amount</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Reference</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedBatch?.transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell sx={{ fontSize: '0.8125rem' }}>{tx.beneName}</TableCell>
                                        <TableCell sx={{ fontSize: '0.8125rem' }}>{tx.accountNumber}</TableCell>
                                        <TableCell sx={{ fontSize: '0.8125rem' }}>{tx.bank}</TableCell>
                                        <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 'bold' }}>{parseFloat(tx.amount).toLocaleString()}</TableCell>
                                        <TableCell sx={{ fontSize: '0.8125rem' }}>{tx.custRef || tx.ref1 || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 2 }}>
                    <Button onClick={() => setViewDialogOpen(false)} color="inherit">Close</Button>
                    <Button variant="contained" color="error" onClick={() => handleRejectRequest(selectedBatch)}>Reject</Button>
                    <Button variant="contained" color="info" onClick={() => handleRepairRequest(selectedBatch)}>Repair</Button>
                    <Button variant="contained" color="success" onClick={() => { setIsBulkAction(false); handleConfirmRequest(selectedBatch); }}>Approve & Process</Button>
                </DialogActions>
            </Dialog >

            {/* Repair Modal (Edit Batch) */}
            < Dialog open={repairDialogOpen} onClose={() => setRepairDialogOpen(false)} maxWidth="md" fullWidth >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Repair Batch: {selectedBatch?.fileName}</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 3 }}>Edit transaction details below to correct any errors.</Alert>

                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Beneficiary</TableCell>
                                    <TableCell>Account</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Reference</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedBatch?.transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        {editingTransaction?.id === tx.id ? (
                                            <>
                                                <TableCell><TextField size="small" value={editFormData.beneName} onChange={(e) => setEditFormData({ ...editFormData, beneName: e.target.value })} /></TableCell>
                                                <TableCell><TextField size="small" value={editFormData.accountNumber} onChange={(e) => setEditFormData({ ...editFormData, accountNumber: e.target.value })} /></TableCell>
                                                <TableCell><TextField size="small" type="number" value={editFormData.amount} onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })} /></TableCell>
                                                <TableCell><TextField size="small" value={editFormData.custRef || editFormData.ref1 || ''} onChange={(e) => setEditFormData({ ...editFormData, custRef: e.target.value })} /></TableCell>
                                                <TableCell align="center">
                                                    <Button size="small" variant="contained" onClick={saveEditedTransaction}>Save</Button>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>{tx.beneName}</TableCell>
                                                <TableCell>{tx.accountNumber}</TableCell>
                                                <TableCell>{parseFloat(tx.amount).toLocaleString()}</TableCell>
                                                <TableCell>{tx.custRef || tx.ref1 || '-'}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" color="primary" onClick={() => handleEditTransaction(tx)}>
                                                        <EditIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRepairDialogOpen(false)} variant="contained">Done</Button>
                </DialogActions>
            </Dialog >

            {/* OTP Confirmation Dialog */}
            < Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 400 } }}>
                <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
                    {isBulkAction ? 'Authorize Bulk Approval' : 'Authorize Process'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ textAlign: 'center', mb: 3 }}>
                        {isBulkAction ? (
                            <>
                                Total Items: <Box component="span" sx={{ fontWeight: 'bold' }}>{selectedIds.length}</Box><br />
                                Total Volume: <Box component="span" sx={{ fontWeight: 'bold' }}>PKR {pendingBatches.filter(b => selectedIds.includes(b.id)).reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</Box>
                            </>
                        ) : (
                            <>
                                Batch: <Box component="span" sx={{ fontWeight: 'bold' }}>{selectedBatch?.fileName}</Box><br />
                                Total Volume: <Box component="span" sx={{ fontWeight: 'bold' }}>PKR {selectedBatch?.totalAmount.toLocaleString()}</Box>
                            </>
                        )}
                    </DialogContentText>

                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>Enter 6-Digit OTP</Typography>
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
                            Authorize this transaction with your security PIN.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="inherit" variant="outlined">Cancel</Button>
                    <Button onClick={processConfirm} variant="contained" disabled={processing}>
                        {processing ? 'Processing...' : 'Confirm Approval'}
                    </Button>
                </DialogActions>
            </Dialog >

            {/* Reject Confirmation */}
            < Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>{isBulkAction ? `Reject ${selectedIds.length} Items?` : 'Reject Batch?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {isBulkAction
                            ? `Are you sure you want to reject all ${selectedIds.length} selected items? This will remove them from the pending queue.`
                            : `Are you sure you want to reject batch "${selectedBatch?.fileName}"? This will remove it from the pending queue.`
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={processReject}>
                        {isBulkAction ? 'Reject All Selected' : 'Reject Batch'}
                    </Button>
                </DialogActions>
            </Dialog >

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container >
    );
};

export default BulkApproval;
