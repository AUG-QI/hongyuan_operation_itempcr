import { Button, Modal } from 'antd';
import React from 'react';
import { getPropDefaultValue } from '../../../../api/mapToolApi';
import { PLATFORM_IMG } from '../../../components/selectPlatform';
import { isEmpty } from '../../../services/utils';

interface CheckFixedValueDialogProps {
    checkFixedValueDialogData:  any;
    closeCheckFixedValueDialog: () => void;
}

interface CheckFixedValueDialogState {
    fixedValueList: any;

}

class CheckFixedValueDialog extends React.Component<CheckFixedValueDialogProps, CheckFixedValueDialogState> {
    constructor (props: CheckFixedValueDialogProps) {
        super(props);
        this.state = {
            fixedValueList: [],
        };
    }
    componentDidMount (): void {
        this.getPropDefaultValue();
    }
    /** 获取属性设置的默认值 */
    getPropDefaultValue = async () => {
        const { checkFixedValueDialogData } = this.props;
        const res = await getPropDefaultValue(checkFixedValueDialogData);
        if (res.length) {
            this.setState({ fixedValueList: res });
        }
        this.setState({ fixedValueList: res });
    }
    render () {
        const { closeCheckFixedValueDialog, checkFixedValueDialogData } = this.props;
        const { fixedValueList } = this.state;
        /** 无数据 */
        const emptyData = () => {
            return <div>
                暂无固定值
            </div>;
        };
        const doudianList = fixedValueList?.filter((item: any) => item.plantform === 'DOUDIAN');
        const kuishouList = fixedValueList?.filter((item: any) => item.plantform === 'KWAISHOP');
        const shipinghaoList = fixedValueList?.filter((item: any) => item.plantform === 'WXVIDEOSHOP');
        return (<Modal footer={null} title={`已设置属性 ${checkFixedValueDialogData.ayname}`} className='check-fixed-value-dialog' open={true} onCancel={closeCheckFixedValueDialog.bind(this)}>
            <div>
                {
                    isEmpty(fixedValueList) && emptyData()
                }
                {
                    doudianList?.map((item: any) => {
                        const names = item.default_names.split(',');
                        return <div key={item.map_prop_id} className='platform-info'>
                            <div className='platform-label'>
                                <img  className='platform-img' src={PLATFORM_IMG.doudian} alt="" />
                                <div>抖音:</div>
                            </div>
                            <div className='platform-item'>
                                {
                                    names.map((item: any) => {
                                        return  <span className='platform-item-info' key={item}> {item}</span>
                                    })
                                }
                            </div>
                        </div>;
                    })
                }
                {
                    kuishouList?.map((item: any) => {
                        const names = item.default_names.split(',');
                        return <div key={item.map_prop_id} className='platform-info'>
                            <div className='platform-label'>
                                <img  className='platform-img' src={PLATFORM_IMG.kuai} alt="" />
                                <div>快手:</div>
                            </div>
                            <div className='platform-item'>
                                {
                                    names.map((item: any) => {
                                        return  <span className='platform-item-info' key={item}> {item}</span>
                                    })
                                }
                            </div>
                        </div>;
                    })
                }
                {
                    shipinghaoList?.map((item: any) => {
                        const names = item.default_names.split(',');
                        return <div key={item.map_prop_id} className='platform-info'>
                            <div className='platform-label'>
                                <img  className='platform-img' src={PLATFORM_IMG.shipinhao} alt="" />
                                <div>视频号:</div>
                            </div>
                            <div className='platform-item'>
                                {
                                    names.map((item: any) => {
                                        return  <span className='platform-item-info' key={item}> {item}</span>;
                                    })
                                }
                            </div>
                        </div>;
                    })
                }
                <div className='setting-footer'>
                    <Button className='footer-btn' type="primary" onClick={closeCheckFixedValueDialog.bind(this)}>确定</Button>
                </div>
                {/* {
                    kuishouList?.map(item => {
                        return <div key={item.map_prop_id} className='platform-info'><img  className='platform-img' src={PLATFORM_IMG.kuai} alt="" /> <Input value={item.ay_prop_name} disabled></Input></div>
                    })
                }
                {
                    shipinghaoList?.map(item => {
                        return <div key={item.map_prop_id} className='platform-info'><img  className='platform-img' src={PLATFORM_IMG.shipinhao} alt="" /> <Input value={item.ay_prop_name} disabled></Input></div>
                    })
                } */}
                {/* <div className='platform-info'><img  className='platform-img' src={PLATFORM_IMG.doudian} alt="" /> <Input value={dyInputValue} onChange={this.changeInputValue.bind(this, 'dyInputValue')} placeholder='设置固定值'></Input></div>
                <div className='platform-info' ><img  className='platform-img'src={PLATFORM_IMG.kuai} alt="" /> <Input value={ksInputValue} onChange={this.changeInputValue.bind(this, 'ksInputValue')} placeholder='设置固定值'></Input></div>
                <div className='platform-info'><img  className='platform-img'src={PLATFORM_IMG.shipinhao} alt="" /> <Input value={sphInputValue} onChange={this.changeInputValue.bind(this, 'sphInputValue')} placeholder='设置固定值'></Input></div> */}
            </div>
        </Modal>);
    }
}

export default CheckFixedValueDialog;
