import React from "react";
import { Button, Modal, Input, message } from "antd";

const { Search } = Input;
interface BatchBindDialogProps {
    /** 处理点击回调 */
    handleBatchBindDialogCallback: Function;
    /** 搜索返回结果 */
    batchBindSearchResult: any;
}

interface BatchBindDialogState {
    inputValue: string;
}


/** 批量绑定弹框 */
class BatchBindDialog extends React.Component<BatchBindDialogProps, BatchBindDialogState> {
    constructor (props: BatchBindDialogProps) {
        super(props);
        this.state = { inputValue: '' };
    }
    /** 点击搜索 */
    onSearch = (val: string) => {
        if (!val) {
            return message.warning('请先输入属性ID');
        }
        const { handleBatchBindDialogCallback } = this.props;
        handleBatchBindDialogCallback && handleBatchBindDialogCallback('search', val);
    }
    /** 改变input框内容 */
    changeInputVal = (event: any) => {
        this.setState({ inputValue: event.target.value });
    }
    render () {
        const { handleBatchBindDialogCallback, batchBindSearchResult } = this.props;
        const { inputValue } = this.state;
        return (
            <Modal title="批量绑定" open={true} footer={null} onCancel={handleBatchBindDialogCallback.bind(this, 'close')}>
                <Search value={inputValue} onSearch={this.onSearch} onChange={this.changeInputVal}></Search>
                { batchBindSearchResult === null ? null : <div>
                    { batchBindSearchResult.platform_prop_name ? <div>
                        <div>
                        查询结果: {batchBindSearchResult.platform_prop_name}
                        </div>
                        <div>绑定至所选类目的爱用属性： {batchBindSearchResult.ay_prop_name}</div>
                    </div> : <div>暂无搜索结果</div>}
                </div>}
                <div className='submit-btn'><Button type={'primary'} onClick={handleBatchBindDialogCallback.bind(this, 'submit')}>确定</Button></div>
            </Modal>
        );
    }
}

export default BatchBindDialog;
