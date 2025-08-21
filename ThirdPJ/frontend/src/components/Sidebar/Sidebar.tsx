
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

const Sidebar: React.FC<{ userRole: string | null }> = ({ userRole }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/api/auth/logout', {}, {
                headers: { 'x-auth-token': token }
            });
        } catch (error) {
            console.error('Logout failed', error);
        }
        localStorage.removeItem('token');
        alert('Logged out successfully.');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Game Admin</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" className="nav-item">Dashboard</NavLink>
                <NavLink to="/players" className="nav-item">Player Management</NavLink>
                <NavLink to="/notices" className="nav-item">Notice Management</NavLink>
                <NavLink to="/coupons" className="nav-item">Coupon Management</NavLink>
                <NavLink to="/content-access" className="nav-item">Content Access Management</NavLink>
                <NavLink to="/server-maintenance" className="nav-item">Server Maintenance</NavLink>
                <NavLink to="/ip-block-management" className="nav-item">IP Block Management</NavLink>
                <NavLink to="/server-control" className="nav-item">Server Control</NavLink>
                <NavLink to="/payment-history" className="nav-item">Payment History</NavLink>
                {userRole === 'superadmin' && (
                    <>
                        <NavLink to="/admin-logs" className="nav-item">Admin Log Management</NavLink>
                        <NavLink to="/log-viewer" className="nav-item">Log Viewer</NavLink>
                        <NavLink to="/operation-management" className="nav-item">운영 관리</NavLink>
                    </>
                )}
                {/* Add other navigation links here as we build them */}
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Sidebar;
