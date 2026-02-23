import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    IconButton,
    Chip,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    Add as AddIcon,
    Business as BusinessIcon,
    PersonAdd as PersonAddIcon,
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';

const CorporateManagement = ({ institutions, setInstitutions, users, setUsers }) => {
    const [openInstDialog, setOpenInstDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedInst, setSelectedInst] = useState(null);

    const [newInst, setNewInst] = useState({ name: '', type: 'Corporate', status: 'Active' });
    const [newUser, setNewUser] = useState({ name: '', userId: '', role: 'Maker', email: '', status: 'Active' });

    const [editingInst, setEditingInst] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    const handleOpenInstDialog = (inst = null) => {
        if (inst) {
            setEditingInst(inst);
            setNewInst({ name: inst.name, type: inst.type, status: inst.status || 'Active' });
        } else {
            setEditingInst(null);
            setNewInst({ name: '', type: 'Corporate', status: 'Active' });
        }
        setOpenInstDialog(true);
    };

    const handleOpenUserDialog = (user = null) => {
        if (user) {
            setEditingUser(user);
            setNewUser({
                name: user.name,
                userId: user.userId,
                role: user.hierarchy || 'Maker',
                email: user.email,
                status: user.status || 'Active'
            });
        } else {
            setEditingUser(null);
            setNewUser({ name: '', userId: '', role: 'Maker', email: '', status: 'Active' });
        }
        setOpenUserDialog(true);
    };

    const handleSaveInst = () => {
        if (editingInst) {
            setInstitutions(institutions.map(i => i.id === editingInst.id ? { ...i, ...newInst } : i));
        } else {
            const id = `INST00${institutions.length + 1}`;
            const inst = { ...newInst, id, status: 'Active', onboardedDate: new Date().toISOString().split('T')[0] };
            setInstitutions([...institutions, inst]);
        }
        setOpenInstDialog(false);
        setEditingInst(null);
        setNewInst({ name: '', type: 'Corporate' });
    };

    const handleSaveUser = () => {
        if (editingUser) {
            setUsers(users.map(u => u.userId === editingUser.userId ? { ...u, ...newUser, hierarchy: newUser.role } : u));
        } else {
            const user = {
                ...newUser,
                institutionId: selectedInst.id,
                password: '123',
                role: 'user',
                hierarchy: newUser.role
            };
            setUsers([...users, user]);
        }
        setOpenUserDialog(false);
        setEditingUser(null);
        setNewUser({ name: '', userId: '', role: 'Maker', email: '' });
    };

    const deleteInst = (id) => {
        setInstitutions(institutions.filter(i => i.id !== id));
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f5f7f9', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BusinessIcon sx={{ fontSize: 40 }} />
                    Corporate Onboarding
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenInstDialog()}
                    sx={{ '&:hover': { bgcolor: '#143d30' }, borderRadius: 2 }}
                >
                    Onboard New Institution
                </Button>
            </Box>

            <Grid item spacing={3}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Institution ID</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Onboarded Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {institutions.map((inst) => (
                                    <TableRow key={inst.id} hover>
                                        <TableCell sx={{ fontWeight: 600, color: '#1a4f3e' }}>{inst.id}</TableCell>
                                        <TableCell>{inst.name}</TableCell>
                                        <TableCell>
                                            <Chip label={inst.type} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={inst.status}
                                                size="small"
                                                sx={{
                                                    bgcolor: inst.status === 'Active' ? '#e8f5e9' : '#ffebee',
                                                    color: inst.status === 'Active' ? '#2e7d32' : '#c62828',
                                                    fontWeight: 700
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{inst.onboardedDate}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{ mr: 1, borderRadius: 2 }}
                                                onClick={() => setSelectedInst(inst)}
                                            >
                                                Manage Hierarchy
                                            </Button>
                                            <IconButton color="primary" onClick={() => handleOpenInstDialog(inst)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => deleteInst(inst.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {selectedInst && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, borderRadius: 3, borderLeft: '6px solid ', mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a4f3e' }}>
                                        User Hierarchy: {selectedInst.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Define Makers, Checkers, and Approvers for this corporation
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => handleOpenUserDialog()}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Hierarchy User
                                </Button>
                            </Box>

                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>User ID</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Corporation Role (Hierarchy)</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.filter(u => u.institutionId === selectedInst.id).map(u => (
                                            <TableRow key={u.userId}>
                                                <TableCell>{u.userId}</TableCell>
                                                <TableCell>{u.name}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={u.hierarchy || 'Maker'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: (u.hierarchy === 'Checker/Approver' ? '#e3f2fd' : '#f1f8e9'),
                                                            color: (u.hierarchy === 'Checker/Approver' ? '#1565c0' : '#2e7d32'),
                                                            fontWeight: 700
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={u.status || 'Active'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: (u.status === 'Inactive' ? '#f5f5f5' : '#e8f5e9'),
                                                            color: (u.status === 'Inactive' ? '#9e9e9e' : '#2e7d32'),
                                                            fontWeight: 700
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="primary" onClick={() => handleOpenUserDialog(u)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => setUsers(users.filter(user => user.userId !== u.userId))}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ mt: 3 }}>
                                <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedInst(null)}>
                                    Clear Selection
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Institution Dialog */}
            <Dialog open={openInstDialog} onClose={() => setOpenInstDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 700 }}>{editingInst ? 'Edit Institution' : 'Onboard New Institution'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Institution Name"
                            variant="outlined"
                            value={newInst.name}
                            onChange={(e) => setNewInst({ ...newInst, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Institution Type"
                            value={newInst.type}
                            onChange={(e) => setNewInst({ ...newInst, type: e.target.value })}
                        >
                            <MenuItem value="Corporate">Corporate</MenuItem>
                            <MenuItem value="FSP">FSP (Financial Service Provider)</MenuItem>
                            <MenuItem value="SME">SME</MenuItem>
                            <MenuItem value="Government">Government</MenuItem>
                        </TextField>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newInst.status === 'Active'}
                                    onChange={(e) => setNewInst({ ...newInst, status: e.target.checked ? 'Active' : 'Inactive' })}
                                    color="success"
                                />
                            }
                            label={newInst.status === 'Active' ? "Institution is Active" : "Institution is Inactive"}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenInstDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveInst} disabled={!newInst.name} sx={{ bgcolor: '#1a4f3e' }}>
                        {editingInst ? 'Update Institution' : 'Create Institution'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* User Dialog */}
            <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 700 }}>{editingUser ? 'Edit Hierarchy User' : 'Add Hierarchy User'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="User ID"
                            value={newUser.userId}
                            onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
                            disabled={!!editingUser}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Hierarchy Role"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <MenuItem value="Maker">Maker</MenuItem>
                            <MenuItem value="Checker/Approver">Checker/Approver</MenuItem>
                        </TextField>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newUser.status === 'Active'}
                                    onChange={(e) => setNewUser({ ...newUser, status: e.target.checked ? 'Active' : 'Inactive' })}
                                    color="success"
                                />
                            }
                            label={newUser.status === 'Active' ? "User is Active" : "User is Inactive"}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveUser} disabled={!newUser.userId} sx={{ bgcolor: '#1a4f3e' }}>
                        {editingUser ? 'Update User' : 'Add User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CorporateManagement;
