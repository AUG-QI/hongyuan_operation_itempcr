import React from 'react';
import {
    UploadOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import './index.scss';


const ITEMS = [{
    label: '商品管理',
    key: '/commodityManagement',
    icon: <HomeOutlined />,
}, {
    label: '库存同步',
    key: '/inventorySynchronous',
    icon: <UploadOutlined />,
}];
interface IState {
    /** 侧边栏收缩框 */
    collapsed: boolean;
    /** 选中的侧边栏key */
    selectedKeys: string[];
}
/** 主页 */
class HomePageSider extends React.Component<{pathname: string}, IState> {
    state = {
        collapsed: false,
        selectedKeys: [],
    };

    componentDidMount (): void {
        ITEMS.forEach(item => {
            if (location.href.includes(`/${item.key}`)) {
                this.setState({ selectedKeys: [item.key] });
            }
        });
    }
    clickSider = ({ key }: any): void => {
        location.hash = `${key}`;
    }
    toggleCollapsed = () => {
        const { collapsed } = this.state;
        this.setState({ collapsed: !collapsed });
    }
    render (): React.ReactNode {
        const { collapsed  } = this.state;
        const { pathname = '' } = this.props;
        return (
            <div
                style={{
                    width: collapsed ? 80 : 256,
                    height: '100%',
                }}
            >
                <Menu
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    items={ITEMS}
                    selectedKeys={[pathname]}
                    className="sider-menu"
                    onClick={this.clickSider}
                />
                <Button
                    type="primary"
                    onClick={this.toggleCollapsed}
                    className="sider-controller"
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
            </div>
        );
    }
}

export default HomePageSider;
