// pages가 next에서 사용하는 라우터 폴더, _app.js는 next에서 제공하는 공통부분(Layout)
// Component를 props로 받는다 (pages에 있는 component들)
import React from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import PropTypes from 'prop-types'; // 부모로부터 prop을 잘 받았는지 확인하는거
import withRedux from 'next-redux-wrapper'; // store를 NodeBird에게 props로 받게 해주는 역할
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from '../reducers';
import createSagaiddleware from 'redux-saga';
import rootSaga from '../sagas';

const NodeBird = ({ Component, store }) => {
    return (
        <>
            <Provider store={store}>
                <Head>
                    <title>NodeBird</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
                </Head>
                <AppLayout>
                    <Component />
                </AppLayout>
            </Provider>
        </>
    );
};

NodeBird.prototype = {
    Component: PropTypes.elementType.isRequired, // elementType이 아닌걸 받으면 콘솔에 error을 띄운다
    store: PropTypes.object.isRequired, // isRequired 프롭스에 꼭 들어가야 한다. 안들어가면 에러
};

////////////////////////////////////////////////////////////
const configrationStore = (initialState, options) => {
    // const store = createStore(reducer, initialState);
    // 여기에 store 커스터마이징
    // 미들웨어는 액션과 스토어 사이에서 동작
    const sagaMiddleware = createSagaiddleware();
    const middlewares = [sagaMiddleware];
    const enhancer = process.env.NODE_ENV === 'production'  // NODE_ENV(실제 서비스 인지 구분하는 애), production(실제서비스)
        ? compose(applyMiddleware(...middlewares),)
        : compose(applyMiddleware(...middlewares),
            !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
        // __REDUX_DEVTOOLS_EXTENSION__ 는 실제 배포할때는 빼줌(데이터 흐름을 보여주기 때문에 보안에 위협이됨)
        );  
    const store = createStore(reducer, initialState, enhancer);
    sagaMiddleware.run(rootSaga); 

    return store;
}

export default withRedux(configrationStore)(NodeBird);
////////////////////////////////////////////////////////////