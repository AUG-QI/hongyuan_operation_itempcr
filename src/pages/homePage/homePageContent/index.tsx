import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CommodityManagement from '../../commodityManagement';
import ShopManagement from '../../commodityManagement/shopManagement';
import InventorySynchronous from '../../inventorySynchronous';
import DistributionFailure from '../../operationLog/distributionFailure';
import InventorySynchronization from '../../operationLog/inventorySynchronization';
import ControlsShelves from '../../operationLog/controlsShelves';
import CancelInsteadSales from '../../operationLog/cancelInsteadSales';
import AfterSales from '../../operationLog/afterSales';
import AbnormalPurchaseOrder from '../../operationLog/abnormalPurchaseOrder';
import CancelPurchase from '../../operationLog/cancelPurchase';
import AcceptSingleException from '../../operationLog/acceptSingleException';
import MerchantOrderFailure from '../../operationLog/shelfOrderFailure';
import AbnormalPurchaseOrderList from '../../abnormalPurchaseOrderList';
import RobotList from '../../feishuRobotManagementLog/robotList';
import ModifyLog from '../../feishuRobotManagementLog/modifyLog';
import './index.scss';
import ErqiDemo from '../../erqiDemo';


/** 主页 */
class HomePageContent extends React.Component {
    render (): React.ReactNode {
        return (
            <div className='home-page-content'>
                <Routes>
                    <Route path='commodityManagement' element={<CommodityManagement/>}></Route>
                    <Route path='commodityManagement/list' element={<ShopManagement/>}></Route>
                    <Route path='inventorySynchronous' element={<InventorySynchronous/>}></Route>
                    <Route path='distributionFailure' element={<DistributionFailure/>}></Route>
                    <Route path='inventorySynchronization' element={<InventorySynchronization/>}></Route>
                    <Route path='controlsShelves' element={<ControlsShelves/>}></Route>
                    <Route path='cancelInsteadSales' element={<CancelInsteadSales/>}></Route>
                    <Route path='merchantOrderFailure' element={<MerchantOrderFailure/>}></Route>
                    <Route path='afterSales' element={<AfterSales/>}></Route>
                    <Route path='abnormalPurchaseOrder' element={<AbnormalPurchaseOrder/>}></Route>
                    <Route path='cancelPurchase' element={<CancelPurchase/>}></Route>
                    <Route path='acceptSingleException' element={<AcceptSingleException/>}></Route>
                    <Route path='abnormalPurchaseOrderList' element={<AbnormalPurchaseOrderList/>}></Route>
                    <Route path='robotList' element={<RobotList/>}></Route>
                    <Route path='modifyLog' element={<ModifyLog/>}></Route>
                    {/* <Route path='erqiDemo' element={<ErqiDemo/>}></Route> */}
                </Routes>
            </div>
        );
    }
}

export default HomePageContent;
