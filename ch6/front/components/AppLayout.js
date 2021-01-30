// 레이아웃(고정)
import React from "react";
import { Menu, Input, Row, Col, Card, Avatar } from "antd";
import Link from "next/link";
import PropTypes from "prop-types"; // 부모로부터 prop을 잘 받았는지 확인하는거
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import Router from "next/router";

const TagSearchInput = styled(Input.Search)`
  vertical-Align: middle;
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  /*  SSR을 위해 _app.js의 getInitialProps에 씀 (페이지에서만 쓸 수 있으므로 여기에서는 못씀) 
    useEffect(() => {
      if (!me) {
        dispatch({
          type: LOAD_USER_REQUEST,
        });
      }
    }, []);
  */

  const onSearch = (value) => {
    Router.push('/hashtag/[hashtag]', `/hashtag/${value}`);  // 프로그래밍적으로 페이지를 바꾸는 방법 Router, 컴포넌트적으로 페이지를 바꾸는 방법 Link
  };

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>NodeBird</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          {me ? <Link href="/profile"><a>프로필</a></Link>
            : <Link href="/"><a>프로필</a></Link>}
        </Menu.Item>
        <Menu.Item key="mail">
          <TagSearchInput enterButton onSearch={onSearch} />   {/* 상단 태그 검색창 */}
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6} style={{ color: "blue" }}>
          Made by PKM
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  Component: PropTypes.elementType, //  jsx에 들어갈 수 있는 모든것들을 node로 침(예를 들면, 문자열, 숫자, 불리언 등등)
};

export default AppLayout;
