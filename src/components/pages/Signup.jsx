import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import logo from "../../commarslogo.png";

function Signup() {
  return (
    <div className="auth-container">
      <img src={logo} alt="ComMars Logo" className="logo" />
      <h1>ComMars</h1>
      <div className="auth-box">
        <div className="input-group">
          <input type="text" placeholder="아이디" />
          <button className="check-btn">중복확인</button>
        </div>
        <input type="password" placeholder="비밀번호" />
        <input type="password" placeholder="비밀번호 확인" />
        <div className="input-row">
          <input type="text" placeholder="이름" />
          <input type="text" placeholder="성별" />
        </div>
        <button className="signup-btn">회원가입</button>
        <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
      </div>
    </div>
  );
}

export default Signup;
