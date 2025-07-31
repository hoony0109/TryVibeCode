
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './MainLayout.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const location = useLocation();

    const title = useMemo(() => {
        switch (location.pathname) {
            case '/':
                return 'Dashboard';
            case '/players':
                return 'Player Management';
            default:
                return 'Game Admin';
        }
    }, [location.pathname]);

    return (
        <div className="main-layout">
            <Sidebar />
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
