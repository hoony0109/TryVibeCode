
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC<{ setIsAuthenticated: (isAuthenticated: boolean) => void; setUserRole: (role: string | null) => void }> = ({ setIsAuthenticated, setUserRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); // Save role to localStorage
            setIsAuthenticated(true); // Update authentication state
            setUserRole(response.data.role); // Update user role state
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
            alert('Invalid credentials'); // Show error alert
        }
    };

    return (
        <div className="login-page">
            <div className="login-branding">
                <h1>Game Operation Tool</h1>
                <p>Welcome to the central hub for game management.</p>
            </div>
            <div className="login-form-container">
                <div className="login-container">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <div className="button-group">
                            <button type="submit" className="login-button">Login</button>
                            <button type="button" className="create-admin-button" onClick={() => navigate('/create-admin')}>운영자 계정 추가</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
