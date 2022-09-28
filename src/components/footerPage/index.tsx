// @ts-ignore
import React, { ChangeEvent } from 'react';
import { Button, Checkbox, message, Modal, Pagination, Spin } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';
import './index.scss';
import axios from 'axios';
import config from '../../config';
interface IProps {
    /** 处理全选按钮 */
    handelSelectAll: Function;
    /** 改变页码 */
    changePageSize: Function;
    /** 处理操作按钮 */
    handelOperationBtn: Function;
    /**  是否全选 */
    isAllValue: boolean;
    /** 来自 */
    from: string;
    /** 总数 */
    total: number | any;
    /** 选中数量 */
    selectNum: number | any;
    /** 当前页 */
    pageNo: number;
}
interface IState {
    /** 每页条数 */
    pageSize: number;
    /** 导出选项可见 */
    exportOptionsVisble: boolean;
    /** 上传文件弹框 */
    uploadFileDialogVisible: boolean;
    /** 加载状态 */
    spinning: boolean;
}
/** 翻页器组建 */
class FooterPage extends React.Component<IProps, IState>  {
    constructor (props: IProps) {
        super(props);
        this.state = {
            pageSize: 20,
            exportOptionsVisble: false,
            uploadFileDialogVisible: false,
            spinning: false,
        };
    }
    componentDidMount (): void {
        // @ts-ignore
        document.addEventListener('click', this.clickExportOption.bind(this, false));
    }

    /**
     * 点击全选
     * @returns
     */
    handelSelectAll = (event: ChangeEvent<any>) => {
        const { handelSelectAll } = this.props;
        const isAllValue = event.target.checked;
        handelSelectAll(isAllValue);
    }

    /**
     * 改变页码
     * @returns
     */
    changePageSize = (val: number) => {
        const { changePageSize } = this.props;
        changePageSize(val);
    }

    /**
     * 关闭选择框
     * @returns
     */
    clickExportOption = (val: boolean, event: ChangeEvent<any>) => {
        event.stopPropagation();
        this.setState({ exportOptionsVisble: val });
    }
    /**
     * 处理导入商品
     * @returns
     */
    handelImportItems = () => {
        const { handelOperationBtn } = this.props;
        this.setState({ uploadFileDialogVisible: true });
        handelOperationBtn('importItems');
    }
    /**
     * 关闭上传弹框
     * @returns
     */
    closeUploadInfoDialog = () => {
        this.setState({ uploadFileDialogVisible: false });
    }
    /**
     * 上传文件
     * @returns
     */
    updateFile = () => {
        const filetUpload = document.getElementById('filetUpload');
        filetUpload?.click();
    }
    /**
     * 处理批量下架
     */
    handelTakenDownBtn = () => {
        const { handelOperationBtn } = this.props;
        handelOperationBtn('takenDown');
    }

    /**
     * 处理导出
     * @param e
     */
    handleFiletUpload = (event: ChangeEvent<any>) => {
        const files = event.target.files;
        const formData = new FormData();
        this.setState({ spinning: true });
        formData.append('file', files[0]);
        axios.post(`${config.BASE_URL}/itemManage/importModifedFile`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
        })
            .then((response) => {
                if (response.data.code !== 200) {
                    return message.error('上传失败,请检查表格是否填写完整');
                }
                message.success('上传成功');
                this.setState({ uploadFileDialogVisible: false, spinning: false });
            })
            .catch(() => {
                this.setState({ uploadFileDialogVisible: false, spinning: false  });
                return message.error('上传失败,请检查表格是否填写完整');
            });
    }

    render () {
        const { from, isAllValue, handelOperationBtn, total, selectNum,  pageNo } = this.props;
        const { pageSize, exportOptionsVisble, uploadFileDialogVisible, spinning } = this.state;
        return (
            <div className="footer-page">
                <div className="operation-btns">
                    <Checkbox
                        className="export-checkbox"
                        checked={isAllValue === true}
                        // @ts-ignore
                        onChange={this.handelSelectAll}
                    >
                        全选本页{selectNum > 0 && <span>（{selectNum}）</span>}
                    </Checkbox>
                    {from === 'productList' && (
                        <>
                            <Button
                                type="primary"
                                className="export-btn"
                                onClick={this.clickExportOption.bind(this, true)}
                            >
                                导出商品
                            </Button>
                            <Button type="primary" onClick={this.handelImportItems.bind(this)} className="export-btn">
                                导入商品
                            </Button>
                        </>
                    )}
                    {from === 'distributors' && (
                        <div>
                            <Button type="primary" ghost onClick={() => handelOperationBtn('takenDown')}>批量下架</Button>
                        </div>
                    )}
                    {
                        exportOptionsVisble && <div className='export-options'>
                            <div className='options-item' onClick={() => handelOperationBtn('exportItemSelected')}>所选商品</div>
                            <div className='options-item' onClick={() => handelOperationBtn('exportItemsAll')}>全部商品</div>
                        </div>
                    }
                </div>
                <Pagination
                    total={total}
                    pageSize={pageSize}
                    onChange={this.changePageSize}
                    showSizeChanger={false}
                    current={pageNo}
                />
                <Modal title="导入商品信息" open={uploadFileDialogVisible} onCancel={this.closeUploadInfoDialog} footer={null} className='upload-info-dialog'>
                    <Spin spinning={spinning}>
                        <div className='ant-upload ant-upload-drag' onClick={this.updateFile} >
                            <p className="ant-upload-drag-icon">
                                <ContainerOutlined />
                            </p>
                            <p className="ant-upload-text">点击到这里上传</p>
                            <p className="ant-upload-hint">
                                支持格式：.xls、.xlsx
                            </p>
                        </div>
                    </Spin>
                </Modal>
                <input type="file" id='filetUpload' onChange={this.handleFiletUpload} style={{ display: 'none' }}  />
            </div>
        );
    }
}
export default FooterPage;
