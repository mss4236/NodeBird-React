import { ADD_COMMENT_REQUEST } from "../reducers/post";
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from "react";
import propTypes from 'prop-types';
import { Button, Form, Input } from "antd";

// 게시글에 댓글 다는 창 컴포넌트
const CommentForm = ({ post }) => {
    const [commentText, setCommentText] = useState("");
    const { isAddingComment, commentAdded } = useSelector((state) => state.post);
    const { me } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const onSubmitComment = useCallback(
        (e) => {
            e.preventDefault();
            if (!me) {
                return alert("로그인이 필요합니다.");
            }
            return dispatch({
                type: ADD_COMMENT_REQUEST,
                data: {
                    postId: post.id,
                    content: commentText,
                },
            });
        },
        [me && me.id, commentText]
    );

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    }, []);

    // 댓글 입력 성공시 댓글입력창 초기화
    useEffect(() => {
        setCommentText("");
    }, [commentAdded === true]);

    return (
        <Form onSubmit={onSubmitComment}>
            <Form.Item>
                <Input.TextArea row={4} value={commentText} onChange={onChangeCommentText} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>등록</Button>
        </Form>
    );
};

CommentForm.propTypes = {
    post: propTypes.object.isRequired,
};

export default CommentForm;