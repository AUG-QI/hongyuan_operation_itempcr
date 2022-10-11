import React, { ChangeEvent } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './index.scss';

interface IProps {
    /** 处理input搜索 */
    handleInputSearch: Function;
    /** 来自 */
    from?: string;
    /** 输入框内容 */
    inputVal: string | number;
    /** 处理输入框搜索 */
    handleChangeInputVal: Function;
}
interface IState {
    /** 输入框提示 */
    placeholder: string;
}

/** input搜索框 */
class SearchInput extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = { placeholder: '请输入关键词/ID进行搜索' };
    }

    componentDidMount (): void {
        const { from } = this.props;
        if (from === 'distributors') {
            const placeholder = '请输入分销商名称/ID搜索';
            this.setState({ placeholder });
        }
    }
    /**
     * 改变输入框值
     */
    changeInputValue = (event: ChangeEvent<any>): void => {
        const { handleChangeInputVal } = this.props;
        handleChangeInputVal(event.target.value);
    }

    /**
     * 点击搜索
     */
    onSearch = (): void => {
        const { handleInputSearch, inputVal } = this.props;
        handleInputSearch(inputVal);
    }

    render (): React.ReactNode {
        const { placeholder } = this.state;
        const { inputVal } = this.props;
        return (
            <div className='search-input'>
                <Input placeholder={placeholder} value={inputVal} onChange={this.changeInputValue}/>
                <div className='input-search-icon' onClick={this.onSearch}><SearchOutlined /></div>
            </div>
        );
    }
}

export default SearchInput;
