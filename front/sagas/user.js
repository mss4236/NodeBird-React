import { all, call, takeLatest, put } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE } from '../reducers/user';

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
    } catch(e) {
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE
        });
    }
}

function* watchLogin() {
    yield takeLatest(LOG_IN, login);    // takeLatest가 LOG_IN액션이 dispatch되길 기다려서 dispatch될 때 login 제너레이터를 호출한다
}

export default function* userSaga() {
    yield all([
        fork(watchLogin)    // fork는 함수 비동기적 호출
    ]);
}