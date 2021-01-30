// pages가 next에서 사용하는 라우터 폴더, _app.js는 next에서 제공하는 공통부분(Layout)
// Component를 props로 받는다 (pages에 있는 component들)
import React from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types'; // 부모로부터 prop을 잘 받았는지 확인하는거
import withRedux from 'next-redux-wrapper'; // store를 NodeBird에게 props로 받게 해주는 역할
import withReduxSaga from 'next-redux-saga';    // next용 redux-saga :: 이게 있어야 next에서 redux saga돌릴수 있음
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from '../reducers';
import createSagaiddleware from 'redux-saga';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';
import axios from 'axios';

const NodeBird = ({ Component, store, pageProps }) => {
    return (
        <>
            <Provider store={store}>
                <Helmet
                    title="NodeBird"
                    htmlAttributes={{ lang: 'ko' }}
                    meta={[{
                        charSet: 'UTF-8'
                    }, {
                        name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover'
                    }, {
                        'http-equive': 'X-UA-Compatible', content: 'IE=edge'
                    }, {
                        name: 'description', content: 'PKM의 NodeBird SNS'
                    }, {
                        name: 'og:title', content: 'NodeBird'
                    }, {
                        name: 'og:description', content: 'pkm의 NodeBrd SNS'
                    }, {
                        property: 'og:type', content: 'website'
                    }]}
                    link={[{
                        rel: 'stylesheet', href: "https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
                    }, {
                        rel: 'stylesheet', href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                    }, {
                        rel: 'stylesheet', href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                    }, {
                        rel: 'shortcut icon', href: "http://localhost:3000/favicon.ico"
                    }]}
                    script={[{

                    }]}
                />
                {/* <Head>   Helmet로 옮겼음
                    <title>NodeBird</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        charset="UTF-8"
                        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                    />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                    />
                </Head> */}
                <AppLayout>
                    <Component {...pageProps} />
                </AppLayout>
            </Provider>
        </>
    );
};

NodeBird.getInitialProps = async (context) => { // context는 next에서 내려주는거
    const { ctx, Component } = context; // Component 렌더링 되고있는 페이지를 말한다 // 위에 Component랑 비슷하다고 보면됨
    let pageProps = {};

    // AppLayout의 부분 SSR
    const state = ctx.store.getState();
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';  // isServer는 렌더링하는 주체 확인(서버가 렌더링하는지 클라이언트가 렌더링하는지)
    if (ctx.isServer && cookie) {   // 서버인경우에는 하고 클라이언트인 경우에는 안함
        axios.defaults.headers.Cookie = cookie; // axios에서 기본적으로 쿠키를 심어주게
    }
    if (!state.user.me) {
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,
        });
    }

    if (Component.getInitialProps) {    // 해당 페이지에 getInitialProps가 존재한다면
        pageProps = await Component.getInitialProps(ctx) || {};   // ctx를 내려보내준다
    }

    return { pageProps };
};

NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired, // elementType이 아닌걸 받으면 콘솔에 error을 띄운다
    store: PropTypes.object.isRequired, // isRequired 프롭스에 꼭 들어가야 한다. 안들어가면 에러
    pageProps: PropTypes.object.isRequired,
};

////////////////////////////////////////////////////////////
const configrationStore = (initialState, options) => {
    // const store = createStore(reducer, initialState);
    // 여기에 store 커스터마이징
    // 미들웨어는 액션과 스토어 사이에서 동작
    const sagaMiddleware = createSagaiddleware();
    const middlewares = [sagaMiddleware/*, (store) => (next) => (action) => {
        console.log(action);
        next(action);
    }*/]; // (store :: 스토어 객체) => (next :: dispatch) => (action :: 현재 실행된 액션) => { console.log(action); next(action); } :: 리덕스 사가 에러 찾아내는 방식

    const enhancer = process.env.NODE_ENV === 'production'  // NODE_ENV(실제 서비스 인지 구분하는 애), production(실제서비스)
        ? compose(applyMiddleware(...middlewares),)
        : compose(applyMiddleware(...middlewares),
            !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
            // __REDUX_DEVTOOLS_EXTENSION__ 는 실제 배포할때는 빼줌(데이터 흐름을 보여주기 때문에 보안에 위협이됨)
        );
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);  // withReduxSaga에서 필요

    return store;
}

export default withRedux(configrationStore)(withReduxSaga((NodeBird)));
////////////////////////////////////////////////////////////