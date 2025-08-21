import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateAdminPage.css';

const CreateAdminPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Basic client-side validation
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/create-admin', {
                username,
                password,
            });
            alert('Admin account created successfully');
            navigate('/login');
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                // Handle validation errors from express-validator (errors array)
                if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                    const errorMessages = err.response.data.errors.map((error: any) => error.msg).join(', ');
                    setError(errorMessages);
                    alert(errorMessages);
                } else {
                    // Handle other specific error messages from the server (message property)
                    const errorMessage = err.response.data.message || 'Failed to create admin account';
                    setError(errorMessage);
                    alert(errorMessage);
                }
            } else {
                // Handle non-Axios errors
                setError('An unexpected error occurred.');
                alert('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="create-admin-page">
            <div className="create-admin-container">
                <h2>Create Admin Account</h2>
                <form onSubmit={handleCreateAdmin}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
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
                    <button type="submit" className="create-admin-button">Create Account</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAdminPage;
