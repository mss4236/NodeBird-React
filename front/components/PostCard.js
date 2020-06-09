import React from 'react';
import { Card, Icon, Avatar, Button} from 'antd';

const PostCard = ({ c }) => {
    return (
        <Card
            key={+c.createdAt}
            cover={c.img && <img alt="example" src={c.img} />}
            actions={[
                <Icon type="retweet" key="retweet"></Icon>,
                <Icon type="heart" key="heart"></Icon>,
                <Icon type="message" key="message"></Icon>,
                <Icon type="ellipsis" key="ellipsis"></Icon>
            ]}
            extra={<Button>팔로우</Button>}
        >
            <Card.Meta
                avatar={<Avatar>{c.User.nickname[0]}</Avatar>}
                title={c.User.nickname}
                description={c.content}
            />
        </Card>
    );
};

export default PostCard;