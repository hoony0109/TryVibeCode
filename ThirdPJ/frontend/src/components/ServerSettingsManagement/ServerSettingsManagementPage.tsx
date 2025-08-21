import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServerSettingsManagementPage.css'; // We will create this CSS file later

interface ServerState {
    construction: number;
    start_time: number;
    end_time: number;
}

const ServerSettingsManagementPage: React.FC = () => {
    const [serverState, setServerState] = useState<ServerState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Add error state
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const fetchServerState = async () => {
        try {
            const response = await axios.get('/api/server-settings/info');
            console.log('Server state data from API:', response.data);
            setServerState(response.data);
        } catch (error: any) {
            console.error('Failed to fetch server state', error);
            if (error.response?.status === 404) {
                setError('백엔드 서버가 실행되지 않았습니다. 서버를 시작해주세요.');
            } else if (error.code === 'ERR_NETWORK') {
                setError('네트워크 연결 오류. 백엔드 서버가 실행 중인지 확인해주세요.');
            } else {
                setError(`서버 상태 조회 실패: ${error.response?.data?.msg || error.message}`);
            }
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null); // Clear previous errors
            await fetchServerState();
            setLoading(false);
        };
        
        loadData();
    }, []);

    const handleUpdateServerState = async () => {
        if (!startTime || !endTime) {
            alert('Please select both start and end times.');
            return;
        }

        const start_time = Math.floor(new Date(startTime).getTime() / 1000);
        const end_time = Math.floor(new Date(endTime).getTime() / 1000);

        if (start_time >= end_time) {
            alert('End time must be after start time.');
            return;
        }

        try {
            const response = await axios.put('/api/server-settings/info', 
                { start_time, end_time }
            );
            setServerState(response.data);
            alert('Server maintenance schedule updated successfully!');
            fetchServerState(); // Refresh the server state display
        } catch (error) {
            console.error('Failed to update server state', error);
            setError('Failed to update server state.'); // Set error message
        }
    };

    const formatTimestamp = (timestamp: number) => {
        if (timestamp === 0) return 'Permanent';
        return new Date(timestamp * 1000).toLocaleString();
    };

    return (
        <div className="server-settings-management-page">
            

            {error && (
                <div className="error-message">
                    <p><strong>오류 발생:</strong> {error}</p>
                    <p><small>백엔드 서버가 실행되지 않은 경우, 터미널에서 backend 폴더로 이동하여 'npm start' 명령어를 실행해주세요.</small></p>
                </div>
            )}

            <div className="info-card">
                <h3>Current Server State</h3>
                {loading ? (
                    <p>Loading server state...</p>
                ) : serverState ? (
                    <div>
                        <p><strong>Construction Mode:</strong> <span className={serverState.construction ? 'status-on' : 'status-off'}>{serverState.construction ? 'ON' : 'OFF'}</span></p>
                        <p><strong>Start Time:</strong> {formatTimestamp(serverState.start_time)}</p>
                        <p><strong>End Time:</strong> {formatTimestamp(serverState.end_time)}</p>
                    </div>
                ) : (
                    <p>No server state information available.</p>
                )}
            </div>

            <div className="maintenance-form-card">
                <h3>Set Maintenance Schedule</h3>
                <div className="maintenance-form">
                    <div className="form-group">
                        <label htmlFor="start-time">Maintenance Start Time:</label>
                        <input 
                            id="start-time"
                            type="datetime-local" 
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="end-time">Maintenance End Time:</label>
                        <input 
                            id="end-time"
                            type="datetime-local" 
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleUpdateServerState}>Apply Maintenance Schedule</button>
                </div>
            </div>
        </div>
    );
};

export default ServerSettingsManagementPage;
