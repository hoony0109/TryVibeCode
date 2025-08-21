import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IpBlockManagementPage.css'; // New CSS file for IP Block Management

interface IpBlock {
    ip_address: string;
    reason: number;
    block_time: number;
    block_finish_time: number;
}

const IpBlockManagementPage: React.FC = () => {
    const [ipBlocks, setIpBlocks] = useState<IpBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [newIpAddress, setNewIpAddress] = useState('');
    const [newIpReason, setNewIpReason] = useState(0);
    const [newIpBlockHours, setNewIpBlockHours] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const blockReasons: { [key: number]: string } = {
        0: 'Other',
        1: 'Abuse/Harassment',
        2: 'Bot/Macro Usage',
        3: 'Account Hacking/Theft',
        4: 'Real Money Trading (RMT)',
    };

    const formatTimestamp = (timestamp: number) => {
        if (timestamp === 0) return 'Permanent';
        return new Date(timestamp * 1000).toLocaleString();
    };

    const fetchIpBlocks = async () => {
        try {
            const response = await axios.get('/api/server-settings/ip-block');
            setIpBlocks(response.data);
        } catch (error: any) {
            console.error('Failed to fetch IP blocks', error);
            if (error.response?.status === 404) {
                setError('백엔드 서버가 실행되지 않았습니다. 서버를 시작해주세요.');
            } else if (error.code === 'ERR_NETWORK') {
                setError('네트워크 연결 오류. 백엔드 서버가 실행 중인지 확인해주세요.');
            } else {
                setError(`IP 차단 목록 조회 실패: ${error.response?.data?.msg || error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIpBlocks();
    }, []);

    const handleAddIpBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIpAddress.trim()) {
            alert('IP address cannot be empty.');
            return;
        }
        try {
            await axios.post('/api/server-settings/ip-block', 
                { ip_address: newIpAddress, reason: newIpReason, block_hour_time: newIpBlockHours }
            );
            setNewIpAddress('');
            setNewIpReason(0);
            setNewIpBlockHours(0);
            fetchIpBlocks(); // Refresh list
            alert('IP address blocked successfully!');
        } catch (error) {
            console.error('Failed to block IP address', error);
            setError('Failed to block IP address. Please ensure it is a valid IP and not already blocked.'); // Set error message
        }
    };

    const handleReleaseIpBlock = async (ip: string) => {
        if (!window.confirm(`Are you sure you want to release IP ${ip}?`)) return;
        try {
            await axios.delete(`/api/server-settings/ip-block/${ip}`);
            fetchIpBlocks(); // Refresh list
            alert(`IP ${ip} released successfully!`);
        } catch (error) {
            console.error('Failed to release IP block', error);
            setError('Failed to release IP block.'); // Set error message
        }
    };

    return (
        <div className="ip-block-management-page">
            

            {error && (
                <div className="error-message">
                    <p><strong>오류 발생:</strong> {error}</p>
                    <p><small>백엔드 서버가 실행되지 않은 경우, 터미널에서 backend 폴더로 이동하여 'npm start' 명령어를 실행해주세요.</small></p>
                </div>
            )}

            <div className="ip-block-card">
                
                <div className="add-ip-form-container">
                    <form onSubmit={handleAddIpBlock} className="add-ip-block-form">
                        <div className="form-group">
                            <label htmlFor="ip-address">IP Address</label>
                            <input
                                id="ip-address"
                                type="text"
                                placeholder="e.g., 192.168.1.1"
                                value={newIpAddress}
                                onChange={(e) => setNewIpAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="block-reason">Reason</label>
                            <select 
                                id="block-reason"
                                value={newIpReason}
                                onChange={(e) => setNewIpReason(Number(e.target.value))}
                            >
                                {Object.entries(blockReasons).map(([code, reason]) => (
                                    <option key={code} value={code}>{reason}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Duration</label>
                            <div className="duration-buttons">
                                <button type="button" onClick={() => setNewIpBlockHours(1)}>1 Hour</button>
                                <button type="button" onClick={() => setNewIpBlockHours(24)}>1 Day</button>
                                <button type="button" onClick={() => setNewIpBlockHours(168)}>7 Days</button>
                                <button type="button" onClick={() => setNewIpBlockHours(0)}>Permanent</button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Block IP</button>
                    </form>
                </div>

                {loading ? (
                    <p>Loading IP blocks...</p>
                ) : (
                    <table className="ip-block-table">
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>Reason</th>
                                <th>Block Time</th>
                                <th>Finish Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ipBlocks.map(ipBlock => (
                                <tr key={ipBlock.ip_address}>
                                    <td>{ipBlock.ip_address}</td>
                                    <td>{blockReasons[ipBlock.reason] || 'Unknown'}</td>
                                    <td>{formatTimestamp(ipBlock.block_time)}</td>
                                    <td>{formatTimestamp(ipBlock.block_finish_time)}</td>
                                    <td>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleReleaseIpBlock(ipBlock.ip_address)}
                                        >
                                            Release
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default IpBlockManagementPage;
