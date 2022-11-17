import React from 'react';
import { getSpecifiedTime, OPERATION_LOG_DATA } from './index';
import LogPaging from './component/logPaging';
import LogSearch from './component/logSearch';
import LogTable from './component/logTable';
import { getSyncStockLog } from './api';

interface IProps {}
interface IState {
    searchVal: any;
    total: number;
    tableData: any;
    defaultMomentValue: any;
    loading: boolean;
}

/** 库存同步日志 */
class InventorySynchronization extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            searchVal: {},
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
            this.handleSearch();
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
            this.handleSearch();
        });
    }

    /**
     * 真正开始处理搜索
     * @param page
     */
    handleSearch = async () => {
        const { searchVal } = this.state;
        // 处理一下时间传入格式
        const searchDataJson = JSON.stringify(searchVal);
        const searchData = JSON.parse(searchDataJson);
        if (searchVal.time) {
            searchData.start_time = searchVal.time[0];
            searchData.end_time = searchVal.time[1];
            delete searchData.time;
        }
        if (searchVal.pageNo) {
            searchData.page_no = searchVal.pageNo;
            delete searchData.pageNo;
        }
        if (searchVal.pageSize) {
            searchData.page_size = searchVal.pageSize;
            delete searchData.pageSize;
        }
        const res: any = await getSyncStockLog(searchData);
        this.setState({ tableData: res.logs, total: res.total_amount, loading: false });
    }

    /**
     * 改变页码
     * @param page
     */
    changePage = (val: any) => {
        const { searchVal } = this.state;
        const searchData = {
            ...searchVal,
            ...val,
        };
        this.setState({ searchVal: searchData }, () => {
            this.handleSearch();
        });
    }
    render (): React.ReactNode {
        const { total, searchVal, tableData, defaultMomentValue, loading } = this.state;
        return <div className="inventory-synchronization">
            <LogSearch defaultMomentValue={defaultMomentValue} searchKeyList={OPERATION_LOG_DATA.INVENTORY_SYNCHRONIZATION_SEARCH_LIST} onSearch={this.onSearch}></LogSearch>
            <LogTable loading={loading} rowKey='id' tableData={tableData} tableTitle={OPERATION_LOG_DATA.INVENTORY_SYNCHRONIZATION_ALL_LIST}></LogTable>
            <LogPaging pageNo={searchVal.pageNo || 1} changePage={this.changePage} total={total}></LogPaging>
        </div>;
    }
}

export default InventorySynchronization;
