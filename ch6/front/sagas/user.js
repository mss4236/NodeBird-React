import { all, fork, takeLatest, put, delay, call, takeEvery } from "redux-saga/effects";
import {
  LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
  SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
  LOG_OUT_FAILURE, LOG_OUT_SUCCESS, LOG_OUT_REQUEST,
  LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE,
  FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_SUCCESS, UNFOLLOW_USER_FAILURE,
  REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE, LOAD_FOLLOWINGS_REQUEST, EDIT_NICKNAME_REQUEST, EDIT_NICKNAME_SUCCESS, EDIT_NICKNAME_FAILURE
} from "../reducers/user";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3065/api"; // 공통부분

// Login
function loginAPI(loginData) {
  // 서버에 요청을 보내는 부분
  return axios.post("/user/login/", loginData, {
    withCredentials: true, // 프론트와 백엔드에서 쿠키를 주고 받을 수 있는 설정, 프론트랑 백엔드 둘다 해줘야함
  });
}

function* login(action) {
  try {
    const result = yield call(loginAPI, action.data); // call은 함수 동기적 호출
    // call 이 아니라 fork를 하면 서버에서 답을 받던 안받던 밑에 put를 실행해버림(비동기 호출이기 때문이다)
    // 응답을 받아서 실행해야하는 경우에는 동기 호출인 call을 사용해야한다
    yield put({
      // put는 dispatch랑 동일
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOG_IN_FAILURE,
      error: e,
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login); // takeLatest가 LOG_IN_REQUEST액션이 dispatch되길 기다려서 dispatch될 때 login 제너레이터를 호출한다
}

// ------------------------------------------------------------------------------------------------------
// watchSignUp()에서 SIGN_UP_REQUEST가 dispatch되면 signUp를 실행하고,
// signUp()에서 서버를 호출하고[signUpAPI()] 결과에 따라 dispatch(put)를 한다
function signUpAPI(signUpData) {
  return axios.post("/user/", signUpData);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: e,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

// Logout ------------------------------------------------------------------------------------------------------
function logOutAPI() {  // 서버는 로그인 여부를 프론트에서 보내는 쿠키로 판단함
  return axios.post("/user/logout/", {}, {
    withCredentials: true,
  });
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: e,
    });
  }
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

// LoadUser ------------------------------------------------------------------------------------------------------
function loadUserAPI(userId) {
  return axios.get(userId ? `user/${userId}/` : '/user/', {
    withCredentials: true,  // CSR :: 클라이언트에서 요청 보낼때는 브라우저가 쿠키를 같이 동봉해서 보내줌
    // SSR :: 프론트서버를 통해서 요청보내기 때문에 브라우저가 없어서 자동으로 쿠키를 동봉해서 보내주지 않아서 내가 넣어야함
  });
}
function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data, // 본인정보 받아온건지, 남의 정보 받아온건지 확인
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_USER_FAILURE,
      error,
    });
  }
}
function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

// Follow ------------------------------------------------------------------------------------------------------
function followUserAPI(userId) {
  return axios.post(`user/${userId}/follow/`, {}, {
    withCredentials: true,
  })
}
function* followUser(action) {
  try {
    const result = yield call(followUserAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error,
    });
  }
}
function* watchFollowUser() {
  yield takeEvery(FOLLOW_USER_REQUEST, followUser);
}

// UnFollow ------------------------------------------------------------------------------------------------------
function unFollowUserAPI(userId) {
  return axios.delete(`/user/${userId}/follow/`, {
    withCredentials: true,
  })
}
function* unFollowUser(action) {
  try {
    const result = yield call(unFollowUserAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error,
    });
  }
}
function* watchUnfollowUser() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unFollowUser);
}

// LoadFollowers ------------------------------------------------------------------------------------------------------
function loadFollowersAPI(userId, offset, limit = 3) {
  return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`, {
    withCredentials: true,
  })
}
function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
      offset: action.offset,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error,
    });
  }
}
function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

// LoadFollowings ------------------------------------------------------------------------------------------------------
function loadFollowingsAPI(userId, offset, limit = 3) {
  return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`, {
    withCredentials: true,
  })
}
function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
      offset: action.offset,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error,
    });
  }
}
function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

// RemoveFollwers ------------------------------------------------------------------------------------------------------
function removeFollowersAPI(userId) {
  return axios.delete(`/user/${userId}/followers/`, {
    withCredentials: true,
  })
}
function* removeFollowers(action) {
  try {
    const result = yield call(removeFollowersAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error,
    });
  }
}
function* watchRemoveFollowers() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollowers);
}

// EditNickname ------------------------------------------------------------------------------------------------------
function editNicknameAPI(nickname) {
  return axios.patch(`/user/nickname/`, { nickname }, {  // 부분수정 patch,,, 전체 수정 put
    withCredentials: true,
  })
}
function* editNickname(action) {
  try {
    const result = yield call(editNicknameAPI, action.data);
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: EDIT_NICKNAME_FAILURE,
      error,
    });
  }
}
function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

// export
export default function* userSaga() {
  yield all([
    fork(watchSignUp),
    fork(watchLogin), // fork는 함수 비동기적 호출
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchFollowUser),
    fork(watchUnfollowUser),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollowers),
    fork(watchEditNickname)
  ]);
}
