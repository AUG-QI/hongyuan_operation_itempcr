import React from 'react';
import {
    UploadOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { checkRouterJump } from '../inedex';
import './index.scss';


const ITEMS = [{
    label: '商品管理',
    key: 'commodityManagement',
    icon: <HomeOutlined />,
}, {
    label: '库存同步',
    key: 'inventorySynchronous',
    icon: <UploadOutlined />,
}];
/** 主页 */
class HomePageSider extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            collapsed: false,
            items: [],
            selectedKeys: [],
        };
    }
    componentDidMount (): void {
        ITEMS.forEach(item => {
            if (location.href.includes(`/${item.key}`)) {
                this.setState({ selectedKeys: [item.key] });
            }
        });
    }
    clickSider = ({key}) => {
        const isAllowed = checkRouterJump();
        if (!isAllowed) {
            return;
        }
        location.hash = `/${key}`;
        this.setState({ selectedKeys: key });
    }
    toggleCollapsed = () => {
        const { collapsed } = this.state;
        this.setState({ collapsed: !collapsed });
    }
    render (): React.ReactNode {
        const { collapsed , selectedKeys } = this.state;
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
                selectedKeys={selectedKeys}
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
