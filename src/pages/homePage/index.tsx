import { Layout } from 'antd';
import HomePageHeader from './homePageHeader';
import HomePageSider from './homePageSider';
import HomePageContent from './homePageContent';
import { Navigate, useLocation } from 'react-router-dom';
/** 主页面 */
const HomePage = () => {
    const location = useLocation();
    const userInfo = sessionStorage.getItem('userInfo');
    return (
        <>
            {userInfo ? <Layout className='home-page'>
                <HomePageHeader></HomePageHeader>
                <Layout hasSider className='home-page-body'>
                    <HomePageSider pathname={location.pathname}></HomePageSider>
                    <HomePageContent></HomePageContent>
                </Layout>
            </Layout> : <Navigate
                replace={true}
                to="/login"
                state={{ from: `${location.pathname}${location.search}` }}
            />
            }
        </>

    );
};

export default HomePage;
