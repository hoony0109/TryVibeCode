import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const CcuChart: React.FC = () => {
    const [ccuData, setCcuData] = useState<{ time: string; value: number }[]>([]);

    useEffect(() => {
        const fetchCcuData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stats/ccu-trend', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                
                // The backend now sends the array directly
                setCcuData(response.data);

            } catch (error) {
                console.error('Error fetching CCU data:', error);
            }
        };

        // Fetch immediately and then every 30 seconds
        fetchCcuData();
        const interval = setInterval(fetchCcuData, 30000); 

        return () => clearInterval(interval);
    }, []);

    // Format the time for the XAxis ticks
    const formatXAxis = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="dashboard-widget ccu-chart">
            <h3>CCU Trend (Last 24 hours)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ccuData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a5e" />
                    <XAxis dataKey="time" tickFormatter={formatXAxis} stroke="#b8c1ec" />
                    <YAxis stroke="#b8c1ec" />
                    <Tooltip contentStyle={{ backgroundColor: '#162447', border: '1px solid #3a3a5e' }} />
                    <Legend wrapperStyle={{ color: '#e0e0e0' }} />
                    <Line type="monotone" dataKey="value" name="CCU" stroke="#e94560" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CcuChart;
