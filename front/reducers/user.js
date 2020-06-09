// user reducer ((((((((((( store은 정확하게는 state, action, reducer가 합쳐진 것 )))))))))))

const dummyUser = {
    nickname: 'PKM',
    Post: [],
    Followings: [],
    Followers: [],
};

// store
export const initialState = {
    isLoggedIn: false,
    user: {
        nickname: '박경민',
        Post: [],
        Followings: [],
        Followers: [],
    },
    signUpData: {},
};

// action의 이름들
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';

export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';


// 실제 액션들
export const loginAction = (data) => {
    return {
        type: LOG_IN_REQUEST,
        data,
    };  
};
export const loginSuccessAction = {
    type: LOG_IN_SUCCESS,
}
export const loginFailureAction = {
    type: LOG_IN_FAILURE,
}

export const logoutAction = {
    type: LOG_OUT_REQUEST,
    user: null,
};
export const logoutSuccessAction = {
    type: LOG_OUT_SUCCESS,
}
export const logoutFailureAction = {
    type: LOG_OUT_FAILURE,
}

export const userSignUpAction = (data) => { // action에 넣을 데이터가 동적인 경우에는 action을 함수로 만든다 ㅇㅋ?
    return {
        type: SIGN_UP_REQUEST,
        data: data
    };
};
export const userSignUpSucessAction = {
    type: SIGN_UP_SUCCESS,
}
export const userSignUpFailureAction = {
    type: SIGN_UP_FAILURE,
}

// reducer
const reducer = (state = initialState, action) => {
    switch(action.type) {
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
                user: dummyUser,
                isLoading: false,
            }
        }
        case LOG_OUT_REQUEST: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                isLoading: true,
            }
        }
        case SIGN_UP_REQUEST: {
            return {
                ...state,
                signUpData: action.data,
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