import React from "react";
import { Card, Icon, Avatar, Button, Form, List, Input, Comment } from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { ADD_COMMENT_REQUEST } from "../reducers/post";
import { useEffect } from "react";

const PostCard = ({ post }) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState("");
    const { me } = useSelector((state) => state.user);
    const { isAddingComment, commentAdded } = useSelector((state) => state.post);
    const dispatch = useDispatch();

    // 댓글 입력 성공시 댓글입력창 초기화
    useEffect(() => {
        setCommentText("");
    }, [commentAdded === true]);

    // 댓글 아이콘 누르면 펼쳐지고 닫히고
    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);

    const onSubmitComment = useCallback(
        (e) => {
            e.preventDefault();
            if (!me) {
                return alert("로그인이 필요합니다.");
            }
            dispatch({
                type: ADD_COMMENT_REQUEST,
                data: {
                    postId: post.id,
                },
            });
        },
        [me && me.id]
    );

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    }, []);

    return (
        <div>
            <Card
                key={+post.createdAt}
                cover={post.img && <img alt="example" src={post.img} />}
                actions={[<Icon type="retweet" key="retweet"></Icon>, <Icon type="heart" key="heart"></Icon>, <Icon type="message" key="message" onClick={onToggleComment}></Icon>, <Icon type="ellipsis" key="ellipsis"></Icon>]}
                extra={<Button>팔로우</Button>}
            >
                <Card.Meta avatar={<Avatar>{post.User.nickname[0]}</Avatar>} title={post.User.nickname} description={post.content} />
            </Card>
            {commentFormOpened && (
                <>
                    {/* 댓글입력창 */}
                    <Form onSubmit={onSubmitComment}>
                        <Form.Item>
                            <Input.TextArea row={4} value={commentText} onChange={onChangeCommentText} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={isAddingComment}>
                            삐약
                        </Button>
                    </Form>
                    {/* 댓글리스트 */}
                    <List
                        header={`${post.Comments ? post.Comments.length : 0} 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments || []}
                        renderItem={(item) => (
                            <li>
                                <Comment author={item.User.nickname} avatar={<Avatar>{item.User.nickname[0]}</Avatar>} content={item.content} />
                            </li>
                        )}
                    />
                </>
            )}
        </div>
    );
};

export default PostCard;
