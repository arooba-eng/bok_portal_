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
import Layout from './components/Layout';
import { initialTransactions } from './data/mockData';

function App() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState(initialTransactions);
    const [pendingBatches, setPendingBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    if (loading) {
        return null; // Or render a loading spinner
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />

                    {/* Protected Routes wrapped in Layout */}
                    <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard user={user} transactions={transactions} pendingBatches={pendingBatches} />}
                        />
                        <Route
                            path="/transfer/single"
                            element={<SingleTransfer user={user} setUser={setUser} transactions={transactions} setTransactions={setTransactions} pendingBatches={pendingBatches} setPendingBatches={setPendingBatches} />}
                        />
                        <Route
                            path="/transfer/bulk"
                            element={<BulkTransfer user={user} setUser={setUser} transactions={transactions} setTransactions={setTransactions} pendingBatches={pendingBatches} setPendingBatches={setPendingBatches} />}
                        />
                        <Route
                            path="/transfer/approvals"
                            element={<BulkApproval user={user} setUser={setUser} transactions={transactions} setTransactions={setTransactions} pendingBatches={pendingBatches} setPendingBatches={setPendingBatches} />}
                        />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;