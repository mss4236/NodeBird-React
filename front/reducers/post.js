// post reducer ((((((((((( store은 정확하게는 state, action, reducer가 합쳐진 것 )))))))))))

// store
export const initialState = {
    imagePaths: [], // 미리보기 이미지 경로들
    mainPosts: [
        {
            id: 1,
            User: {
                id: 1,
                nickname: "pkm",
            },
            content: "까불지마",
            img: "",
            Comments: [],
        },
    ], // 화면에 보일 포스트들
    imagePaths: [], // 미리보기 이미지 경로
    addPostError: false, // 포스트 업로드 실패 사유
    isAddingPost: false, // 포스트 업로드 중
    postAdded: false, // 포스트가 업로드 성공여부
    isAddingComment: false, // 댓글 업로드중
    addCommentErrorReason: "", // 댓글 업로드 실패사유
    commentAdded: false, // 댓글 업로드 성공여부
};

const dummyPost = {
    id: 2,
    User: {
        id: 1,
        nickname: "깽",
    },
    content: "나는 더미입니다.",
    Comments: [],
};

const dummyComments = {
    id: 1,
    User: {
        id: 1,
        nickname: 2,
    },
    createdAt: new Date(),
    content: "더미 댓글입니다.",
};

// 액션 이름 (비동기 처리를 해야하는 경우 REQUEST, SUCCESS, FAILURE 3가지로 나눴음)
// 메인포스트 로딩하는 액션
export const LOAD_MAIN_POSTS_REQUEST = "LOAD_MAIN_POSTS_REQUEST";
export const LOAD_MAIN_POSTS_SUCCESS = "LOAD_MAIN_POSTS_SUCCESS";
export const LOAD_MAIN_POSTS_FAILURE = "LOAD_MAIN_POSTS_FAILURE";

// 해시태그로 검색했을 때 그 결과를 로딩하는 액션
export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

// 이미지 업로드하는 액션
export const UPLOAD_IMGES_REQUEST = "UPLOAD_IMGES_REQUEST";
export const UPLOAD_IMGES_SUCCESS = "UPLOAD_IMGES_SUCCESS";
export const UPLOAD_IMGES_FAILURE = "UPLOAD_IMGES_FAILURE";

// 이미지 업로드한거 취소하는 액션
export const REMOVE_IMAGE = "REMOVE_IMAGE";

// 포스트에 좋아요 눌렀을때 액션
export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

// 좋아요 취소했을때 액션
export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

// 포스트 추가하는 액션
export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

// 게시글에 댓글 남겼을때
export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

// 게시글에 댓글 불러오는거
export const LOAD_COMMENT_REQUEST = "LOAD_COMMENT_REQUEST";
export const LOAD_COMMENT_SUCCESS = "LOAD_COMMENT_SUCCESS";
export const LOAD_COMMENT_FAILURE = "LOAD_COMMENT_FAILURE";

// 리트윗하는 액션
export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

// 포스트 제거하는 액션
export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

// 포스트 수정하는 액션 !!!!!!!!!!!!!!!!!!!!! 내가 직접 해볼 것 !!!!!!!!!!!!!!!!!!!!!!!

// 실제 액션
const addPost = {
    type: ADD_POST_REQUEST,
};

// reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        // 메인포스트 불러오는거
        case LOAD_MAIN_POSTS_REQUEST: {
            return {
                ...state,
            };
        }
        case LOAD_MAIN_POSTS_SUCCESS: {
            return {
                ...state,
            };
        }
        case LOAD_MAIN_POSTS_FAILURE: {
            return {
                ...state,
            };
        }
        // 해시태그로 검색했을 때
        case LOAD_HASHTAG_POSTS_REQUEST: {
            return {
                ...state,
            };
        }
        case LOAD_HASHTAG_POSTS_SUCCESS: {
            return {
                ...state,
            };
        }
        case LOAD_HASHTAG_POSTS_FAILURE: {
            return {
                ...state,
            };
        }
        // 이미지 업로드
        case UPLOAD_IMGES_REQUEST: {
            return {
                ...state,
            };
        }
        case UPLOAD_IMGES_SUCCESS: {
            return {
                ...state,
            };
        }
        case UPLOAD_IMGES_FAILURE: {
            return {
                ...state,
            };
        }
        // 이미지 업로드 취소
        case REMOVE_IMAGE: {
            return {
                ...state,
            };
        }
        // 포스트에 좋아요
        case LIKE_POST_REQUEST: {
            return {
                ...state,
            };
        }
        case LIKE_POST_SUCCESS: {
            return {
                ...state,
            };
        }
        case LIKE_POST_FAILURE: {
            return {
                ...state,
            };
        }
        // 포스트에 좋아요 취소
        case UNLIKE_POST_REQUEST: {
            return {
                ...state,
            };
        }
        case UNLIKE_POST_SUCCESS: {
            return {
                ...state,
            };
        }
        case UNLIKE_POST_FAILURE: {
            return {
                ...state,
            };
        }
        // 포스트 추가
        case ADD_POST_REQUEST: {
            return {
                ...state,
                isAddingPost: true,
                addPostError: "",
                postAdded: false,
            };
        }
        case ADD_POST_SUCCESS: {
            return {
                ...state,
                isAddingPost: false,
                mainPosts: [dummyPost, ...state.mainPosts], // [action.data, ...state.mainPosts],
                postAdded: true,
            };
        }
        case ADD_POST_FAILURE: {
            return {
                ...state,
                isAddingPost: false,
                addPostError: action.error,
            };
        }
        // 게시글에 댓글 남겼을 때
        case ADD_COMMENT_REQUEST: {
            return {
                ...state,
                isAddingComment: true,
                addCommentErrorReason: "",
                commentAdded: false,
            };
        }
        case ADD_COMMENT_SUCCESS: {
            // 댓글을 추가할 게시글을 찾아야함
            const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
            const post = state.mainPosts[postIndex]; // 불변성 확보
            //const Comments = [...post.Comments, action.data.comment]; // 댓글 넣음
            const Comments = [...post.Comments, dummyComments]; // 댓글 넣음
            const mainPosts = [...state.mainPosts]; // mainPosts 불변성 확보
            mainPosts[postIndex] = { ...post, Comments };
            return {
                ...state,
                commentAdded: true,
                mainPosts: [...mainPosts],
                isAddingComment: false,
            };
        }
        case ADD_COMMENT_FAILURE: {
            return {
                ...state,
                addCommentErrorReason: action.error,
                isAddingComment: false,
            };
        }
        // 게시글에 댓글 불러옴
        case LOAD_COMMENT_REQUEST: {
            return {
                ...state,
            };
        }
        case LOAD_COMMENT_SUCCESS: {
            return {
                ...state,
            };
        }
        case LOAD_COMMENT_FAILURE: {
            return {
                ...state,
            };
        }
        // 리트윗
        case RETWEET_REQUEST: {
            return {
                ...state,
            };
        }
        case RETWEET_SUCCESS: {
            return {
                ...state,
            };
        }
        case RETWEET_FAILURE: {
            return {
                ...state,
            };
        }
        // 포스트 제거
        case REMOVE_POST_REQUEST: {
            return {
                ...state,
            };
        }
        case REMOVE_POST_SUCCESS: {
            return {
                ...state,
            };
        }
        case REMOVE_POST_FAILURE: {
            return {
                ...state,
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
};

export default reducer;
