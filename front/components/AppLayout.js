// 레이아웃(고정)
import React from "react";
import { Menu, Input, Row, Col, Card, Avatar } from "antd";
import Link from "next/link";
import PropTypes from "prop-types"; // 부모로부터 prop을 잘 받았는지 확인하는거
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";
import { useSelector } from "react-redux";

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>NodeBird</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
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

AppLayout.prototype = {
  Component: PropTypes.elementType, //  jsx에 들어갈 수 있는 모든것들을 node로 침(예를 들면, 문자열, 숫자, 불리언 등등)
};

export default AppLayout;
