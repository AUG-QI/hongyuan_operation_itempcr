import React from 'react';
import { getSpecifiedTime, OPERATION_LOG_DATA } from '.';
import { getDelRelationLog } from './api';
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

/** 取消代销日志 */
class CancelInsteadSales extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            searchVal: {},
            total: 0,
            tableData: [],
            defaultMomentValue: null,
            loading: true,
            // searchList: [{name: 1}, {name: 2}]

        };
    }
    componentDidMount (): void {
        const { searchVal } = this.state;
        const { momentTime, formateDate } = getSpecifiedTime('30');
        // 这里目前字段只能写死了
        this.setState({ searchVal: { ...searchVal, time: formateDate  }, defaultMomentValue: momentTime }, () => {
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
     * 数组转字符串
     */
    arrayConversionString = (array: string[]) => {
        return array.join(',');
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
        // 处理一下搜索参数里面的页码
        const searchDataJson = JSON.stringify(searchVal);
        const searchData = JSON.parse(searchDataJson);
        // 处理一下参数
        if (searchVal.pageNo) {
            searchData.page_no = searchVal.pageNo;
            delete searchData.pageNo;
        }
        if (searchVal.pageSize) {
            searchData.page_size = searchVal.pageSize;
            delete searchData.pageSize;
        }
        if (searchVal.time) {
            searchData.time = this.arrayConversionString(searchVal.time);
        }
        const res: any = await getDelRelationLog(searchData);
        this.setState({ tableData: res.items, total: res.total_amount, loading: false });
    }
    render (): React.ReactNode {
        const { searchVal, total, tableData, defaultMomentValue, loading } = this.state;
        return <div className="inventory-synchronization">
            <LogSearch defaultMomentValue={defaultMomentValue}  searchKeyList={OPERATION_LOG_DATA.CANCEL_INSTEAD_SALES_SEARCH_LIST} onSearch={this.onSearch}></LogSearch>
            <LogTable rowKey='log_id' loading={loading} tableData={tableData} tableTitle={OPERATION_LOG_DATA.CANCEL_INSTEAD_SALES_TABLE_ALL_LIST}></LogTable>
            <LogPaging total={total} changePage={this.changePage} pageNo={searchVal.pageNo || 1}></LogPaging>
        </div>;
    }
}

export default CancelInsteadSales;
