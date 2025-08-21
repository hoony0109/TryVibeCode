import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const DauTrendChart: React.FC = () => {
    const [dauTrendData, setDauTrendData] = useState<{ date: string; value: number }[]>([]);

    useEffect(() => {
        const fetchDauTrendData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stats/dau-trend', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                setDauTrendData(response.data);
            } catch (error) {
                console.error('Error fetching DAU trend data:', error);
            }
        };

        fetchDauTrendData();
        // Fetch DAU trend data periodically (e.g., every hour or day, for demo every 30 seconds)
        const interval = setInterval(fetchDauTrendData, 30000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-widget dau-trend-chart">
            <h3>DAU Trend (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dauTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a5e" />
                    <XAxis dataKey="date" stroke="#b8c1ec" />
                    <YAxis stroke="#b8c1ec" />
                    <Tooltip contentStyle={{ backgroundColor: '#162447', border: '1px solid #3a3a5e' }} />
                    <Legend wrapperStyle={{ color: '#e0e0e0' }} />
                    <Line type="monotone" dataKey="value" name="DAU" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DauTrendChart;
