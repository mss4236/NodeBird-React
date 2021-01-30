import React, { useCallback } from "react";
import { Card, Avatar, Form, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducers/user";
import Link from 'next/link';

const UserProfile = () => {
   const { me, isLoggingOut } = useSelector((state) => state.user);
   const dispatch = useDispatch();

   const onLogout = useCallback((e) => {
      e.preventDefault();
      dispatch({
         type: LOG_OUT_REQUEST,
      });
   }, []);

   return (
      <Card
         actions={[
            <Link href='/profile' key="twit"><a><div>게시글<br />{me.Posts.length}</div></a></Link>,
            <Link href='/profile' key="followings"><a><div>팔로잉<br />{me.Followings.length}</div></a></Link>,
            <Link href='/profile' key="follower"><a><div>팔로워<br />{me.Followers.length}</div></a></Link>, /* key는 항상 제일 상위에 */
         ]}
      >
         <Card.Meta avatar={<Avatar>{me.nickname[0]}</Avatar>} title={me.nickname}></Card.Meta>
         <Button type="primary" onClick={onLogout} loading={isLoggingOut}>
            로그아웃
         </Button>
      </Card>
   );
};

export default UserProfile;
