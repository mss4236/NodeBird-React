// 모든 reducer들을 묶어줄 root reducer(부모 reducer)
import { combineReducers } from 'redux';
import user from './user';
import post from './post';

const rootReducer = combineReducers({
    user,
    post,
});

export default rootReducer;