
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const ccuData = [
    { time: '00:00', ccu: 800 },
    { time: '03:00', ccu: 1200 },
    { time: '06:00', ccu: 1500 },
    { time: '09:00', ccu: 2200 },
    { time: '12:00', ccu: 2400 },
    { time: '15:00', ccu: 2100 },
    { time: '18:00', ccu: 3000 },
    { time: '21:00', ccu: 2800 },
];

const CcuChart: React.FC = () => {
    return (
        <div className="dashboard-widget ccu-chart">
            <h3>CCU Trend (Last 24 hours)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ccuData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a5e" />
                    <XAxis dataKey="time" stroke="#b8c1ec" />
                    <YAxis stroke="#b8c1ec" />
                    <Tooltip contentStyle={{ backgroundColor: '#162447', border: '1px solid #3a3a5e' }} />
                    <Legend wrapperStyle={{ color: '#e0e0e0' }} />
                    <Line type="monotone" dataKey="ccu" stroke="#e94560" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CcuChart;
