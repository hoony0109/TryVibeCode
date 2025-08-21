import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const TotalPlayersTrendChart: React.FC = () => {
    const [totalPlayersTrendData, setTotalPlayersTrendData] = useState<{ month: string; value: number }[]>([]);

    useEffect(() => {
        const fetchTotalPlayersTrendData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stats/total-players-trend', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                setTotalPlayersTrendData(response.data);
            } catch (error) {
                console.error('Error fetching Total Players trend data:', error);
            }
        };

        fetchTotalPlayersTrendData();
        // Fetch Total Players trend data periodically (e.g., daily, for demo every 30 seconds)
        const interval = setInterval(fetchTotalPlayersTrendData, 30000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-widget total-players-trend-chart">
            <h3>Total Players Trend (Last 12 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={totalPlayersTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a5e" />
                    <XAxis dataKey="month" stroke="#b8c1ec" />
                    <YAxis stroke="#b8c1ec" />
                    <Tooltip contentStyle={{ backgroundColor: '#162447', border: '1px solid #3a3a5e' }} />
                    <Legend wrapperStyle={{ color: '#e0e0e0' }} />
                    <Line type="monotone" dataKey="value" name="Total Players" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TotalPlayersTrendChart;
