import React from 'react';
import './Dashboard.css';

const SecurityAlertsWidget: React.FC = () => {
    return (
        <div className="dashboard-widget">
            <h3>Security Alerts</h3>
            <p>No new security alerts.</p>
            {/* Placeholder for security alerts list */}
            <ul>
                <li>Alert 1: Suspicious Login Attempt (High)</li>
                <li>Alert 2: Unauthorized Access (Medium)</li>
            </ul>
        </div>
    );
};

export default SecurityAlertsWidget;
