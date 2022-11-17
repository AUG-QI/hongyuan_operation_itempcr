import React from 'react';
import { getSpecifiedTime, OPERATION_LOG_DATA } from '.';
import { getOperationLog } from './api';
import LogPaging from './component/logPaging';
import LogSearch from './component/logSearch';
import LogTable from './component/logTable';

interface IProps {}
interface IState {
    searchVal: any;
    total: number;
    tableData: any;
    defaultMomentValue: any;
    loading: boolean;
}
/** 售后日志 */
class AfterSales extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            searchVal: { type: 'afterSales' },
            total: 0,
            tableData: [],
            defaultMomentValue: null,
            loading: true,
        };
    }
    componentDidMount (): void {
        const { searchVal } = this.state;
        const { momentTime, formateDate } = getSpecifiedTime('30');
        // 这里目前字段只能写死了
        this.setState({ searchVal: { ...searchVal, time: formateDate }, defaultMomentValue: momentTime }, () => {
            this.hanldeSearch();
        });
    }
    /**
     * 点击搜索
     */
    onSearch = (val: any, type: string) => {
        const searchVal = val;
        // 处理一下没有时间的情况
        if (type === 'reset' || !val.time) {
            const { formateDate } = getSpecifiedTime('30');
            searchVal.time = formateDate;
        }
        this.setState({ searchVal }, () => {
            this.hanldeSearch();
        });
    }


    /**
     * 改变每页条数
     * @param val
     */
    changePage = (val: any) => {
        const { searchVal } = this.state;
        const searchData = { ...searchVal, ...val };
        this.setState({ searchVal: searchData }, () => {
            this.hanldeSearch();
        });
    }

    /**
     * 真正开始搜索
     */
    hanldeSearch = async () => {
        const { searchVal } = this.state;
        // 处理一下时间传入格式
        const searchDataJson = JSON.stringify(searchVal);
        const searchData = JSON.parse(searchDataJson);
        if (searchVal.time) {
            searchData.startTime = searchVal.time[0];
            searchData.endTime = searchVal.time[1];
            delete searchData.time;
        }
        if (!searchData.type) {
            searchData.type = 'afterSales';
        }
        const res: any = await getOperationLog(searchData);
        this.setState({ tableData: res.operationOrderAfterSalesLogList, total: res.count, loading: false });
    }

    render (): React.ReactNode {
        const { searchVal, total, tableData, defaultMomentValue, loading } = this.state;
        return <div className="after-sales">
            <LogSearch defaultMomentValue={defaultMomentValue} searchKeyList={OPERATION_LOG_DATA.AFTER_SALES_SEARCH_LIST} onSearch={this.onSearch}></LogSearch>
            <LogTable loading={loading} rowKey='key' tableData={tableData} tableTitle={OPERATION_LOG_DATA.AFTER_SALES_TABLE_ALL_LIST}></LogTable>
            <LogPaging total={total} changePage={this.changePage} pageNo={searchVal.pageNo || 1}></LogPaging>
        </div>;
    }
}

export default AfterSales;
