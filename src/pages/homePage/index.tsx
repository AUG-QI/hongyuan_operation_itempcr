/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-09 02:37:04
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-27 23:52:22
 * @FilePath: /hongyuan_operation_itempcr/src/pages/homePage/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Layout } from 'antd';
import HomePageHeader from './homePageHeader';
import HomePageSider from './homePageSider';
import HomePageContent from './homePageContent';
import { Navigate, useLocation } from 'react-router-dom';
import './index.scss';
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
