import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServerInfoBox.css';

interface ServerInfoBoxProps {
    serverName: string; // This will be the world_idx
}

const ServerInfoBox: React.FC<ServerInfoBoxProps> = ({ serverName }) => {
    const [status, setStatus] = useState('Unknown');
    const [loading, setLoading] = useState(false);
    
    const formattedServerName = `${serverName}번 서버`;

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/server-control/status?serverId=${serverName}`, {
                headers: { 'x-auth-token': token }
            });
            setStatus(response.data.status);
        } catch (error) {
            // Don't log error for status fetch, it can be noisy
            setStatus('Error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 15000); // Poll every 15 seconds
        return () => clearInterval(interval);
    }, [serverName]);

    const handleAction = async (action: 'start' | 'stop') => {
        if (!window.confirm(`정말로 ${formattedServerName}를 ${action}하시겠습니까?`)) {
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/server-control/${action}`, 
                { serverId: serverName }, // Send the raw serverName (world_idx)
                { headers: { 'x-auth-token': token } }
            );
            alert(`${formattedServerName} ${action} 요청을 성공적으로 보냈습니다!`);
            setTimeout(fetchStatus, 2000);
        } catch (error) {
            console.error(`Error with ${action} action for ${formattedServerName}:`, error);
            alert(`${formattedServerName}에 ${action} 요청을 보내는 데 실패했습니다.`);
        }
        setLoading(false);
    };

    const statusClass = status === 'Running' ? 'status-online' : 'status-offline';

    return (
        <div className="server-info-box">
            <div className="server-info-header">
                <span className={`status-indicator ${statusClass}`}></span>
                <h3>{formattedServerName}</h3>
            </div>
            <div className="server-info-body">
                <p><strong>Status:</strong> {loading ? 'Loading...' : status}</p>
            </div>
            <div className="server-actions">
                <button onClick={() => handleAction('start')} disabled={loading} className="btn-start">Start</button>
                <button onClick={() => handleAction('stop')} disabled={loading} className="btn-shutdown">Stop</button>
            </div>
        </div>
    );
};

export default ServerInfoBox;
