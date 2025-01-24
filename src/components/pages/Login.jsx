import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './Auth.css';
import logo from "../../commarslogo.png";

function Login() {
  const navigate = useNavigate(); 
  return (
    <div className="auth-container">
      <img src={logo} alt="ComMars Logo" className="logo" />
      <h1>ComMars</h1>
      <div className="auth-box">
        <input type="text" placeholder="아이디" />
        <input type="password" placeholder="비밀번호" />
        <div className="options">
        <div className="left-options">
          <label htmlFor="remember">
            <input type="checkbox" id="remember" />로그인 유지하기
          </label>
        </div>
          <div className="links">
            <Link to="/find-id">아이디 찾기</Link>
            <br />
            <Link to="/find-password">비밀번호 찾기</Link>
          </div>
        </div>
        <button className="login-btn">로그인</button>
        <button className="signup-btn" onClick={() => navigate('/signup')}>
          회원가입
        </button>
        <p>소셜 계정으로 로그인</p>
        <div className="social-login">
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Naver Login" />
          <img src="https://play-lh.googleusercontent.com/jYtnK__ibJh9emODIgTyjZdbKym1iAj4RfoVhQZcfbG-DuTSHR5moHVx9CQnqg1yoco9" alt="Google Login" />
          <img src="https://images-eds-ssl.xboxlive.com/image?url=4rt9.lXDC4H_93laV1_eHM0OYfiFeMI2p9MWie0CvL99U4GA1gf6_kayTt_kBblFwHwo8BW8JXlqfnYxKPmmBcX6wYOjOFZaAfhmaS_qZ1FVPHfdui.5HuBGyop8__579sxOqlLvEujryqUaobxN2G1sE09XJfKAZwtAwOvv8Nc-&format=source" alt="Naver Login" />
        </div>
      </div>
    </div>
  );
}

export default Login;
