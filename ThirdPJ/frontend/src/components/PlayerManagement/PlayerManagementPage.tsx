
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import PlayerDetails from './PlayerDetails';
import './PlayerManagementPage.css';

interface Player {
    id: string; // user_idx
    userIndex: string; // user_idx
    charIndex: string; // char_idx
    nickname: string;
    status: string;
    lastIp: string;
    banStatus: string;
    // char_info fields
    charGold?: number;
    charExp?: number;
    charExpHigh?: number;
    charStatPoint?: number;
    guildPoint?: number;
    guildDonationCount?: number;
    guildDonationLastUpdate?: string;
    maxInvenSize?: number;
    charMileage?: number;
    battlePower?: number;
    pkPoint?: number;
    disassembleOption?: string;
    lastLogoffDate?: string;
    deletedDate?: string;
    level?: number; // Derived from char_exp
    class?: string; // char_type
    creationDate?: string; // reg_date
    // userinfo fields (for userId search)
    cashA?: number;
    cashAFree?: number;
    lastLoginDate?: string;
    awarehouseBuyslot?: number;
    awarehouseGold?: number;
    iapQty?: number;
    iapAmount?: number;
}

const PlayerManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // New state for actual search
    const [searchType, setSearchType] = useState('nickname'); // 'charId', 'userId', 'nickname'
    const [resultSearchType, setResultSearchType] = useState('nickname'); // To store the search type of the results
    
    const [loading, setLoading] = useState(false); // Set initial loading to false
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [selectedDbId, setSelectedDbId] = useState('w07_gamedb'); // Default DB ID
    const [availableDbIds, setAvailableDbIds] = useState<string[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<string>(''); // Current user's role

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;
    const [totalPlayers, setTotalPlayers] = useState(0);
    const totalPages = Math.ceil(totalPlayers / itemsPerPage);

    // Calculate page numbers to display
    const pageRange = 10; // Number of pages to show at once
    const startPage = Math.floor((currentPage - 1) / pageRange) * pageRange + 1;
    const endPage = Math.min(startPage + pageRange - 1, totalPages);

    useEffect(() => {
        // Fetch current user's role
        const fetchCurrentUserRole = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/auth/me', {
                    headers: { 'x-auth-token': token }
                });
                setCurrentUserRole(response.data.role);
            } catch (error: any) {
                console.error('Failed to fetch current user role', error);
                if (error.response && error.response.status === 401) {
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        // Fetch available DB IDs from backend
        const fetchDbIds = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/players/db-ids', {
                    headers: { 'x-auth-token': token }
                });
                setAvailableDbIds(response.data);
                if (response.data.length > 0 && !response.data.includes(selectedDbId)) {
                    setSelectedDbId(response.data[0]); // Set first available as default if current is invalid
                }
            } catch (error: any) {
                console.error('Failed to fetch available DB IDs', error);
                if (error.response && error.response.status === 401) {
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchCurrentUserRole();
        fetchDbIds();
    }, []);

    useEffect(() => {
        if (!selectedDbId) return; // Don't fetch if no DB is selected

        const fetchPlayers = async () => {
            // Only fetch if there's a search term
            if (currentSearchTerm.trim() === '') {
                setPlayers([]); // Clear players if search term is empty
                setTotalPlayers(0);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/players?search=${currentSearchTerm}&searchType=${searchType}&dbId=${selectedDbId}&page=${currentPage}&limit=${itemsPerPage}`, {
                    headers: { 'x-auth-token': token }
                });
                // API 응답에서 모든 필드를 매핑
                console.log('Raw API response:', response.data.players);
                setPlayers(response.data.players.map((p: any) => {
                    const player = {
                        id: p.id, // user_idx
                        userIndex: p.userIndex,
                        charIndex: p.charIndex || 'N/A',
                        nickname: p.nickname,
                        status: p.status,
                        lastIp: p.lastIp,
                        banStatus: p.banStatus,
                        // char_info 필드들 추가
                        level: p.level,
                        class: p.class,
                        creationDate: p.creationDate,
                        charGold: p.charGold,
                        charExp: p.charExp,
                        charExpHigh: p.charExpHigh,
                        charStatPoint: p.charStatPoint,
                        guildPoint: p.guildPoint,
                        guildDonationCount: p.guildDonationCount,
                        guildDonationLastUpdate: p.guildDonationLastUpdate,
                        maxInvenSize: p.maxInvenSize,
                        charMileage: p.charMileage,
                        battlePower: p.battlePower,
                        pkPoint: p.pkPoint,
                        disassembleOption: p.disassembleOption,
                        lastLogoffDate: p.lastLogoffDate,
                        deletedDate: p.deletedDate,
                        // userinfo 필드들 추가
                        lastLoginDate: p.lastLoginDate,
                        cashA: p.cashA,
                        cashAFree: p.cashAFree,
                        awarehouseBuyslot: p.awarehouseBuyslot,
                        awarehouseGold: p.awarehouseGold,
                        iapQty: p.iapQty,
                        iapAmount: p.iapAmount
                    };
                    console.log('Mapped player data:', player);
                    return player;
                }));
                setTotalPlayers(response.data.totalPlayers);
                setResultSearchType(response.data.searchType); // Store the search type of the results
                
            } catch (error: any) {
                console.error('Failed to fetch players', error);
                if (error.response && error.response.status === 401) {
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
            setLoading(false);
        };

        fetchPlayers();
    }, [currentSearchTerm, selectedDbId, currentPage]); // currentSearchTerm으로 변경

    const handleDetailsClick = async (userIndex: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/players/${userIndex}?dbId=${selectedDbId}`, {
                headers: { 'x-auth-token': token }
            });
            // API 응답에서 user_idx를 id로, char_idx를 charIndex로 매핑
            setSelectedPlayer({
                id: response.data.id, // user_idx
                userIndex: response.data.userIndex,
                charIndex: response.data.charIndex || 'N/A',
                nickname: response.data.nickname,
                status: response.data.status,
                lastIp: response.data.lastIp,
                banStatus: response.data.banStatus,
                level: response.data.level,
                class: response.data.class,
                creationDate: response.data.creationDate,
            });
            setIsModalOpen(true);
        } catch (error: any) {
            console.error('Failed to fetch player details', error);
            if (error.response && error.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert('Could not fetch player details.');
            }
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = () => {
        setCurrentSearchTerm(searchTerm);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleDownloadCSV = async () => {
        if (!selectedDbId) {
            alert('Please select a Game DB first.');
            return;
        }
        if (currentSearchTerm.trim() === '') {
            alert('Please enter a search term to download CSV.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/players?search=${currentSearchTerm}&dbId=${selectedDbId}&all=true`, {
                headers: { 'x-auth-token': token }
            });
            const allPlayers = response.data.players;

            if (allPlayers.length === 0) {
                alert('No players found for the current search term to download.');
                return;
            }

            // Convert JSON to CSV
            const headers = ['UserIndex', 'CharIndex', 'Nickname', 'Status', 'Last IP', 'Ban Status'];
            const csvRows = [];
            csvRows.push(headers.join(',')); // Add headers

            for (const player of allPlayers) {
                csvRows.push([
                    player.userIndex,
                    player.charIndex,
                    `"${player.nickname.replace(/"/g, '""')}"`,
                    player.status,
                    player.lastIp,
                    player.banStatus,
                ].join(','));
            }

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `players_${selectedDbId}_${currentSearchTerm}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('CSV downloaded successfully!');

        } catch (error: any) {
            console.error('Failed to download CSV', error);
            if (error.response && error.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert(`Failed to download CSV: ${error.response?.data?.msg || error.message}`);
            }
        }
    };

    return (
        <div className="player-management-page">
            <div className="search-controls">
                <div className="form-group">
                    <label htmlFor="game-db">Game DB</label>
                    <select id="game-db" value={selectedDbId} onChange={(e) => setSelectedDbId(e.target.value)}>
                        {availableDbIds.map(dbId => (
                            <option key={dbId} value={dbId}>{dbId}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Search by</label>
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="search-type-selector">
                        <option value="nickname">Nickname</option>
                        <option value="userId">User ID</option>
                        <option value="charId">Character ID</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="search-term">Search Term</label>
                    <input
                        id="search-term"
                        type="text"
                        placeholder={`Enter ${searchType}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    />
                </div>
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
            <div className="player-table-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="player-table">
                        <thead>
                            <tr>
                                {resultSearchType === 'userId' ? (
                                    <>
                                        <th>UserIndex</th>
                                        <th>Status</th>
                                        <th>Creation Date</th>
                                        <th>Last Login Date</th>
                                        <th>Last Logoff Date</th>
                                        <th>Cash (Paid)</th>
                                        <th>Cash (Free)</th>
                                        <th>Warehouse Buy Slot</th>
                                        <th>Warehouse Gold</th>
                                        <th>IAP Quantity</th>
                                        <th>IAP Amount</th>
                                    </>
                                ) : (
                                    <>
                                        <th>UserIndex</th>
                                        <th>CharIndex</th>
                                        <th>Nickname</th>
                                        <th>Status</th>
                                        <th>Level</th>
                                        <th>Class</th>
                                        <th>Creation Date</th>
                                    </>
                                )}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player.id}>
                                    {resultSearchType === 'userId' ? (
                                        <>
                                            <td>{player.userIndex}</td>
                                            <td>{player.status}</td>
                                            <td>{player.creationDate ? new Date(player.creationDate).toLocaleString() : 'N/A'}</td>
                                            <td>{player.lastLoginDate ? new Date(player.lastLoginDate).toLocaleString() : 'N/A'}</td>
                                            <td>{player.lastLogoffDate ? new Date(player.lastLogoffDate).toLocaleString() : 'N/A'}</td>
                                            <td>{player.cashA !== undefined && player.cashA !== null ? player.cashA : 'N/A'}</td>
                                            <td>{player.cashAFree !== undefined && player.cashAFree !== null ? player.cashAFree : 'N/A'}</td>
                                            <td>{player.awarehouseBuyslot !== undefined && player.awarehouseBuyslot !== null ? player.awarehouseBuyslot : 'N/A'}</td>
                                            <td>{player.awarehouseGold !== undefined && player.awarehouseGold !== null ? player.awarehouseGold : 'N/A'}</td>
                                            <td>{player.iapQty !== undefined && player.iapQty !== null ? player.iapQty : 'N/A'}</td>
                                            <td>{player.iapAmount !== undefined && player.iapAmount !== null ? player.iapAmount : 'N/A'}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{player.userIndex}</td>
                                            <td>{player.charIndex || 'N/A'}</td>
                                            <td>{player.nickname || 'N/A'}</td>
                                            <td>{player.status}</td>
                                            <td>{player.level !== undefined ? player.level : 'N/A'}</td>
                                            <td>{player.class || 'N/A'}</td>
                                            <td>{player.creationDate ? new Date(player.creationDate).toLocaleString() : 'N/A'}</td>
                                        </>
                                    )}
                                    <td>
                                        {currentUserRole === 'superadmin' ? (
                                            <button onClick={() => handleDetailsClick(player.id)} className="action-button">Details</button>
                                        ) : (
                                            <button disabled className="action-button disabled">Details</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="pagination-first-last"
                >
                    First
                </button>
                <button 
                    onClick={() => handlePageChange(Math.max(1, currentPage - pageRange))}
                    disabled={currentPage === 1}
                    className="pagination-block-move"
                >
                    Previous {pageRange}
                </button>
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-single-move"
                >
                    Previous
                </button>
                {startPage > 1 && <span className="pagination-ellipsis">...</span>}
                {[...Array(endPage - startPage + 1)].map((_, index) => (
                    <button 
                        key={startPage + index}
                        onClick={() => handlePageChange(startPage + index)}
                        className={currentPage === startPage + index ? 'active' : ''}
                    >
                        {startPage + index}
                    </button>
                ))}
                {endPage < totalPages && <span className="pagination-ellipsis">...</span>}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-single-move"
                >
                    Next
                </button>
                <button 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + pageRange))}
                    disabled={currentPage === totalPages}
                    className="pagination-block-move"
                >
                    Next {pageRange}
                </button>
                <button 
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="pagination-first-last"
                >
                    Last
                </button>
            </div>

            <div className="download-section">
                <button className="action-button" onClick={handleDownloadCSV}>Download CSV</button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <PlayerDetails 
                    player={selectedPlayer} 
                    onStatusChange={(updatedPlayer) => {
                        setSelectedPlayer(updatedPlayer);
                        setPlayers(prevPlayers => 
                            prevPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
                        );
                    }}
                    selectedDbId={selectedDbId} // Pass selectedDbId to PlayerDetails
                />
            </Modal>
        </div>
    );
};

export default PlayerManagementPage;
