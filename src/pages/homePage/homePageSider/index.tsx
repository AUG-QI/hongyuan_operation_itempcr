/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-10 23:05:02
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-21 22:20:39
 * @FilePath: /hongyuan_operation_itempcr/src/pages/homePage/homePageSider/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    UploadOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.scss';

function getItem(label, key, icon) {
    return {
        key,
        icon,
        label,
    };
}

const items = [
    getItem('商品管理', 'commodityManagement', <HomeOutlined />),
    getItem('库存同步', 'inventorySynchronous', <UploadOutlined />),
];

const homePageSider = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(['commodityManagement']);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const clickSider = ({ item, key, keyPath, domEvent }) => {
        console.log(location.href, '?????key');
        // if (location.href.includes('/commodityManagement')) {
        //     setSelectedKeys(['commodityManagement']);
        //     return;
        // }
        if (key) {
            location.hash = `/${key}`;
        }
        setSelectedKeys(key);
    };

    useEffect(() => {
        console.log(location.href, '????location.href');

        if (location.href.includes('/commodityManagement')) {
            setSelectedKeys(['commodityManagement']);
            return;
        }
    }, []);

    return (
        <div
            style={{
                width: collapsed ? 80 : 256,
                height: '100%',
            }}
        >
            <Menu
                defaultSelectedKeys={['commodityManagement']}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
                items={items}
                selectedKeys={selectedKeys}
                className="sider-menu"
                onClick={clickSider}
            />
            <Button
                type="primary"
                onClick={toggleCollapsed}
                className="sider-controller"
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
        </div>
    );
};

export default homePageSider;
