/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-12-06 14:13:16
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-12-08 16:22:22
 * @FilePath: /hongyuan_operation_itempcr/src/pages/mapList/component/birthRecommendDomainDialog.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Button, Input, message, Modal } from "antd";
import React, { ChangeEvent } from "react";
import Clipboard from 'clipboard';
import { PLATFORM_IMG } from "../../../components/selectPlatform";

interface BirthRecommendDomainDialogProps {
    /** 处理生成值域弹框点击回调 */
    handleBirthRecommendDomainDialogCallback: Function;
    /** 默认推荐值域名 */
    defaultRecommendedName: string;
    copyInputData: any;
    domainData: any;
    biyaoPlatformData: any;
}

interface BirthRecommendDomainDialogState {
    /** 推荐名称 */
    recommendedName: string;
}
/** 生成值域弹框 */
class BirthRecommendDomainDialog extends React.Component<BirthRecommendDomainDialogProps, BirthRecommendDomainDialogState> {
    constructor (props: BirthRecommendDomainDialogProps) {
        super(props);
        this.state = { recommendedName: '' };
    }
    /** 改变推荐值域名字(只修改复制的时候 不修改本身) */
    changeRecommendedName = (event: ChangeEvent<any>) => {
        this.setState({ recommendedName: event.target.value });
    }
    /** 复制值域信息 */
    getClipboardText = (arr: any, name: any) => {
        const text = `${name}`;
        let text2 = arr?.map((item: any) => {
            return item.ay_prop_value_name;
        }).join('\n');
        text2 = `\n${text2}`;
        return text + text2;
    }
    /**
     * 处理复制值域信息
     */
    handleCopeDomainInfo = () => {
        const copy = new Clipboard('.copy-btn');
        copy.on('success', e => {
            message.success('复制成功');
            copy.destroy(); // 解决：弹多次复制成功！
        });
        copy.on('error', (e) => {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }
    render () {
        const { handleBirthRecommendDomainDialogCallback, defaultRecommendedName, copyInputData, domainData, biyaoPlatformData } = this.props;
        const { recommendedName } = this.state;
        return <Modal title="值域信息" className='recommend-value-dialog' open={true} footer={null}  onCancel={handleBirthRecommendDomainDialogCallback.bind(this, 'close')}>
            <div>
                <div className='recommend-value-box'>
                    <div className='recommend-value-name'>推荐值域名字:</div>
                    <Input value={recommendedName || defaultRecommendedName} onChange={this.changeRecommendedName.bind(this)}></Input>
                </div>
                <div className='recommend-value-box'>
                    <div className='recommend-value-name'>推荐值域:</div>
                    <div className='recommend-value'>
                        {
                            copyInputData?.map((item: any, index: any) => {
                                let src = '';
                                if (item.platform) {
                                    src = PLATFORM_IMG[item.platform.toLowerCase()];
                                }
                                return <div key={index} className='recommend-value-inputs' >
                                    <Input value={item.ay_prop_value_name} readOnly></Input>
                                    { src && <img src={src}/>}
                                </div>;
                            })
                        }
                    </div>
                </div>
            </div>
            {domainData && domainData?.length && <div className='note-info'>注：无公共值域，提供各平台值域作为参考</div>}
            <Button type={'primary'} data-clipboard-text={this.getClipboardText(biyaoPlatformData?.ay_pvalues_data, recommendedName || defaultRecommendedName)} className="copy-btn" onClick={this.handleCopeDomainInfo}>复制全部值域</Button>
        </Modal>;
    }
}

export default BirthRecommendDomainDialog;
