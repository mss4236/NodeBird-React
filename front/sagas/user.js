import { all, fork, takeLatest, put, delay, call } from "redux-saga/effects";
import { LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, LOG_IN_REQUEST, LOG_OUT_FAILURE, LOG_OUT_SUCCESS, LOG_OUT_REQUEST } from "../reducers/user";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3065/api"; // 공통부분

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

///////////////////////////////////////////////////

function logOutAPI() {
  return axios.post("/user/logout/");
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

export default function* userSaga() {
  yield all([
    fork(watchLogin), // fork는 함수 비동기적 호출
    fork(watchSignUp),
    fork(watchLogOut),
  ]);
}
