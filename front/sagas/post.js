import { all, call, takeLatest, delay, put, fork } from "redux-saga/effects";
import { ADD_POST_REQUEST, ADD_POST_FAILURE, ADD_POST_SUCCESS, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE } from "../reducers/post";

// Post
function addPostAPI() {}

function* addPost() {
    try {
        yield call(addPostAPI);
        yield delay(2000);
        yield put({
            type: ADD_POST_SUCCESS,
        });
    } catch (e) {
        yield put({
            type: ADD_POST_FAILURE,
            error: e,
        });
    }
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

// Comments
function addCommentAPI() {}

function* addComment(action) {
    // ADD_COMMENT_REQUEST의 action을 받아봐서 사용가능
    try {
        //yield call(addCommentAPI);
        yield delay(2000);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: {
                postId: action.data.postId,
            },
        });
    } catch (e) {
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: e,
        });
    }
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
    yield all([fork(watchAddPost), fork(watchAddComment)]);
}
