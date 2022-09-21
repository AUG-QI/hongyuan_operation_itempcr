/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-09 03:39:26
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-21 17:05:42
 * @FilePath: /simple-react-0909/src/pages/login/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useNavigate } from 'react-router-dom';
import LoginBlock from '../../components/login/loginBlock';
import { setUserInfo } from '../../services/UserService';
import './index.scss';

const LoginPageForMultipleShop = () => {
    const navigate = useNavigate();
    const onLoginSuccessed = async (res: any) => {
        // setUserInfo(res);
        console.log('werwerwe', 'qyt_');
        
        navigate('/');
    };

    const handleLinkKefu = () => {
        window.open(
            'https://amos.alicdn.com/getcid.aw?spm=2013.1.1000126.5.cd86d7bTdi79x&v=3&groupid=0&s=1&charset=utf-8&uid=爱用科技&site=cntaobao'
        );
    };

    return (
        <>
            <div className="login-wrapper">
                <div className="left">
                    <div className="title">
                        <img src="https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/biyao_login_logo.png" alt="" />
                    </div>
                    <div className='login-bg-img'>
                        <img src="https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/login_icon.png" alt="" />
                    </div>
                </div>
                <div className="login">
                    <div className='login-title'>账号登陆</div>
                    <LoginBlock onLoginSuccessed={onLoginSuccessed} />
                </div>
            </div>
        </>
    );
};

export default LoginPageForMultipleShop;
