import propTypes from 'prop-types';
import { Button } from 'antd';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FollowBtn = ({ post }) => {
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.user);

    const onFollow = useCallback((userId) => () => {
        dispatch({
            type: FOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);

    const onUnfollow = useCallback((userId) => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);

    return (
        !me || post.User.id === me.id
            ? null
            : me.Followings && me.Followings.find(v => v.id === post.User.id)
                ? <Button onClick={onUnfollow(post.User.id)}>팔로우취소</Button>
                : <Button onClick={onFollow(post.User.id)}>팔로우</Button>

    );
};

FollowBtn.propTypes = {
    post: propTypes.object.isRequired,
};

export default FollowBtn;