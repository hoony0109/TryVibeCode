import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import ServerStatus from './ServerStatus';
import CcuChart from './CcuChart';
import DauTrendChart from './DauTrendChart';
import TotalPlayersTrendChart from './TotalPlayersTrendChart';
import RecentApprovalsWidget from './RecentApprovalsWidget';
import SecurityAlertsWidget from './SecurityAlertsWidget';
import axios from 'axios';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [paymentSummary, setPaymentSummary] = useState({ todayRevenue: 0, monthRevenue: 0, todayPurchases: 0 });
    const [kpiData, setKpiData] = useState({
        totalPlayers: 0,
        dau: 0,
        currentOnline: 0,
        newUsersToday: 0, // Added new KPI
        mau: 0, // Added new KPI
    });

    useEffect(() => {
        const fetchKpiData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stats/kpis', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                setKpiData(response.data);
            } catch (error) {
                console.error('Error fetching KPI data:', error);
            }
        };

        fetchKpiData();
        // Fetch KPI data every 30 seconds (adjust as needed)
        const interval = setInterval(fetchKpiData, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchPaymentSummary = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stats/payment-summary', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                setPaymentSummary(response.data);
            } catch (error) {
                console.error('Error fetching payment summary:', error);
            }
        };

        fetchPaymentSummary();
        const interval = setInterval(fetchPaymentSummary, 60000); // Fetch every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-container">
            <div className="kpi-grid">
                <StatCard icon="🎮" title="Total Players" value={kpiData.totalPlayers.toLocaleString()} />
                <StatCard icon="👤" title="DAU" value={kpiData.dau.toLocaleString()} />
                <StatCard icon="🟢" title="Online Users" value={kpiData.currentOnline.toLocaleString()} />
                <StatCard icon="✨" title="New Users (Today)" value={kpiData.newUsersToday.toLocaleString()} />
                <StatCard icon="📈" title="MAU" value={kpiData.mau.toLocaleString()} />
                <StatCard icon="💰" title="Today's Revenue" value={`${paymentSummary.todayRevenue.toLocaleString()}`} />
                <StatCard icon="📅" title="This Month's Revenue" value={`${paymentSummary.monthRevenue.toLocaleString()}`} />
                <StatCard icon="🛒" title="Today's Purchases" value={paymentSummary.todayPurchases.toLocaleString()} />
            </div>
            <div className="dashboard-main-grid">
                <div className="server-status"><ServerStatus /></div>
                <div className="ccu-chart"><CcuChart /></div>
                <div className="dau-trend-chart"><DauTrendChart /></div>
                <div className="total-players-trend-chart"><TotalPlayersTrendChart /></div>
                <div className="recent-approvals-widget"><RecentApprovalsWidget /></div>
                <div className="security-alerts-widget"><SecurityAlertsWidget /></div>
            </div>
        </div>
    );
};

export default Dashboard;
