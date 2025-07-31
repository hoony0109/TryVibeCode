import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import PlayerManagementPage from './components/PlayerManagement/PlayerManagementPage';
import MainLayout from './components/Layout/MainLayout';
import './App.css';

const App: React.FC = () => {
    const token = localStorage.getItem('token');

    const ProtectedRoutes = () => (
        <MainLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/players" element={<PlayerManagementPage />} />
                {/* Add other protected routes here */}
            </Routes>
        </MainLayout>
    );

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route 
                    path="/*" 
                    element={token ? <ProtectedRoutes /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
