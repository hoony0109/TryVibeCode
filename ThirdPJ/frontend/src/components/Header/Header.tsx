
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.css';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const [isGameServerSocketConnected, setIsGameServerSocketConnected] = useState<boolean>(false);

    useEffect(() => {
        const fetchSocketStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/status/game-server-socket', {
                    headers: { 'x-auth-token': token }
                });
                setIsGameServerSocketConnected(response.data.isConnected);
            } catch (error) {
                console.error('Failed to fetch game server socket status', error);
                setIsGameServerSocketConnected(false);
            }
        };

        // Fetch status immediately on mount
        fetchSocketStatus();

        // Fetch status every 5 seconds
        const intervalId = setInterval(fetchSocketStatus, 5000);

        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="header">
            <h1>{title}</h1>
            <div className="game-server-status">
                GateMngSV: 
                <span className={isGameServerSocketConnected ? 'status-connected' : 'status-disconnected'}>
                    {isGameServerSocketConnected ? 'Connected' : 'Disconnected'}
                </span>
            </div>
        </header>
    );
};

export default Header;
