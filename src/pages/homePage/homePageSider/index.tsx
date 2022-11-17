import React from 'react';
import {
    UploadOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    FileTextOutlined,
    ExceptionOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import './index.scss';


const ITEMS = [
    {
        label: '商品管理',
        key: '/commodityManagement',
        icon: <HomeOutlined />,
    },
    {
        label: '库存同步',
        key: '/inventorySynchronous',
        icon: <UploadOutlined />,
    },
    {
        label: '关键操作日志',
        key: '/operationKeyLog',
        icon: <FileTextOutlined />,
        children: [
            { label: '铺货失败日志', key: '/distributionFailure' },
            { label: '库存同步日志', key: '/inventorySynchronization' },
            { label: '管控下架日志', key: '/controlsShelves' },
            { label: '取消代销日志', key: '/cancelInsteadSales' },
            { label: '商家订单失败日志', key: '/MerchantOrderFailure' },
            { label: '售后日志', key: '/afterSales' },
            { label: '采购单异常日志', key: '/abnormalPurchaseOrder' },
            { label: '取消采购日志', key: '/cancelPurchase' },
            { label: '受理单异常日志', key: '/acceptSingleException' },
        ],
    },
    {
        label: '异常采购单列表',
        key: '/abnormalPurchaseOrderList',
        icon: <ExceptionOutlined />,
    },
    {
        label: '飞书机器人管理',
        key: '/feishuRobotManagement',
        icon: <TeamOutlined />,
        children: [
            { label: '机器人列表', key: '/robotList' },
            { label: '修改日志', key: '/modifyLog' },
        ],
    },
    false && {
        label: 'demo',
        key: '/erqiDemo',
        icon: <ExceptionOutlined />,
    },
];
interface IState {
    /** 侧边栏收缩框 */
    collapsed: boolean;
    /** 选中的侧边栏key */
    selectedKeys: string[];
}
/** 主页侧边栏 */
class HomePageSider extends React.Component<{pathname: string}, IState> {
    state = {
        collapsed: false,
        selectedKeys: [],
    };

    componentDidMount (): void {
        ITEMS.forEach((item: any) => {
            if (location.href.includes(`/${item.key}`)) {
                this.setState({ selectedKeys: [item.key] });
            }
        });
    }
    clickSider = ({ key }: any): void => {
        sessionStorage.removeItem('commoditySearchData');
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
            <div style={{ height: '100%' }}>
                <Menu
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    // @ts-ignore
                    items={ITEMS}
                    selectedKeys={[pathname]}
                    className="sider-menu"
                    onClick={this.clickSider}
                    style={{ width: collapsed ? '80px' : '200px' }}
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
