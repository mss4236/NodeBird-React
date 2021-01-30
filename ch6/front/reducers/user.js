// user reducer ((((((((((( store은 정확하게는 state, action, reducer가 합쳐진 것 )))))))))))
import produce from 'immer';

// store
export const initialState = {
    isLoggingOut: false, // 로그아웃 시도중
    isLoggingIn: false, // 로그인 시도중
    logInErrorReason: "", // 로그인 에러 사유
    signedUp: false, // 회원가입 성공
    isSigningUp: false, // 회원가입 시도중
    singUpErrorReason: "", // 회원가입 실패 사유
    me: null, // 내 정보
    followingList: [], // 팔로잉 리스트
    followerList: [], // 팔로워 리스트
    userInfo: null, // 남의 정보
    isEditingNickname: false, // 닉네임 변경중
    editNicknameErrorReson: '',  // 닉네임 변경 실패 사유
    hasMoreFollowers: false,    // 더보기 버튼을 눌렀을때 표시할 팔로워가 더 있는지
    hasMoreFollowings: false,   // 더보기 버튼을 눌렀을때 표시할 팔로잉이더 있는지
};

// action의 이름들
// 회원가입
export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

// 로그인
export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

// 로그인 후 사용자 정보 불러오기
export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

// 로그아웃
export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

// 내 팔로워 목록 불러오기
export const LOAD_FOLLOWERS_REQUEST = "LOAD_FOLLOWERS_REQUEST";
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS";
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS_FAILURE";

// 내 팔로잉 목록 불러오기
export const LOAD_FOLLOWINGS_REQUEST = "LOAD_FOLLOWINGS_REQUEST";
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE";

// 다른사람 팔로우
export const FOLLOW_USER_REQUEST = "FOLLOW_USER_REQUEST";
export const FOLLOW_USER_SUCCESS = "FOLLOW_USER_SUCCESS";
export const FOLLOW_USER_FAILURE = "FOLLOW_USER_FAILURE";

// 다른사람 언팔로우
export const UNFOLLOW_USER_REQUEST = "UNFOLLOW_USER_REQUEST";
export const UNFOLLOW_USER_SUCCESS = "UNFOLLOW_USER_SUCCESS";
export const UNFOLLOW_USER_FAILURE = "UNFOLLOW_USER_FAILURE";

// 팔로워중에 언팔
export const REMOVE_FOLLOWER_REQUEST = "REMOVE_FOLLOWER_REQUEST";
export const REMOVE_FOLLOWER_SUCCESS = "REMOVE_FOLLOWER_SUCCESS";
export const REMOVE_FOLLOWER_FAILURE = "REMOVE_FOLLOWER_FAILURE";

// 닉네임 수정
export const EDIT_NICKNAME_REQUEST = "EDIT_NICKNAME_REQUEST";
export const EDIT_NICKNAME_SUCCESS = "EDIT_NICKNAME_SUCCESS";
export const EDIT_NICKNAME_FAILURE = "EDIT_NICKNAME_FAILURE";

// *중요 (리듀서의 단점때문에 어쩔수 없이 만든 액션)
export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

// 실제 액션들
// 로그인
export const loginRequestAction = (data) => ({
    type: LOG_IN_REQUEST,
    data,
});
export const loginSuccessAction = {
    type: LOG_IN_SUCCESS,
};
export const loginFailureAction = {
    type: LOG_IN_FAILURE,
    //error: ,
};

export const logoutRequestAction = {
    type: LOG_OUT_REQUEST,
    user: null,
};
export const logoutSuccessAction = {
    type: LOG_OUT_SUCCESS,
};
export const logoutFailureAction = {
    type: LOG_OUT_FAILURE,
};

export const userSignUpRequestAction = (data) => ({
    // action에 넣을 데이터가 동적인 경우에는 action을 함수로 만든다 ㅇㅋ?
    type: SIGN_UP_REQUEST,
    data,
});
export const userSignUpSucessAction = {
    type: SIGN_UP_SUCCESS,
};
export const userSignUpFailureAction = {
    type: SIGN_UP_FAILURE,
};

// reducer
export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            // LOG_IN 요청 ----------------------------------------------------------------------------------
            case LOG_IN_REQUEST: {
                draft.isLoggingIn = true;
                draft.logInErrorReason = "";
                break;
            }
            case LOG_IN_SUCCESS: {
                draft.isLoggingIn = false;
                draft.me = action.data;
                break;
            }
            case LOG_IN_FAILURE: {
                draft.isLoggingIn = false;
                draft.logInErrorReason = action.error;
                draft.me = null;
                break;
            }
            // LOG_OUT 요청 -----------------------------------------------------------------------------------
            case LOG_OUT_REQUEST: {
                draft.isLoggingOut = true;
                break;
            }
            case LOG_OUT_SUCCESS: {
                draft.isLoggingOut = false;
                draft.signedUp = false;
                draft.me = null;
                break;
            }
            case LOG_OUT_FAILURE: {
                draft.isLoggingOut = false;
                break;
            }
            // SIGN_UP 요청 -----------------------------------------------------------------------------------
            case SIGN_UP_REQUEST: {
                draft.isSigningUp = true;
                draft.signedUp = false;
                draft.singUpErrorReason = "";
                break;
            }
            case SIGN_UP_SUCCESS: {
                draft.isSigningUp = false;
                draft.signedUp = true;
                break;
            }
            case SIGN_UP_FAILURE: {
                draft.isSigningUp = false;
                draft.singUpErrorReason = action.error;
                break;
            }
            // LOAD_USER ----------------------------------------------------------------------------------------
            case LOAD_USER_REQUEST: {
                break;
            }
            case LOAD_USER_SUCCESS: {
                if (action.me) {    // 본인정보 받아온거면
                    draft.me = action.data;
                    break;
                }
                draft.userInfo = action.data;
                break;
            }
            case LOAD_USER_FAILURE: {
                draft.error = action.error;
                break;
            }
            // Follow --------------------------------------------------------------------------------------------
            case FOLLOW_USER_REQUEST: {
                break;
            }
            case FOLLOW_USER_SUCCESS: {
                draft.me.Followings.unshift({ id: action.data });
                break;
            }
            case FOLLOW_USER_FAILURE: {
                break;
            }
            // unFollow ----------------------------------------------------------------------------------------------
            case UNFOLLOW_USER_REQUEST: {
                break;
            }
            case UNFOLLOW_USER_SUCCESS: {
                let followingIndex = draft.me.Followings.findIndex(v => v.id === action.data);
                draft.me.Followings.splice(followingIndex, 1);
                followingIndex = draft.followingList.findIndex(v => v.id === action.data);
                draft.followingList.splice(followingIndex, 1);
                break;
                // return {
                //     ...state,
                //     me: {
                //         ...state.me,
                //         Followings: state.me.Followings.filter(v => v.id !== action.data)
                //     },
                //     followingList: state.followerList.filter(v => v.id !== action.data)
                // };
            }
            case UNFOLLOW_USER_FAILURE: {
                break;
            }
            // LOAD FOLLOWINGS -------------------------------------------------------------------------------------------
            case LOAD_FOLLOWINGS_REQUEST: {
                draft.hasMoreFollowings = action.offset ? draft.hasMoreFollowings : true; // 처음 프로필 방문 요청 때는 offset를 보내지 않으므로 처음에는 항상 보여줌
                break;
            }
            case LOAD_FOLLOWINGS_SUCCESS: {
                draft.followingList = action.offset ? draft.followingList.concat(action.data) : [...action.data];
                draft.hasMoreFollowings = (action.data.length === 3);    // 받아온 팔로잉수가 3개 미만이면 더보기 버튼을 없앰
                break;
                // return {
                //     ...state,
                //     followingList: action.offset ? state.followingList.concat(action.data) : [...action.data],
                //     hasMoreFollowings: action.data.length === 3,    // 받아온 팔로잉수가 3개 미만이면 더보기 버튼을 없앰
                // };
            }
            case LOAD_FOLLOWINGS_FAILURE: {
                break;
            }
            // LOAD FOLLOWERS -------------------------------------------------------------------------------------------
            case LOAD_FOLLOWERS_REQUEST: {
                draft.hasMoreFollowers = action.offset ? draft.hasMoreFollowers : true;
                break;
            }
            case LOAD_FOLLOWERS_SUCCESS: {
                draft.followerList = action.offset ? draft.followerList.concat(action.data) : [...action.data];
                draft.hasMoreFollowers = (action.data.length === 3);
                break;
            }
            case LOAD_FOLLOWERS_FAILURE: {
                break;
            }
            // REMOVE FOLLOWER -------------------------------------------------------------------------------------------
            case REMOVE_FOLLOWER_REQUEST: {
                break;
            }
            case REMOVE_FOLLOWER_SUCCESS: {
                const followerIndex = draft.me.Followers.findIndex(v => v.id === action.data)
                draft.me.Followers.splice(followerIndex, 1);
                followerIndex = draft.followerList.findIndex(v => v.id === action.data)
                draft.followerList.splice(followerIndex, 1);
                break;
                // return {
                //     ...state,
                //     me: {
                //         ...state.me,
                //         Followers: state.me.Followers.filter(v => v.id !== action.data)
                //     },
                //     followerList: state.followerList.filter(v => v.id !== action.data)
                // };
            }
            case REMOVE_FOLLOWER_FAILURE: {
                break;
            }
            // Edit Nickname -------------------------------------------------------------------------------------------
            case EDIT_NICKNAME_REQUEST: {
                draft.isEditingNickname = true;
                break;
            }
            case EDIT_NICKNAME_SUCCESS: {
                draft.me.nickname = action.data;
                draft.isEditingNickname = false;
                break;
            }
            case EDIT_NICKNAME_FAILURE: {
                draft.isEditingNickname = false;
                draft.editNicknameErrorReson = action.error;
                break;
            }
            /////////////////////
            case ADD_POST_TO_ME: {
                draft.me.Posts.unshift({ id: action.data });
                break;
            }
            // 게시글 삭제 후 게시글 수 갱신
            case REMOVE_POST_OF_ME: {
                const postIndex = draft.me.Posts.findIndex(v => v.id === action.data);
                draft.me.Posts.splice(postIndex, 1);
                break;
            }
            default: {
                break;
            }
        }
    });
};
