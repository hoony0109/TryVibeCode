
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './MainLayout.css';

interface MainLayoutProps {
    children: React.ReactNode;
    userRole: string | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, userRole }) => {
    const location = useLocation();

    const title = useMemo(() => {
        switch (location.pathname) {
            case '/':
                return 'Dashboard';
            case '/players':
                return 'Player Management';
            case '/notices':
                return 'Notice Management';
            case '/coupons':
                return 'Coupon Management';
            case '/content-access':
                return 'Content Access Management';
            case '/server-maintenance':
                return 'Server Maintenance';
            case '/ip-block-management':
                return 'IP Block Management';
            case '/server-control':
                return 'Server Control';
            case '/payment-history':
                return 'Payment History';
            case '/admin-logs':
                return 'Admin Log Management';
            case '/log-viewer':
                return 'Log Viewer';
            case '/operation-management':
                return '운영 관리';
            default:
                return 'Game Admin';
        }
    }, [location.pathname]);

    return (
        <div className="main-layout">
            <Sidebar userRole={userRole} />
            <div className="main-content">
                <Header title={title} />
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
