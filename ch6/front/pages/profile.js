// 내 정보 페이지
import React, { useCallback } from 'react';
import PostCard from '../components/PostCard';
import NicknameEditForm from '../components/NicknameEditForm';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, REMOVE_FOLLOWER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import FollowList from '../components/FollowList';

const Profile = () => {
    const { followingList, followerList, hasMoreFollowers, hasMoreFollowings } = useSelector(state => state.user);
    const { mainPosts, } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const onRemoveFollower = useCallback(userId => () => {
        dispatch({
            type: REMOVE_FOLLOWER_REQUEST,
            data: userId,
        });
    }, []);

    const loadMoreFollowers = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
            offset: followerList.length
        });
    }, [followerList.length]);

    const loadMoreFollowings = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST,
            offset: followingList.length
        });
    }, [followingList.length]);

    const onUnfollow = useCallback(userId => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId
        });
    }, []);

    return (
        <>
            <NicknameEditForm />
            {/* 팔로잉 목록 */}
            <FollowList
                header="팔로잉 목록"
                hasMore={hasMoreFollowings}
                onClick={loadMoreFollowings}
                dataSource={followingList}
                renderItemOnClick={onUnfollow}
            />
            {/* 팔로워 목록 */}
            <FollowList
                header="팔로워 목록"
                hasMore={hasMoreFollowers}
                onClick={loadMoreFollowers}
                dataSource={followerList}
                renderItemOnClick={onRemoveFollower}
            />
            {mainPosts.map((c, i) => {
                return <PostCard key={c + i} post={c} />;
            })}
        </>
    );
};

Profile.getInitialProps = async (context) => {
    const state = context.store.getState(); // state 사용할 수 있게  

    context.store.dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: state.user.me && state.user.me.id,
        offset: 0
    });
    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: state.user.me && state.user.me.id,
        offset: 0
    });
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
};

export default Profile;