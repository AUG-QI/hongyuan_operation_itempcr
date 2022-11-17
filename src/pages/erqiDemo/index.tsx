
import React, { useState } from 'react';
import { Drawer, Radio } from 'antd';
import './index.scss';


function ErqiDemo() {
  // const [open, setOpen] = useState(false);
  // const [value, setValue ] = useState('');
  // const onFocus = (item, event) => {
  //   event.preventDefault();
  //   console.log('focus', item);
  
  //   setOpen(true);
    
  // }
  // const blur = (item,event) => {
  //   event.preventDefault();
  //   console.log('onClose', item);
  //   const demo = document.getElementById(`input${item+1}`);
  //   if (!demo) {
  //     setOpen(false);
  //     return;
  //   }
  //   demo?.focus();
  //   console.log(demo?.focus, '????');
    
  //   // demo.onFocus();
 
  //   // setOpen(false);
    
  // }
  // const onclick = (item, e) => {
  //   console.log('onclick', item);
  //   setValue(item)
  //   // event.stopPropagation();
  //   // event.preventDefault();
    
  // }
  // const arr = [1,2,3];
  // return (
  //   <div className='erqi-demo'>
  //     {
  //       arr.map(item => {
  //         return <input key={item} id={`input${item}`} value ={value} onBlur={blur.bind(this, item)} readOnly onFocus={onFocus.bind(this, item)}></input>;
  //       })
  //     }
  //     { open && <div className='drawer'>
  //     {
  //         arr.map(item => {
  //           return <Radio key={item} onChange={onclick.bind(this, item)}>Radio1</Radio>
  //         })
  //       }
  //     </div>}
  //   </div>
  // );
}

export default ErqiDemo;
