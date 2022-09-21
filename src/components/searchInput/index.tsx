import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './index.scss';

interface IProps {
    /** 处理input搜索 */
    handleInputSearch: Function;
    /** 来自 */
    from: string;
}
interface IState {
    /** 输入框值 */
    value: string;
    /** 输入框提示 */
    placeholder: string;
}

/** input搜索框 */
class SearchInput extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            value: '',
            placeholder: '请输入关键词/ID进行搜索',
        };
    }

    componentDidMount (): void {
        const { from } = this.props;
        if (from === 'distributors') {
            const placeholder = '请输入供应商名称/ID搜索';
            this.setState({ placeholder });
        }
    }
    /**
     * 改变输入框值
     */
    changeInputValue = (e): void => {
        this.setState({ value: e.target.value });
    }

    /**
     * 点击搜索
     */
    onSearch = (): void => {
        const { handleInputSearch } = this.props;
        const { value } = this.state;
        handleInputSearch(value);
    }

    render (): React.ReactNode {
        const { value, placeholder } = this.state;
        return (
            <div className='search-input'>
                <Input placeholder={placeholder} value={value} onChange={this.changeInputValue} allowClear/>
                <div className='input-search-icon' onClick={this.onSearch}><SearchOutlined /></div>
            </div>
        );
    }
}

export default SearchInput;
