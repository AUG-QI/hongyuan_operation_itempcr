import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { HashRouter, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Login from './pages/login';
import HomePage from './pages/homePage';
import { getUserData } from './services/UserService';
import './App.css';

/** 入口页面 */
function App () {
    useEffect(() => {
        const userInfo = sessionStorage.getItem('userInfo');
        if (location.href.includes('/login') && !userInfo) {
            location.hash = '/login';
            return;
        }
        if (!userInfo) {
            location.hash = '/login';
            return;
        }
        getUserData();
    }, [location]);

    return (
        <Layout className="layout">
            <HashRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='/commodityManagement'/>}/>
                    <Route path='/*'  element={<HomePage/>} />
                    <Route path='login' element={<Login/>}/>
                </Routes>
            </HashRouter>
        </Layout>
    );
}

export default App;
