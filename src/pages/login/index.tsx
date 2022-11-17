import { useNavigate } from 'react-router-dom';
import LoginBlock from '../../components/login/loginBlock';
import { getUserData } from '../../services/UserService';
import './index.scss';

/** 登陆页面 */
const LoginPage = () => {
    const navigate = useNavigate();
    /** 登陆成功 */
    const onLoginSuccessed = async () => {
        await getUserData();
        // location.replace('https://biyao.aiyongtech.com');
        navigate('/commodityManagement');
    };

    return (
        <>
            <div className="login-wrapper">
                <div className="left">
                    <div className="title">
                        <img
                            src="https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/biyao_login_logo.png"
                            alt=""
                        />
                    </div>
                    <div className="login-bg-img">
                        <img
                            src="https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/login_icon.png"
                            alt=""
                        />
                    </div>
                </div>
                <div className="login">
                    <div className="login-title">账号登陆</div>
                    <LoginBlock onLoginSuccessed={onLoginSuccessed} />
                </div>
            </div>
        </>
    );
};

export default LoginPage;
