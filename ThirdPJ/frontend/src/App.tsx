import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import PlayerManagementPage from './components/PlayerManagement/PlayerManagementPage';
import NoticeManagementPage from './components/NoticeManagement/NoticeManagementPage';
import CouponManagementPage from './components/CouponManagement/CouponManagementPage';
import ContentAccessManagementPage from './components/ContentAccessManagement/ContentAccessManagementPage';
import ServerSettingsManagementPage from './components/ServerSettingsManagement/ServerSettingsManagementPage';
import IpBlockManagementPage from './components/IpBlockManagement/IpBlockManagementPage';
import CreateAdminPage from './components/CreateAdmin/CreateAdminPage';
import AdminLogManagementPage from './components/AdminLogManagement/AdminLogManagementPage';
import OperationManagementPage from './components/OperationManagement/OperationManagementPage';
import LogViewerPage from './components/LogViewer/LogViewerPage';
import PaymentHistoryPage from './components/PaymentHistory/PaymentHistoryPage';
import ServerControlPage from './components/ServerControl/ServerControlPage';
import MainLayout from './components/Layout/MainLayout';
import './App.css';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('role'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
            setUserRole(localStorage.getItem('role'));
        };

        window.addEventListener('storage', handleStorageChange);

        // Also check on mount
        setIsAuthenticated(!!localStorage.getItem('token'));
        setUserRole(localStorage.getItem('role'));

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const ProtectedRoutes = () => (
        <MainLayout userRole={userRole}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/players" element={<PlayerManagementPage />} />
                <Route path="/notices" element={<NoticeManagementPage />} />
                <Route path="/coupons" element={<CouponManagementPage />} />
                <Route path="/content-access" element={<ContentAccessManagementPage />} />
                <Route path="/server-maintenance" element={<ServerSettingsManagementPage />} />
                <Route path="/ip-block-management" element={<IpBlockManagementPage />} />
                <Route path="/admin-logs" element={<AdminLogManagementPage />} />
                <Route path="/operation-management" element={<OperationManagementPage />} />
                <Route path="/log-viewer" element={<LogViewerPage />} />
                <Route path="/payment-history" element={<PaymentHistoryPage />} />
                <Route path="/server-control" element={<ServerControlPage />} />
                {/* Add other protected routes here */}
            </Routes>
        </MainLayout>
    );

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
                <Route path="/create-admin" element={<CreateAdminPage />} />
                <Route 
                    path="/*" 
                    element={isAuthenticated ? <ProtectedRoutes /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default App;