import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SingleTransfer from './pages/SingleTransfer';
import BulkTransfer from './pages/BulkTransfer';
import BulkApproval from './pages/BulkApproval';
import CorporateManagement from './pages/CorporateManagement';
import Layout from './components/Layout';
import { initialTransactions, users as initialUsers, initialInstitutions } from './data/mockData';

function App() {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(initialUsers);
    const [institutions, setInstitutions] = useState(initialInstitutions);
    const [transactions, setTransactions] = useState(initialTransactions);
    const [pendingBatches, setPendingBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const storedBatches = localStorage.getItem('pendingBatches');
        if (storedBatches) {
            setPendingBatches(JSON.parse(storedBatches));
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('pendingBatches', JSON.stringify(pendingBatches));
        }
    }, [pendingBatches, loading]);

    const handleLogin = (credentials) => {
        const foundUser = users.find(u => u.userId === credentials.userId && u.password === credentials.password);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const getInstBalance = () => {
        if (!user || user.role === 'admin') return 0;
        const inst = institutions.find(i => i.id === user.institutionId);
        return inst ? inst.balance : 0;
    };

    const updateInstBalance = (amountToSubtract) => {
        setInstitutions(prev => prev.map(inst =>
            inst.id === user.institutionId ? { ...inst, balance: inst.balance - amountToSubtract } : inst
        ));
    };

    if (loading) {
        return null; // Or render a loading spinner
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route
                        path="/login"
                        element={!user ? <Login onLogin={handleLogin} /> : (user.role === 'admin' ? <Navigate to="/admin/corporate-management" /> : <Navigate to="/dashboard" />)}
                    />

                    {/* Protected User Routes */}
                    <Route element={user && user.role === 'user' ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard user={user} transactions={transactions} pendingBatches={pendingBatches} balance={getInstBalance()} />}
                        />
                        <Route
                            path="/transfer/single"
                            element={user?.hierarchy === 'Checker/Approver' ? <Navigate to="/dashboard" /> : <SingleTransfer user={user} setUser={setUser} transactions={transactions} setTransactions={setTransactions} pendingBatches={pendingBatches} setPendingBatches={setPendingBatches} balance={getInstBalance()} />}
                        />
                        <Route
                            path="/transfer/bulk"
                            element={user?.hierarchy === 'Checker/Approver' ? <Navigate to="/dashboard" /> : <BulkTransfer user={user} setUser={setUser} transactions={transactions} setTransactions={setTransactions} pendingBatches={pendingBatches} setPendingBatches={setPendingBatches} balance={getInstBalance()} />}
                        />
                        <Route
                            path="/transfer/approvals"
                            element={<BulkApproval user={user} setUser={setUser} transactions={transactions} setTransactions={setTransactions} pendingBatches={pendingBatches} setPendingBatches={setPendingBatches} balance={getInstBalance()} updateBalance={updateInstBalance} />}
                        />
                    </Route>

                    {/* Protected Admin Routes */}
                    <Route element={user && user.role === 'admin' ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
                        <Route
                            path="/admin/corporate-management"
                            element={
                                <CorporateManagement
                                    institutions={institutions}
                                    setInstitutions={setInstitutions}
                                    users={users}
                                    setUsers={setUsers}
                                />
                            }
                        />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;