
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

const Sidebar: React.FC = () => {
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
                {/* Add other navigation links here as we build them */}
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Sidebar;
