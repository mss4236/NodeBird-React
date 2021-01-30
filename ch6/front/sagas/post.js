import { all, call, takeLatest, delay, put, fork, takeEvery, throttle } from "redux-saga/effects";
import {
    ADD_POST_REQUEST, ADD_POST_FAILURE, ADD_POST_SUCCESS,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    LOAD_COMMENTS_REQUEST, LOAD_COMMENTS_SUCCESS, LOAD_COMMENTS_FAILURE,
    LOAD_MAIN_POSTS_REQUEST, LOAD_MAIN_POSTS_FAILURE, LOAD_MAIN_POSTS_SUCCESS,
    LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
    LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
    UPLOAD_IMGES_REQUEST, UPLOAD_IMGES_SUCCESS, UPLOAD_IMGES_FAILURE,
    LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE, UNLIKE_POST_REQUEST,
    UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE, RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE, REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE, LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE, REVISE_POST_REQUEST, REVISE_POST_SUCCESS, REVISE_POST_FAILURE
} from "../reducers/post";
import axios from 'axios';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

// 한 번 불러온 모듈은 캐싱이되기 때문에 user saga에서 axios defaultURL을 /api로 한게 post saga에서도 적용이 된다

// add Post
function addPostAPI(postData) {
    return axios.post('/post', postData, {
        withCredentials: true,
    });
}
function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({ // post reducer의 데이터 수정
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
        yield put({ // user reducer의 데이터 수정
            type: ADD_POST_TO_ME,
            data: result.data.id,
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

// loadMain Post----------------------------------------------------------------------------------
function loadMainPostsAPI(lastId = 0, limit = 10) {
    return axios.get(`/posts?lastId=${lastId}&limit=${limit}`);
}
function* loadMainPosts(action) {
    try {
        const result = yield call(loadMainPostsAPI, action.lastId);
        yield put({
            type: LOAD_MAIN_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: LOAD_MAIN_POSTS_FAILURE,
            error,
        });
    }
}
function* watchLoadMainPosts() {
    yield throttle(2000, LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

// loadUser Post-----------------------------------------------------------------------------------------------------
function loadUserPostsAPI(id, lastId = 0, limit = 10) {
    return axios.get(`/user/${id || 0}/posts?lastId=${lastId}&limit=${limit}`);
}
function* loadUserPosts(action) {
    try {
        const result = yield call(loadUserPostsAPI, action.data, action.lastId);
        yield put({
            type: LOAD_USER_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: LOAD_USER_POSTS_FAILURE,
            error,
        });
    }
}
function* watchLoadUserPosts() {
    yield throttle(2000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

// load Hastag Post----------------------------------------------------------------------------------------------------------------------
function loadHashtagPostsAPI(tag, lastId = 0, limit = 10) {
    return axios.get(`/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}&limit=${limit}`);
}
function* loadHashtagPosts(action) {
    try {
        const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
        yield put({
            type: LOAD_HASHTAG_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: LOAD_HASHTAG_POSTS_FAILURE,
            error,
        });
    }
}
function* watchLoadHashtagPosts() {
    yield throttle(2000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

// add Comments (댓글 추가)
function addCommentAPI(commentData) {
    return axios.post(`/post/${commentData.postId}/comment`, { content: commentData.content }, {
        withCredentials: true,
    });
}
function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: {
                postId: action.data.postId,
                comment: result.data,
            }
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

// load comment (댓글 불러오기)
function loadCommentsAPI(postId) {
    return axios.get(`/post/${postId}/comments`);
}
function* loadComments(action) {
    try {
        const result = yield call(loadCommentsAPI, action.data);
        yield put({
            type: LOAD_COMMENTS_SUCCESS,
            data: {
                postId: action.data,
                comments: result.data,
            }
        });
    } catch (error) {
        yield put({
            type: LOAD_COMMENTS_FAILURE,
            error: error
        });
    }
}
function* watchLoadComments() {
    yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

// images upload(이미지 업로드)
function uploadImagesAPI(formData) {
    return axios.post(`/post/images`, formData, {
        withCredentials: true,
    });
}
function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type: UPLOAD_IMGES_SUCCESS,
            data: result.data   // 이미지 저장된 주소 받음
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: UPLOAD_IMGES_FAILURE,
            error: error,
        });
    }

}
function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMGES_REQUEST, uploadImages);
}

// 좋아요
function likePostAPI(postId) {
    return axios.post(`/post/${postId}/like`, {}, {
        withCredentials: true,
    });
}
function* likePost(action) {
    try {
        const result = yield call(likePostAPI, action.data);
        yield put({
            type: LIKE_POST_SUCCESS,
            data: {
                postId: action.data,
                userId: result.data.userId,
            }
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: LIKE_POST_FAILURE,
            error: error,
        });
    }

}
function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}

// 좋아요 취소
function unlikePostAPI(postId) {
    return axios.delete(`/post/${postId}/like`, {
        withCredentials: true,
    });
}
function* unlikePost(action) {
    try {
        const result = yield call(unlikePostAPI, action.data);
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: {
                postId: action.data,
                userId: result.data.userId,
            }
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: error,
        });
    }

}
function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

// 리트윗
function retweetAPI(postId) {
    return axios.post(`/post/${postId}/retweet`, {}, {
        withCredentials: true,
    });
}
function* retweet(action) {
    try {
        const result = yield call(retweetAPI, action.data);
        yield put({
            type: RETWEET_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: RETWEET_FAILURE,
            error: error,
        });
        alert(error.response && error.response.data);
    }

}
function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet);
}

// 게시글 제거 -------------------------------------------------------------------
function removePostAPI(postId) {
    return axios.delete(`/post/${postId}`, {
        withCredentials: true,
    });
}
function* removePost(action) {
    try {
        const result = yield call(removePostAPI, action.data);
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: REMOVE_POST_OF_ME,
            data: result.data
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: REMOVE_POST_FAILURE,
            error: error,
        });
    }

}
function* watchRomovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

// Load Post :: 포스트 하나만 불러옴 ----------------------------------------------------------------------
function loadPostAPI(postId) {
    return axios.get(`/post/${postId}`);
}
function* loadPost(action) {
    try {
        const result = yield call(loadPostAPI, action.data);
        yield put({
            type: LOAD_POST_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_POST_FAILURE,
            error: error,
        });
    }

}
function* watchLoadPost() {
    yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

// Revise Post :: 포스트 수정
function revisePostAPI(data) {
    return axios.patch(`/post/${data.postId}/patch`, data, {
        withCredentials: true,
    });
}
function* revisePost(action) {
    try {
        const result = yield call(revisePostAPI, action.data);
        yield put({
            type: REVISE_POST_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: REVISE_POST_FAILURE,
            error: error,
        });
    }

}
function* watchRevisePost() {
    yield takeLatest(REVISE_POST_REQUEST, revisePost);
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost),
        fork(watchLoadMainPosts),
        fork(watchAddComment),
        fork(watchLoadHashtagPosts),
        fork(watchLoadUserPosts),
        fork(watchLoadComments),
        fork(watchUploadImages),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchRetweet),
        fork(watchRomovePost),
        fork(watchLoadPost),
        fork(watchRevisePost)]);
}
