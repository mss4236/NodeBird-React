// post reducer ((((((((((( store은 정확하게는 state, action, reducer가 합쳐진 것 )))))))))))
import produce from 'immer';

// store
export const initialState = {
    imagePaths: [], // 미리보기 이미지 경로들
    mainPosts: [], // 화면에 보일 포스트들
    addPostError: false, // 포스트 업로드 실패 사유
    isAddingPost: false, // 포스트 업로드 중
    postAdded: false, // 포스트가 업로드 성공여부
    isAddingComment: false, // 댓글 업로드중
    addCommentErrorReason: "", // 댓글 업로드 실패사유
    commentAdded: false, // 댓글 업로드 성공여부
    hasMorePost: false, // 인피니트 스크롤링 // 스크롤이벤트에 리듀서 호출을 넣어놔서 계속 호출되서 그것을 막기위함
    singlePost: null,
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

// 다른유저의 포스트들 로딩하는 액션
export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

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
export const LOAD_COMMENTS_REQUEST = "LOAD_COMMENT_REQUEST";
export const LOAD_COMMENTS_SUCCESS = "LOAD_COMMENT_SUCCESS";
export const LOAD_COMMENTS_FAILURE = "LOAD_COMMENT_FAILURE";

// 리트윗하는 액션
export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

// 포스트 제거하는 액션
export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

// 포스트 하나만 불러옴
export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

// 포스트 수정
export const REVISE_POST_REQUEST = "REVISE_POST_REQUEST";
export const REVISE_POST_SUCCESS = "REVISE_POST_SUCCESS";
export const REVISE_POST_FAILURE = "REVISE_POST_FAILURE";

// reducer
export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            // 메인포스트 불러오는거, 해시태그로 검색했을 때, 다른유저 포스트 받아올때 
            case LOAD_MAIN_POSTS_REQUEST:
            case LOAD_HASHTAG_POSTS_REQUEST:
            case LOAD_USER_POSTS_REQUEST: {
                draft.mainPosts = action.lastId ? draft.mainPosts : [];
                draft.hasMorePost = action.lastId ? draft.hasMorePost : true;
                break;
            }
            case LOAD_MAIN_POSTS_SUCCESS:
            case LOAD_HASHTAG_POSTS_SUCCESS:
            case LOAD_USER_POSTS_SUCCESS: {
                action.data.forEach((p) => {
                    draft.mainPosts.push(p);
                });
                draft.hasMorePost = (action.data.length === 10);
                break;
                // return {
                //     ...state,
                //     mainPosts: state.mainPosts.concat(action.data),
                //     hasMorePost: action.data.length === 10,
                // };
            }
            case LOAD_MAIN_POSTS_FAILURE:
            case LOAD_HASHTAG_POSTS_FAILURE:
            case LOAD_USER_POSTS_FAILURE: {
                break;
            }
            // 게시글 하나 불러오기 -------------------------------------------------------------------------------------------------
            case LOAD_POST_REQUEST: {
                break;
            }
            case LOAD_POST_SUCCESS: {
                draft.singlePost = action.data;
                break;
            }
            case LOAD_POST_FAILURE: {
                break;
            }
            // 이미지 업로드 ------------------------------------------------------------------------------------------------------
            case UPLOAD_IMGES_REQUEST: {
                break;
            }
            case UPLOAD_IMGES_SUCCESS: {
                // immer 사용 시
                action.data.forEach((p) => {
                    draft.imagePaths.push(p);
                });
                break;

                // immer 미사용 시
                // return {
                //     ...state,
                //     imagePaths: [...state.imagePaths, ...action.data]
                // };
            }
            case UPLOAD_IMGES_FAILURE: {
                break;
            }
            // 이미지 업로드 취소
            case REMOVE_IMAGE: {
                const index = draft.imagePaths.findIndex((v, i) => i === action.index);
                draft.imagePaths.splice(index, 1);
                break;

                // return {
                //     ...state,
                //     imagePaths: state.imagePaths.filter((v, i) => i !== action.index),
                // };
            }
            // 포스트에 좋아요 ---------------------------------------------------------------------
            case LIKE_POST_REQUEST: {
                break;
            }
            case LIKE_POST_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
                break;
            }
            case LIKE_POST_FAILURE: {
                break;
            }
            // 포스트에 좋아요 취소 --------------------------------------------------------------------
            case UNLIKE_POST_REQUEST: {
                break;
            }
            case UNLIKE_POST_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                const likerIndex = draft.mainPosts.findIndex(v => v.id === action.data.userId);
                draft.mainPosts[postIndex].Likers.splice(likerIndex, 1);
                break;
            }
            case UNLIKE_POST_FAILURE: {
                break;
            }
            // 포스트 추가
            case ADD_POST_REQUEST: {
                draft.isAddingPost = true;
                draft.addPostError = '';
                draft.postAdded = false;
                break;
            }
            case ADD_POST_SUCCESS: {
                draft.isAddingPost = false;
                draft.mainPosts.unshift(action.data);
                draft.postAdded = true;
                draft.imagePaths = [];
                break;
                // return {
                //     ...state,
                //     isAddingPost: false,
                //     mainPosts: [action.data, ...state.mainPosts], // [action.data, ...state.mainPosts],
                //     postAdded: true,
                //     imagePaths: [],
                // };
            }
            case ADD_POST_FAILURE: {
                draft.isAddingPost = false;
                draft.addPostError = action.error;
                break;
            }
            // 게시글에 댓글 남겼을 때
            case ADD_COMMENT_REQUEST: {
                draft.isAddingComment = true;
                draft.commentAdded = false;
                break;
            }
            case ADD_COMMENT_SUCCESS: {
                //  immer 사용 시
                const postIndex = draft.mainPosts.findIndex((v) => v.id === action.data.postId); // 댓글 추가할 게시글의 index를 찾음
                draft.mainPosts[postIndex].Comments.push(action.data.comment);  //  해당 게시글에 댓글 추가
                draft.commentAdded = true;
                draft.isAddingComment = false;
                break;

                // immer 사용 안할 시
                // const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
                // const post = state.mainPosts[postIndex]; // 불변성 확보
                // const Comments = [...post.Comments, action.data.comment]; // 댓글 넣음
                // const mainPosts = [...state.mainPosts]; // mainPosts 불변성 확보
                // mainPosts[postIndex] = { ...post, Comments };
                // return {
                //     ...state,
                //     commentAdded: true,
                //     mainPosts,
                //     isAddingComment: false,
                // };
            }
            case ADD_COMMENT_FAILURE: {
                draft.addCommentErrorReason = action.error;
                draft.isAddingComment = false;
            }
            // 게시글에 댓글 불러옴 ----------------------------------------------------------------------------------------
            case LOAD_COMMENTS_REQUEST: {
                break;
            }
            case LOAD_COMMENTS_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Comments = action.data.comments;
                break;
            }
            case LOAD_COMMENTS_FAILURE: {
                break;
            }
            // 리트윗 ------------------------------------------------------------------------------------
            case RETWEET_REQUEST: {
                break;
            }
            case RETWEET_SUCCESS: {
                draft.mainPosts.unshift(action.data);
                // return {
                //     ...state,
                //     mainPosts: [action.data, ...state.mainPosts]
                // };
            }
            case RETWEET_FAILURE: {
                break;
            }
            // 포스트 제거 ----------------------------------------------------------------------------------------------
            case REMOVE_POST_REQUEST: {
                break;
            }
            case REMOVE_POST_SUCCESS: {
                draft.mainPosts = draft.mainPosts.filter(v => v.id !== action.data);
                break;
            }
            case REMOVE_POST_FAILURE: {
                break;
            }
            // 포스트 수정 -----------------------------------------------------------------------------------------------
            case REVISE_POST_REQUEST: {
                break;
            }
            case REVISE_POST_SUCCESS: {
                const postIndext = draft.mainPosts.findIndex(v => v.id === action.data.id);
                draft.mainPosts[postIndext] = action.data;
                break;
            }
            case REVISE_POST_FAILURE: {
                break;
            }
            default: {
                break;
            }
        }
    });
};