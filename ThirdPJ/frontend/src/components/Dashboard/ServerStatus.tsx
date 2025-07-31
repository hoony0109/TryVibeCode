
import React from 'react';
import './Dashboard.css';

const serverData = [
    { name: 'Server-01', status: 'Online', ccu: 1234 },
    { name: 'Server-02', status: 'Online', ccu: 876 },
    { name: 'Server-03', status: 'Maintenance', ccu: 0 },
    { name: 'Server-04', status: 'Offline', ccu: 0 },
];

const ServerStatus: React.FC = () => {
    return (
        <div className="dashboard-widget server-status">
            <h3>Server Status</h3>
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
        </div>
    );
};

export default ServerStatus;
