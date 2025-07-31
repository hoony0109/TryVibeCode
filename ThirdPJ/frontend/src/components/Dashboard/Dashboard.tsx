

import React from 'react';
import StatCard from './StatCard';
import ServerStatus from './ServerStatus';
import CcuChart from './CcuChart';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div>
            <div className="dashboard-grid">
                <StatCard icon="🎮" title="Total CCU" value="2,110" />
                <StatCard icon="👤" title="DAU" value="15,832" />
                <StatCard icon="📈" title="New Users (Today)" value="478" />
                <StatCard icon="💰" title="Revenue (Today)" value="$12,450" />
            </div>
            <div className="dashboard-grid" style={{ marginTop: '20px' }}>
                <ServerStatus />
                <CcuChart />
            </div>
        </div>
    );
};

export default Dashboard;

