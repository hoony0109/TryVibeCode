
import React from 'react';
import './Dashboard.css';

interface StatCardProps {
    icon: string;
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
    return (
        <div className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
                <h4>{title}</h4>
                <p>{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
