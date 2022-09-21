import React from 'react';
import './index.scss';

/** 项目名 */
const ITEMS_NAME: string = '必要';

/** 页面头部 */
class HomePageHeader extends React.Component {
    render (): React.ReactNode {
        return <div className="home-page-header">
            <span>{ITEMS_NAME}</span>
            <span>{ITEMS_NAME}</span>
            <span>运营管理</span>
        </div>;
    }
}

export default HomePageHeader;
