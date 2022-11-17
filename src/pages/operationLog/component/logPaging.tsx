import React from 'react';
import { Pagination, ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import '../index.scss';

interface IProps {
    /** 改变页码 */
    changePage: Function;
    /** 总数 */
    total: number;
    /** 当前页 */
    pageNo: number;
    pageSizeOptions?: string[];
}
interface IState {
    /** 搜索参数 */
    searchVal: any;
    /** 页面大小选项 */
    pageSizeOptions: string[];
}

/** 日志表格 */
class LogPaging extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            searchVal: {},
            pageSizeOptions: ['50', '100', '150', '200'],
        };
    }
    componentDidMount (): void {
        const { pageSizeOptions = [] } = this.props;
        if (pageSizeOptions.length) {
            this.setState({ pageSizeOptions });
        }
    }
    /**
     * 改变当前页
     * @param pageNo 页码
     * @param pageSize 页面大小
     */
    changePage = (pageNo: number, pageSize: number) => {
        const { changePage } = this.props;
        const searchData = {
            pageNo,
            pageSize,
        };
        changePage && changePage(searchData);
    }
    render (): React.ReactNode {
        const { total = 0, pageNo = 1 } = this.props;
        const { pageSizeOptions } = this.state;
        return <div className="log-paging" >
            <ConfigProvider locale={zh_CN}>
                <Pagination showTotal={(total) => `共 ${total} 项 `} showSizeChanger={true} defaultPageSize={50} current={pageNo} total={total} onChange={this.changePage} pageSizeOptions={pageSizeOptions}/>
            </ConfigProvider>
        </div>;
    }
}

export default LogPaging;
