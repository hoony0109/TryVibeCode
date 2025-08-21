
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

interface Server {
    name: string;
    status: string;
    ccu: number;
}

const ServerStatus: React.FC = () => {
    const [serverData, setServerData] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServerStatus = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/status/servers', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                setServerData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching server status:', err);
                setError('Failed to load server status.');
            } finally {
                setLoading(false);
            }
        };

        fetchServerStatus();
        const interval = setInterval(fetchServerStatus, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-widget server-status">
            <h3>Server Status</h3>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Server Name</th>
                            <th>Status</th>
                            <th>CCU</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serverData.map(server => (
                            <tr key={server.name}>
                                <td>{server.name}</td>
                                <td>
                                    <span className={`status-dot ${server.status.toLowerCase()}`}></span>
                                    {server.status}
                                </td>
                                <td>{server.ccu.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ServerStatus;
