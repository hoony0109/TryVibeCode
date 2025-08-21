import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServerInfoBox from './ServerInfoBox';
import './ServerControlPage.css';

const ServerControlPage: React.FC = () => {
    const [servers, setServers] = useState<string[]>([]);
    const [loadingAll, setLoadingAll] = useState(false);

    const fetchServers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/server-control/servers', {
                headers: { 'x-auth-token': token }
            });
            setServers(response.data);
        } catch (error) {
            console.error('Error fetching servers:', error);
        }
    };

    useEffect(() => {
        fetchServers();
    }, []);

    const handleAllServersAction = async (action: 'start' | 'stop') => {
        if (!window.confirm(`Are you sure you want to ${action} ALL servers?`)) {
            return;
        }

        setLoadingAll(true);
        const token = localStorage.getItem('token');

        const requests = servers.map(server => 
            axios.post(`http://localhost:3000/api/server-control/${action}`, 
                { serverId: server }, 
                { headers: { 'x-auth-token': token } }
            )
        );

        const results = await Promise.allSettled(requests);
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.length - successful;

        let alertMessage = `Action '${action}' for All Servers:\n`;
        alertMessage += `  - ${successful} requests succeeded.\n`;
        if (failed > 0) {
            alertMessage += `  - ${failed} requests failed.`;
            console.error('Failed requests:', results.filter(r => r.status === 'rejected'));
        }
        alert(alertMessage);

        // Add a small delay and reload the page to reflect all statuses
        setTimeout(() => window.location.reload(), 2000);

        setLoadingAll(false);
    };

    return (
        <div className="server-control-page">
            <div className="global-controls-card">
                <h3>Global Controls</h3>
                <div className="global-controls-actions">
                    <button onClick={() => handleAllServersAction('stop')} className="btn-shutdown-all" disabled={loadingAll}>
                        {loadingAll ? 'Processing...' : 'All Server Shutdown'}
                    </button>
                    <button onClick={() => handleAllServersAction('start')} className="btn-restart-all" disabled={loadingAll}>
                        {loadingAll ? 'Processing...' : 'All Server Start'}
                    </button>
                </div>
            </div>

            <div className="server-list-grid">
                {servers.map(server => (
                    <ServerInfoBox 
                        key={server} 
                        serverName={server} 
                    />
                ))}
            </div>
        </div>
    );
};

export default ServerControlPage;