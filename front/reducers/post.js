// post reducer ((((((((((( store은 정확하게는 state, action, reducer가 합쳐진 것 )))))))))))

// store
export const initialState = {
    imagePaths: [], // 미리보기 이미지 경로들
    mainPosts: [{
        User: {
            id: 1,
            nickname: 'pkm',
        },
        content: '까불지마',
        img: '',
    }],
};

// 액션 이름
export const ADD_POST = 'ADD_POST';
export const ADD_DUMMY = 'ADD_DUMMY';

// 실제 액션
const addPost = {
    type: ADD_POST,
};
const addDummy = {
    type: ADD_DUMMY,
    data: {
        content: 'Hello',
        UserId: 1,
        User: {
            nickname: 'PKM'
        }
    }
};

// reducer
const reducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_POST: {
            return {
                ...state,
            }
        }
        case ADD_DUMMY: {
            return {
                ...state,
                mainPosts: [action.data, ...state.mainPosts],
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