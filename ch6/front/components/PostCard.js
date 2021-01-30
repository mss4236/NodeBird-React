import React, { memo } from "react";
import { Card, Icon, Avatar, Button, List, Comment, Popover, Form, Input } from "antd";
import Link from 'next/link';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { LIKE_POST_REQUEST, LOAD_COMMENTS_REQUEST, REMOVE_POST_REQUEST, RETWEET_REQUEST, REVISE_POST_REQUEST, UNLIKE_POST_REQUEST } from "../reducers/post";
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import styled from 'styled-components';
import monent from 'moment';
import CommentForm from './CommentForm';
import FollowBtn from './FollowBtn';

monent.locale('ko');

const CardWrapper = styled.div`
    margin-bottom: 20px;
`;

const PostCard = memo(({ post }) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [revisePostOpened, setRevisePostOpened] = useState(false);
    const [text, setText] = useState(post.content);
    const id = useSelector((state) => state.user.me && state.user.me.id);
    const dispatch = useDispatch();

    const liked = id && post.Likers && post.Likers.find(v => v.id === id);

    // 댓글 아이콘 누르면 펼쳐지고 닫히고
    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
        dispatch({
            type: LOAD_COMMENTS_REQUEST,
            data: post.id,
        });
    }, []);

    const onChangeInputTextArea = useCallback((e) => {
        setText(e.target.value);
    }, []);

    const onToggleLike = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        if (liked) {  // 좋아요 누른 상태 (likers에 해당 게시글 좋아요 누른사람 id있음)
            return dispatch({
                type: UNLIKE_POST_REQUEST,
                data: post.id,
            });
        } else {
            return dispatch({
                type: LIKE_POST_REQUEST,
                data: post.id,
            });
        }
    }, [id, post && post.id, liked]);

    const onRetweet = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, [id, post && post.id]);

    const onRemovePost = useCallback(postId => () => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: postId,
        });
    }, []);

    const onRevisePostOpened = useCallback(() => {
        setRevisePostOpened(prev => !prev);
    }, [revisePostOpened]);

    const onRevisePost = useCallback(() => {
        setRevisePostOpened(prev => !prev);
        dispatch({
            type: REVISE_POST_REQUEST,
            data: {
                postId: post.id,
                postUserId: post.UserId,
                postContent: text,
            }
        });
    }, [text]);

    return (
        <CardWrapper>
            <Card
                key={+post.createdAt}
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <Icon type="retweet" key="retweet" onClick={onRetweet}></Icon>,
                    <Icon type="heart" key="heart" theme={liked ? 'twoTone' : 'outlined'} twoToneColor="#eb2f96" onClick={onToggleLike}></Icon>,
                    <Icon type="message" key="message" onClick={onToggleComment}></Icon>,
                    <Popover
                        key="ellipsis"
                        content={(
                            <Button.Group>
                                {id && post.UserId === id
                                    ? (
                                        <>
                                            {!post.RetweetId && <Button onClick={onRevisePostOpened}>수정</Button>}
                                            <Button type="danger" onClick={onRemovePost(post.id)}>삭제</Button>
                                        </>
                                    )
                                    : <Button>신고</Button>}
                            </Button.Group>
                        )}
                    >
                        <Icon type="ellipsis" key="ellipsis" />
                    </Popover>]}
                title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
                extra={<FollowBtn post={post} />}
            >
                {post.RetweetId && post.Retweet ?
                    (<Card
                        cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
                    >
                        < Card.Meta
                            avatar={<Link href="/user/[id]" as={`/user/${post.Retweet.User.id}`}><a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a></Link>}
                            title={post.Retweet.User.nickname}
                            description={<PostCardContent postData={post.Retweet.content} />}
                        />
                    </Card>)
                    : revisePostOpened ?
                        <Form>
                            <Input.TextArea
                                maxLength={140}
                                value={text}
                                onChange={onChangeInputTextArea}
                            />
                            <div align="right">
                                <Button onClick={onRevisePost}>수정</Button>
                                <Button onClick={onRevisePostOpened}>취소</Button>
                            </div>
                        </Form>
                        :
                        (< Card.Meta
                            avatar={<Link href="/user/[id]" as={`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}    // next 9버전 href="/user/[id].js" 로 쓰면 새로고침됨 .js 빼니깐 새로고침없이 잘됨
                            title={post.User.nickname}
                            description={<PostCardContent postData={post.content} />}
                        />)
                }
                {monent(post.createdAt).format('YYYY.MM.DD.')}
            </Card>

            {
                commentFormOpened && (
                    <>
                        {/* 댓글입력창 */}
                        <CommentForm post={post} />

                        {/* 댓글리스트 */}
                        <List
                            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
                            itemLayout="horizontal"
                            dataSource={post.Comments || []}
                            renderItem={(item) => (
                                <li>
                                    <Comment
                                        author={item.User.nickname}
                                        avatar={<Link href={"/user/[id]"} as={`/user/${post.User.id}`}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
                                        content={item.content}
                                    />
                                    {monent(item.createdAt).format('YYYY.MM.DD.')}
                                </li>
                            )}
                        />
                    </>
                )
            }
            <br />
        </CardWrapper >
    );
});

export default PostCard;
