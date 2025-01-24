import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../commarslogo.png';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('로그아웃 되었습니다.');
        setUser(null); // 사용자 정보 초기화
        navigate('/login');
      } else {
        alert('로그아웃 실패');
      }
    } catch (err) {
      console.error('로그아웃 오류:', err);
    }
  };

  return (
    <HeaderContainer>
      <Navbar>
        <Logo onClick={() => navigate('/')}>
          <img src={logo} alt="ComMars Logo" />
        </Logo>
        <NavLinks>
          <li><a href="/commars">Commars</a></li>
          <li><a href="/today-random">오늘 뭐 먹지?</a></li>
          <li><a href="/community">커뮤니티</a></li>
          <li><a href="/top-reviewers">인기 리뷰어</a></li>
          {user ? (
            <>
              <li><Nickname onClick={() => navigate('/mypage')}>{user.name}</Nickname></li>
              <li><LogoutButton onClick={handleLogout}>로그아웃</LogoutButton></li>
            </>
          ) : (
            <>
              <li><a href="/login">로그인</a></li>
              <li><a href="/signup">회원가입</a></li>
            </>
          )}
        </NavLinks>
      </Navbar>
    </HeaderContainer>
  );
};

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
  cursor: pointer;
  img {
    height: 40px;
    width: auto;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-left: 20px;
    font-size: 16px;
  }

  a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    transition: color 0.2s;

    &:hover {
      color: #007bff;
    }
  }
`;

const Nickname = styled.span`
  cursor: pointer;
  color: #333;
  font-weight: bold;

  &:hover {
    color: #007bff;
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
    color: #007bff;
  }
`;

export default Header;
