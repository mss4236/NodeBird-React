import { all, call, takeLatest, put } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST } from '../reducers/user';
import axios from 'axios';

function loginAPI() {
    // 서버에 요청을 보내는 부분
}

function* login() {
    try {
        yield call(loginAPI);   // call은 함수 동기적 호출
        // call 이 아니라 fork를 하면 서버에서 답을 받던 안받던 밑에 put를 실행해버림(비동기 호출이기 때문이다)
        // 응답을 받아서 실행해야하는 경우에는 동기 호출인 call을 사용해야한다
        yield put({ // put는 dispatch랑 동일
            type: LOG_IN_SUCCESS
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE
        });
    }
}

function* watchLogin() {
    yield takeLatest(LOG_IN, login);    // takeLatest가 LOG_IN액션이 dispatch되길 기다려서 dispatch될 때 login 제너레이터를 호출한다
}

// watchSignUp()에서 SIGN_UP_REQUEST가 dispatch되면 signUp를 실행하고,
// signUp()에서 서버를 호출하고[signUpAPI()] 결과에 따라 dispatch(put)를 한다
function signUpAPI() {
    return axios.post('/login');
}

function* signUp() {
    try {
        yield call(signUpAPI);  
        yield put({
            type: SIGN_UP_SUCCESS
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: SIGN_UP_FAILURE
        });
    }
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all([
        fork(watchLogin),    // fork는 함수 비동기적 호출
        fork(watchSignUp)
    ]);
}