/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-10-17 14:42:04
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2023-01-06 12:18:10
 * @FilePath: /hongyuan_operation_itempcr/src/pages/operationLog/component/logTable.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ConfigProvider, Spin, Table } from 'antd';
import React from 'react';
import zh_CN from 'antd/es/locale/zh_CN';
import { doHello } from '../distributionFailure';
import '../index.scss';
import { getFirstDayOfMonth } from '..';

interface IProps {
    tableTitle: any;
    tableData: any;
    rowKey: string;
    loading: boolean;
}
/**
 * 错误数量跳转
 * @param text
 * @param data
 * @returns
 */
export const errorNumLink = (text: string, data: any) => {
    return <a onClick={errorNumLinkSearch.bind(this, data)}>{text}</a>;
};
/**
 * 点击错误数字需要搜索的参数
 * @param info
 */
const errorNumLinkSearch = (info: any) => {
    const date = new Date();
    const data = {
        shop_type: info.store_id,
        distribute_memo: info.error_msg,
        start_time: getFirstDayOfMonth(date),
        end_time: info.update_time,
    };
    doHello(data);
};
/** 日志表格 */
class LogTable extends React.Component<IProps> {
    constructor (props: IProps) {
        super(props);
        this.state = {};
    }
    render (): React.ReactNode {
        const { tableTitle, tableData, rowKey, loading = false } = this.props;
        return <div className="log-table">
            <Spin spinning={loading}>
                <ConfigProvider locale={zh_CN}>
                    <Table pagination={false} rowKey={rowKey || 'id'} dataSource={tableData} scroll={{ x: 200, y: 1000 }} columns={tableTitle} />
                </ConfigProvider>
            </Spin>
        </div>;
    }
}

export default LogTable;
