
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CommodityManagement from '../../commodityManagement';
import ShopManagement from '../../commodityManagement/shopManagement';
import InventorySynchronous from '../../inventorySynchronous';
import './index.scss';

/** 主页 */
class HomePageContent extends React.Component {
    render (): React.ReactNode {
        return (
            <div className='home-page-content'>
                <Routes>
                    <Route path='commodityManagement' element={<CommodityManagement/>}></Route>
                    <Route path='commodityManagement/list' element={<ShopManagement/>}></Route>
                    <Route path='inventorySynchronous' element={<InventorySynchronous/>}></Route>
                </Routes>
            </div>
        );
    }
}

export default HomePageContent;
