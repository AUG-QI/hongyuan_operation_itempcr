import { Layout } from 'antd';
import HomePageHeader from './homePageHeader';
import HomePageSider from './homePageSider';
import HomePageContent from './homePageContent';
import { useLocation } from 'react-router-dom';
/** 主页面 */
const HomePage = () => {
    const location = useLocation();
    return (
        <Layout className='home-page'>
            <HomePageHeader></HomePageHeader>
            <Layout hasSider>
                <HomePageSider pathname={location.pathname}></HomePageSider>
                <HomePageContent></HomePageContent>
            </Layout>
        </Layout>
    );
}

export default HomePage;
