import React from 'react';
import { getSpecifiedTime, OPERATION_LOG_DATA } from '.';
import { searchItemRemovedLog } from './api';
import LogPaging from './component/logPaging';
import LogSearch from './component/logSearch';
import LogTable from './component/logTable';

interface IProps {}
interface IState {
    // searchList: any;
    searchVal: any;
    total: number;
    tableData: any;
    defaultMomentValue: any;
    loading: boolean;
}

/** 管控下架日志 */
class ControlsShelves extends React.Component<IProps, IState> {
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
        this.setState({ searchVal: { ...searchVal, removedTime: formateDate }, defaultMomentValue: momentTime }, () => {
            this.hanldeSearch();
        });
    }
    /**
     * 点击搜索
     */
    onSearch = (val: any, type: string) => {
        const searchValJson = JSON.stringify(val);
        const searchVal = JSON.parse(searchValJson);
        if (searchVal.platformName === 'all') {
            delete searchVal.platformName;
        }
        // 处理一下没有时间的情况
        if (type === 'reset' || !val.removedTime) {
            const { formateDate } = getSpecifiedTime('30');
            searchVal.removedTime = formateDate;
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
        const searchDataJson = JSON.stringify(searchVal);
        const searchData = JSON.parse(searchDataJson);
        // 兼容node大小写的数据 哎
        if (searchVal.page_size) {
            searchData.pageSize = searchVal.page_size;
            delete searchData.page_size;
        }
        if (searchVal.page_no) {
            searchData.pageNo = searchVal.page_no;
            delete searchData.page_no;
        }
        const res: any = await searchItemRemovedLog(searchVal);
        if (!res.data) {
            return;
        }
        this.setState({ tableData: res.data, total: res.count, loading: false });
    }
    render (): React.ReactNode {
        const { searchVal, total, tableData, defaultMomentValue, loading } = this.state;
        return <div className="inventory-synchronization">
            <LogSearch defaultMomentValue={defaultMomentValue}  searchKeyList={OPERATION_LOG_DATA.CONTROLS_SHELVES_SEARCH_LIST} onSearch={this.onSearch}></LogSearch>
            <LogTable loading={loading} rowKey='id' tableTitle={OPERATION_LOG_DATA.CONTROLS_SHELVES_TABLE_ALL_LIST} tableData={tableData}></LogTable>
            <LogPaging total={total} changePage={this.changePage} pageNo={searchVal.pageNo || 1}></LogPaging>
        </div>;
    }
}

export default ControlsShelves;
