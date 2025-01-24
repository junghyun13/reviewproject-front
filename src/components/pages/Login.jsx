import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import logo from '../../commarslogo.png';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 세션 쿠키 포함
      });

      if (response.ok) {
        const user = await response.json(); // JSON 응답 처리
        setUser(user); // 부모 컴포넌트의 사용자 정보 업데이트
        alert('로그인 성공!');
        navigate('/'); // 메인 페이지로 이동
      } else {
        const errorData = await response.json();
        alert(errorData.message || '로그인 실패');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      alert('로그인 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="ComMars Logo" className="logo" />
      <h1>ComMars</h1>
      <div className="auth-box">
        <input
          type="text"
          placeholder="아이디 (이메일)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="options">
          <div className="left-options">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" />
              로그인 유지하기
            </label>
          </div>
          <div className="links">
            <Link to="/find-id">아이디 찾기</Link>
            <br />
            <Link to="/find-password">비밀번호 찾기</Link>
          </div>
        </div>
        <button className="login-btn" onClick={handleLogin}>
          로그인
        </button>
        <button className="signup-btn" onClick={() => navigate('/signup')}>
          회원가입
        </button>
        <p>소셜 계정으로 로그인</p>
        <div className="social-login">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="Naver Login"
          />
          <img
            src="https://play-lh.googleusercontent.com/jYtnK__ibJh9emODIgTyjZdbKym1iAj4RfoVhQZcfbG-DuTSHR5moHVx9CQnqg1yoco9"
            alt="Google Login"
          />
          <img
            src="https://images-eds-ssl.xboxlive.com/image?url=4rt9.lXDC4H_93laV1_eHM0OYfiFeMI2p9MWie0CvL99U4GA1gf6_kayTt_kBblFwHwo8BW8JXlqfnYxKPmmBcX6wYOjOFZaAfhmaS_qZ1FVPHfdui.5HuBGyop8__579sxOqlLvEujryqUaobxN2G1sE09XJfKAZwtAwOvv8Nc-&format=source"
            alt="Naver Login"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
