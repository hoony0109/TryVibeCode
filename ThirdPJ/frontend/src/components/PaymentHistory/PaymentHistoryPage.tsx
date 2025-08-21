import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentHistoryPage.css';

const PaymentHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });
  const [filters, setFilters] = useState({
    timeRange: { start: '', end: '' },
    user_id: '',
    char_id: '',
    product_id: '',
    order_id: '',
  });

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (key === 'timeRange') {
          if (value.start && value.end) {
            acc[key] = value;
          }
        } else if (value) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const response = await axios.post('/api/payments/history', {
        filters: cleanedFilters,
        pagination: { page, limit: pagination.limit },
      });
      setHistory(response.data.documents);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to fetch payment history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      timeRange: { ...prev.timeRange, [name]: value },
    }));
  };

  const handleSearch = () => {
    fetchHistory(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchHistory(newPage);
    }
  };

  const renderTable = () => {
    if (history.length === 0) {
      return <p>No payment history found for the selected criteria.</p>;
    }

    const headers = Object.keys(history[0] || {});

    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={header}>
                    {header === 'reg_time' ? new Date(record[header]).toLocaleString() : record[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="payment-history-page">
      
      <div className="filters-card">
        <h3>Filters</h3>
        <div className="filter-controls">
          <div className="form-group">
            <label>Start Time:</label>
            <input type="datetime-local" name="start" value={filters.timeRange.start} onChange={handleTimeRangeChange} />
          </div>
          <div className="form-group">
            <label>End Time:</label>
            <input type="datetime-local" name="end" value={filters.timeRange.end} onChange={handleTimeRangeChange} />
          </div>
          <div className="form-group">
            <label>User ID (User Index):</label>
            <input type="text" name="user_id" value={filters.user_id} onChange={handleFilterChange} placeholder="Enter User ID" />
          </div>
          <div className="form-group">
            <label>Character ID:</label>
            <input type="text" name="char_id" value={filters.char_id} onChange={handleFilterChange} placeholder="Enter Character ID" />
          </div>
          <div className="form-group">
            <label>Product ID:</label>
            <input type="text" name="product_id" value={filters.product_id} onChange={handleFilterChange} placeholder="Enter Product ID" />
          </div>
          <div className="form-group">
            <label>Order ID:</label>
            <input type="text" name="order_id" value={filters.order_id} onChange={handleFilterChange} placeholder="Enter Order ID" />
          </div>
          <button onClick={handleSearch} disabled={loading}>Search</button>
        </div>
      </div>

      {loading && <p>Loading history...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <>
          {renderTable()}
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
              Previous
            </button>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistoryPage;