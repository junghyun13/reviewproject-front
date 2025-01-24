import React, { useState } from "react";
import styled from "styled-components"; // 스타일링 라이브러리
import logo from "../../commarslogo.png";
import { useNavigate } from "react-router-dom"; // 페이지 이동에 필요한 useNavigate

const Header = () => {
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("홍길동"); // 예시 닉네임
  const navigate = useNavigate();

  // 로그아웃 핸들러
  const handleLogout = () => {
    setIsLoggedIn(false);
    setNickname(""); // 유저 정보 초기화
    alert("로그아웃 되었습니다.");
    navigate("/"); // 로그아웃 후 홈으로 이동
  };

  return (
    <HeaderContainer>
      <Navbar>
        {/* 로고 이미지 */}
        <Logo>
          <img src={logo} alt="Commars Logo" />
        </Logo>

        {/* 네비게이션 링크 */}
        <NavLinks>
          <li>
            <a href="/commars">Commars</a>
          </li>
          <li>
            <a href="/today-random">오늘 뭐 먹지?</a>
          </li>
          <li>
            <a href="/home">커뮤니티</a>
          </li>
          <li>
            <a href="#!">인기 리뷰어</a>
          </li>

          {/* 로그인 여부에 따라 UI 변경 */}
          {isLoggedIn ? (
            <>
              <li>
                <Nickname onClick={() => navigate("/mypage")}>
                  {nickname}
                </Nickname>
              </li>
              <li>
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login">로그인</a>
              </li>
              <li>
                <a href="/signup">회원가입</a>
              </li>
            </>
          )}
        </NavLinks>
      </Navbar>
    </HeaderContainer>
  );
};

// 스타일 정의 (styled-components 사용)
const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Navbar = styled.nav`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  justify-content: space-between;
`;

const Logo = styled.div`
  img {
    height: 40px; /* 로고 크기 제한 */
    width: auto;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-left: 20px; /* 링크 간격 */
    font-size: 16px;
  }

  a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    transition: color 0.2s;

    &:hover {
      color: #007bff; /* 호버 시 색상 변경 */
    }
  }
`;

const Nickname = styled.span`
  cursor: pointer;
  color: #333;
  font-weight: bold;
  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;

export default Header;
