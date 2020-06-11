// user reducer ((((((((((( store은 정확하게는 state, action, reducer가 합쳐진 것 )))))))))))

const dummyUser = {
    nickname: 'PKM',
    Post: [],
    Followings: [],
    Followers: [],
};

// store
export const initialState = {
    isLoggedIn: false,      // 로그인 여부
    isLoggingOut: false,    // 로그아웃 시도중
    isLoggingIn: false,     // 로그인 시도중
    logInErrorReason: '',   // 로그인 에러 사유
    signedUp: false,        // 회원가입 성공
    isSigningUp: false,     // 회원가입 시도중
    singUpErrorReason: '',   // 회원가입 실패 사유
    me: null,               // 내 정보
    followingList: [],      // 팔로잉 리스트
    followerList: [],       // 팔로워 리스트
    userInfo: null,         // 남의 정보
};

// action의 이름들
// 회원가입
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

// 로그인
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

// 로그인 후 사용자 정보 불러오기
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

// 로그아웃
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

// 내 팔로우랑 팔로워 목록 불러오기
export const LOAD_FOLLOW_REQUEST = 'LOAD_FOLLOW_REQUEST';
export const LOAD_FOLLOW_SUCCESS = 'LOAD_FOLLOW_SUCCESS';
export const LOAD_FOLLOW_FAILURE = 'LOAD_FOLLOW_FAILURE';

// 다른사람 팔로우
export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

// 다른사람 언팔로우
export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

// 팔로워중에 언팔
export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

// *중요 (리듀서의 단점때문에 어쩔수 없이 만든 액션)
export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

// 실제 액션들
// 로그인
export const loginRequestAction = data => ({
    type: LOG_IN_REQUEST,
    data,
});
export const loginSuccessAction = {
    type: LOG_IN_SUCCESS,
}
export const loginFailureAction = {
    type: LOG_IN_FAILURE,
}

export const logoutRequestAction = {
    type: LOG_OUT_REQUEST,
    user: null,
};
export const logoutSuccessAction = {
    type: LOG_OUT_SUCCESS,
}
export const logoutFailureAction = {
    type: LOG_OUT_FAILURE,
}

export const userSignUpRequestAction = data => ({ // action에 넣을 데이터가 동적인 경우에는 action을 함수로 만든다 ㅇㅋ?
    type: SIGN_UP_REQUEST,
    data: data
});
export const userSignUpSucessAction = {
    type: SIGN_UP_SUCCESS,
}
export const userSignUpFailureAction = {
    type: SIGN_UP_FAILURE,
}

// reducer
const reducer = (state = initialState, action) => {
    switch(action.type) {
        // LOG_IN 관련
        case LOG_IN_REQUEST: {
            return {
                ...state,
                loginData: action.data,
                isLoading: true,
            }
        }
        case LOG_IN_SUCCESS: {
            return {
                ...state,
                isLoggedIn: true,
                me: dummyUser,
                isLoading: false,
            }
        }
        case LOG_IN_FAILURE: {
            return {

            }
        }
        // LOG_OUT 관련
        case LOG_OUT_REQUEST: {
            return {
                ...state,
                isLoggedIn: false,
                me: null,
                isLoading: true,
            }
        }
        case LOG_OUT_SUCCESS: {
            return {

            }
        }
        case LOG_OUT_FAILURE: {
            return {
                
            }
        }
        // SIGN_UP 관련
        case SIGN_UP_REQUEST: {
            return {
                ...state,
                signUpData: action.data,
            }
        }
        case SIGN_UP_SUCCESS: {
            return {

            }
        }
        case SIGN_UP_FAILURE: {
            return {
                
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
};

export default reducer;