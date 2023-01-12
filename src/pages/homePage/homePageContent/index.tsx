/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-11-23 16:27:58
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2023-01-12 11:17:49
 * @FilePath: /hongyuan_operation_itempcr/src/pages/homePage/homePageContent/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
import DomainTool from '../../domainTool/domainTool';
import MapTool from "../../mapList/mapTool";
import InventoryOperation from '../../operationLog/inventoryOperation';
import AddressTool from '../../toolPages/addressTool';
import './index.scss';
import CategoryTool from '../../toolPages/categoryTool';


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
                    <Route path='inventoryOperation' element={<InventoryOperation/>}></Route>
                    <Route path='abnormalPurchaseOrder' element={<AbnormalPurchaseOrder/>}></Route>
                    <Route path='cancelPurchase' element={<CancelPurchase/>}></Route>
                    <Route path='acceptSingleException' element={<AcceptSingleException/>}></Route>
                    <Route path='abnormalPurchaseOrderList' element={<AbnormalPurchaseOrderList/>}></Route>
                    <Route path='robotList' element={<RobotList/>}></Route>
                    <Route path='modifyLog' element={<ModifyLog/>}></Route>
                    <Route path='mapTool' element={<MapTool/>}></Route>
                    <Route path='domainTool' element={<DomainTool/>}></Route>
                    {false && <Route path='addressTool' element={<AddressTool/>}></Route>}
                    <Route path='categoryTool' element={<CategoryTool/>}></Route>
                    {/* <Route path='erqiDemo' element={<ErqiDemo/>}></Route> */}
                </Routes>
            </div>
        );
    }
}

export default HomePageContent;
