import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminLogManagementPage.css';

interface LogEntry {
  admin_id: number;
  idx: number;
  component_type: number;
  action_type: string;
  target_data: string; // JSON string
  ip_address: string;
  created_at: string;
}

const AdminLogManagementPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter states
  const [filterAdminId, setFilterAdminId] = useState<string>('');
  const [filterComponentType, setFilterComponentType] = useState<string>('');
  const [filterActionType, setFilterActionType] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterIpAddress, setFilterIpAddress] = useState<string>('');

  // ComponentType and ActionType mappings for display
  const componentTypeMap: { [key: number]: string } = {
    0: 'UNKNOWN',
    1: 'AUTH',
    2: 'NOTICE',
    3: 'COUPON',
    4: 'PLAYER_MANAGEMENT',
    5: 'SERVER_SETTINGS',
    6: 'ADMIN_CREATION',
    7: 'CONTENT_ACCESS',
    8: 'IP_BLOCK',
  };

  // ActionType map (can be expanded as needed)
  const actionTypeMap: { [key: string]: string } = {
    // Auth
    LOGIN_SUCCESS: '로그인 성공',
    LOGOUT: '로그아웃',

    // Admin Creation
    CREATE_ADMIN: '관리자 생성',

    // Notices
    CREATE_NOTICE: '공지 생성',
    UPDATE_NOTICE: '공지 수정',
    DELETE_NOTICE: '공지 삭제',

    // Coupons
    CREATE_COUPON_EVENT: '쿠폰 이벤트 생성',

    // Player Management
    UPDATE_PLAYER_STATUS: '플레이어 상태 변경',
    GIVE_ITEM: '아이템 지급',

    // Server Settings
    UPDATE_MAINTENANCE: '점검 설정 변경',

    // IP Block
    ADD_IP_BLOCK: 'IP 차단',
    REMOVE_IP_BLOCK: 'IP 차단 해제',

    // Content Access
    UPDATE_CONTENT_ACCESS: '콘텐츠 접근 변경',
    ADD_CONTENT_TYPE: '콘텐츠 타입 추가',
  };

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('/api/admin-logs', {
        headers: { 'x-auth-token': token },
        params: {
          page: currentPage,
          limit,
          adminId: filterAdminId || undefined,
          componentType: filterComponentType || undefined,
          actionType: filterActionType || undefined,
          startDate: filterStartDate || undefined,
          endDate: filterEndDate || undefined,
          ipAddress: filterIpAddress || undefined,
        },
      });
      setLogs(Array.isArray(response.data.logs) ? response.data.logs : []);
      setTotalLogs(response.data.totalLogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch admin logs:', error);
      alert('로그를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, limit]); // Refetch logs when page or limit changes

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchLogs();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCopyTargetData = (data: any) => {
    const textToCopy = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('대상 데이터가 클립보드에 복사되었습니다.');
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다.');
    });
  };

  const handleDownloadCSV = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Helper function to escape CSV fields
    const escapeCsvField = (field: any): string => {
      if (field === null || field === undefined) {
        return '';
      }
      let stringField = String(field);
      // If the field contains a comma, double quote, or newline, enclose it in double quotes
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        // Escape internal double quotes by doubling them
        stringField = stringField.replace(/"/g, '""');
        return `"${stringField}"`;
      }
      return stringField;
    };

    try {
      // Fetch all logs based on current filters, without pagination
      const response = await axios.get('/api/admin-logs', {
        headers: { 'x-auth-token': token },
        params: {
          adminId: filterAdminId || undefined,
          componentType: filterComponentType || undefined,
          actionType: filterActionType || undefined,
          startDate: filterStartDate || undefined,
          endDate: filterEndDate || undefined,
          ipAddress: filterIpAddress || undefined,
          // Request all data, not just one page
          limit: 999999, // A very large number to get all logs
          page: 1,
        },
      });
      const allLogs = Array.isArray(response.data.logs) ? response.data.logs : [];

      if (allLogs.length === 0) {
        alert('다운로드할 로그가 없습니다.');
        return;
      }

      // Define CSV headers
      const headers = [
        '관리자 ID',
        '로그 인덱스',
        '컴포넌트 타입',
        '액션 타입',
        '대상 데이터',
        'IP 주소',
        '생성 시각',
      ];

      const csvRows = [];
      csvRows.push(headers.map(escapeCsvField).join(',')); // Add headers row, escaped

      // Add data rows
      for (const log of allLogs) {
        const row = [
          escapeCsvField(log.admin_id),
          escapeCsvField(log.idx),
          escapeCsvField(componentTypeMap[log.component_type] || log.component_type),
          escapeCsvField(actionTypeMap[log.action_type] || log.action_type),
          escapeCsvField(JSON.stringify(log.target_data)), // target_data is already an object, stringify it then escape
          escapeCsvField(log.ip_address),
          escapeCsvField(new Date(log.created_at).toLocaleString()),
        ];
        csvRows.push(row.join(','));
      }

      const csvString = csvRows.join('\n');
      // Add BOM for UTF-8 encoding recognition in Excel
      const blob = new Blob(['\uFEFF', csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `admin_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('CSV 다운로드가 완료되었습니다!');

    } catch (error) {
      console.error('CSV 다운로드 실패:', error);
      alert('CSV 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className="admin-log-management-page">

      <div className="log-filters">
        <div className="filter-group">
          <label htmlFor="adminId">관리자 ID</label>
          <input
            type="text"
            id="adminId"
            value={filterAdminId}
            onChange={(e) => setFilterAdminId(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="componentType">컴포넌트 타입</label>
          <select
            id="componentType"
            value={filterComponentType}
            onChange={(e) => setFilterComponentType(e.target.value)}
          >
            <option value="">컴포넌트 타입 (전체)</option>
            {Object.entries(componentTypeMap).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="actionType">액션 타입</label>
          <select
            id="actionType"
            value={filterActionType}
            onChange={(e) => setFilterActionType(e.target.value)}
          >
            <option value="">액션 타입 (전체)</option>
            {Object.entries(actionTypeMap).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="startDate">시작 날짜</label>
          <input
            type="date"
            id="startDate"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">종료 날짜</label>
          <input
            type="date"
            id="endDate"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="ipAddress">IP 주소</label>
          <input
            type="text"
            id="ipAddress"
            value={filterIpAddress}
            onChange={(e) => setFilterIpAddress(e.target.value)}
          />
        </div>
        <button onClick={handleSearch}>검색</button>
        <button onClick={handleDownloadCSV} className="download-button">CSV 다운로드</button>
      </div>

      <div className="log-table-container">
        <table>
          <thead>
            <tr>
              <th>관리자 ID</th>
              <th>로그 인덱스</th>
              <th>컴포넌트 타입</th>
              <th>액션 타입</th>
              <th>대상 데이터</th>
              <th>IP 주소</th>
              <th>생성 시각</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={`${log.admin_id}-${log.idx}-${log.created_at}`}>
                <td>{log.admin_id}</td>
                <td>{log.idx}</td>
                <td>{componentTypeMap[log.component_type] || log.component_type}</td>
                <td>{actionTypeMap[log.action_type] || log.action_type}</td>
                <td>
                  <pre onClick={() => handleCopyTargetData(log.target_data)}>
                    {JSON.stringify(log.target_data, null, 2)}
                  </pre>
                </td>
                <td>{log.ip_address}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>이전</button>
        <span>페이지 {currentPage} / {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>다음</button>
      </div>
    </div>
  );
};

export default AdminLogManagementPage;