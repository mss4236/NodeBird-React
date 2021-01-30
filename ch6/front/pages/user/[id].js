import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../components/PostCard';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import { Avatar, Card } from 'antd';
import { LOAD_USER_REQUEST } from '../../reducers/user';

const UserId = () => {
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();
    const { mainPosts, hasMorePost } = useSelector(state => state.post);
    const { userInfo } = useSelector(state => state.user);
    const countRef = useRef([]);

    // useEffect(() => {
    //     dispatch({
    //         type: LOAD_USER_REQUEST,
    //         data: id,
    //     });
    //     dispatch({
    //         type: LOAD_USER_POSTS_REQUEST,
    //         data: id,
    //     });
    // }, []);

    const onScroll = useCallback(() => {
        if (hasMorePost && (mainPosts.length - 1) !== -1) {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) { // 스크롤 다 내리기 전까지 300남았을 때 
                const lastId = mainPosts[mainPosts.length - 1].id;
                if (!countRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_USER_POSTS_REQUEST,
                        data: id,
                        lastId,
                    });
                }
                countRef.current.push(lastId);
            }
        }
    }, [mainPosts.length, hasMorePost]);

    // 인피니트 스크롤링을 위한 addEventListener달기
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPosts]);

    return (
        <>
            <div>
                {userInfo ? (
                    <Card
                        actions={[<div key="twit">게시글<br />{userInfo.Posts}</div>,
                        <div key="following">팔로잉<br />{userInfo.Followings}</div>,
                        <div key="followers">팔로워<br />{userInfo.Followers}</div>,
                        ]}>
                        <Card.Meta avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                            title={userInfo.nickname}
                        />
                    </Card>
                ) : null}
                {mainPosts.map(c => (
                    <PostCard key={+c.createdAt} post={c} />
                ))}
            </div>
        </>
    );
};

UserId.getInitialProps = async (context) => {
    const { id } = context.query;
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: id,
    });
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: id,
    });
};

export default UserId;