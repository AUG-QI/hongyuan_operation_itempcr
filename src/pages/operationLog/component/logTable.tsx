import { ConfigProvider, Spin, Table } from 'antd';
import React from 'react';
import zh_CN from 'antd/es/locale/zh_CN';
import { doHello } from '../distributionFailure';
import '../index.scss';

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
    const data = {
        shop_type: info.store_id,
        distribute_memo: info.error_msg,
        update_time: info.update_time,
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
