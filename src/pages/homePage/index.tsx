import { useEffect } from 'react';
import { Layout } from 'antd';
import HomePageHeader from './homePageHeader';
import HomePageSider from './homePageSider';
import HomePageContent from './homePageContent';

const HomePage = () => {
    useEffect(() => {
        console.log('路由动了');
        
    }, []);

    return (
        <Layout className='home-page'>
            <HomePageHeader></HomePageHeader>
            <Layout hasSider>
                <HomePageSider></HomePageSider>
                <HomePageContent></HomePageContent>
            </Layout>
        </Layout>
    );
}

export default HomePage;
