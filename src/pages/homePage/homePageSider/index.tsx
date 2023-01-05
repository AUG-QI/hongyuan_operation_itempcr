import React from 'react';
import {
    UploadOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    FileTextOutlined,
    ExceptionOutlined,
    TeamOutlined,
    ToolOutlined
} from '@ant-design/icons';
import { Button, Menu, Modal } from 'antd';
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
            { label: '库存操作日志', key: '/inventoryOperation' },
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
    {
        label: '工具',
        key: '/tool',
        icon: <ToolOutlined />,
        children: [
            { label: '属性工具', key: '/mapTool' },
            { label: '值域工具', key: '/domainTool' },
            { label: '地址工具', key: '/addressTool' },
        ],
    },
    false && {
        label: 'demo',
        key: '/erqiDemo',
        icon: <ExceptionOutlined />,
    },
];
// const retentionDialog = (text, handleOk, handleCancel) => {
//     console.log(text, '???');
    
//     return <Modal title="Basic Modal" open={true}>
//     <p>{text}</p>
//     <p>Some contents...</p>
//     <p>Some contents...</p>
//   </Modal>
// }
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
        // 删除搜索参数
        const searchDataJson = sessionStorage.getItem('commoditySearchData');
        if (searchDataJson) {
            sessionStorage.removeItem('commoditySearchData');
        }
        // 查看工具设置保存
        const editStatus = sessionStorage.getItem('editorStatus');
        if (editStatus === '1') {
            // 挽留弹框
            // retentionDialog('保存', ()=> {}, ()=> {});
            Modal.confirm({
                title: '温馨提示',
                content: (
                    <div>
                        <p>当前编辑内容暂未保存</p>
                    </div>
                ),
                okText: '继续跳转',
                cancelText: '我知道了',
                onOk: () => {
                    location.hash = `${key}`;
                    sessionStorage.removeItem('editorStatus');
                },
            });
            return;
        }
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
                    style={{ width: collapsed ? '80px' : '200px', overflow: 'auto' }}
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
