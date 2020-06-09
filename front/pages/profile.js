// 내 정보 페이지
import React from 'react';
import { Form, List, Input, Button, Card, Icon } from 'antd';
import NicknameEditForm from '../components/NicknameEditForm';

const Profile = () => {
    return (
        <>
            <NicknameEditForm/>
            {/* 팔로잉 목록 */}
            <List
                style={{ marginBottom: '20px' }}
                grid={{ gutter: 4, xs: 2, md: 3}}
                size="small"
                header={<div>팔로잉 목록</div>}
                loadMore={<Button style={{ width: '100%' }}>더보기</Button>}
                bordered
                dataSource={['박경민', '바보', '노드버드오피셜']}
                renderItem={item => (
                    <List.Item style={{ marginTop: '20px' }}>
                        <Card actions={[<Icon key="stop" type="stop"/>]}><Card.Meta description={item}></Card.Meta></Card>
                    </List.Item>
                )}
            />
            {/* 팔로워 목록 */}
            <List
                style={{ marginBottom: '20px' }}
                grid={{ gutter: 4, xs: 2, md: 3}}
                size="small"
                header={<div>팔로워 목록</div>}
                loadMore={<Button style={{ width: '100%' }}>더보기</Button>}
                bordered
                dataSource={['박경민', '바보', '노드버드오피셜']}
                renderItem={item => (
                    <List.Item style={{ marginTop: '20px' }}>
                        <Card actions={[<Icon type="stop"/>]}><Card.Meta description={item}></Card.Meta></Card>
                    </List.Item>
                )}
            />
        </>
    );
};

export default Profile;