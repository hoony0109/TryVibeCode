import React from 'react';
import './Dashboard.css';

const RecentApprovalsWidget: React.FC = () => {
    return (
        <div className="dashboard-widget">
            <h3>Recent Approvals</h3>
            <p>No recent approvals to display.</p>
            {/* Placeholder for recent approvals list */}
            <ul>
                <li>Approval 1: User A - Item X (Pending)</li>
                <li>Approval 2: User B - Ban (Approved)</li>
            </ul>
        </div>
    );
};

export default RecentApprovalsWidget;
