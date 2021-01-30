// 메인 페이지
import React, { useCallback, useEffect, useRef } from "react";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(loginAction);
    // }, []);

    // redux의 state 사용하는 방법 useSelector에서 state는 전체 state를 말함
    // const { user } = useSelector(state => state.user);

    const { mainPosts, hasMorePost } = useSelector((state) => state.post);
    const { me } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const countRef = useRef([]);    // 프론트에서 리덕스 액션 호출막기

    /*  SSR을 하기 전에 썼었음, SSR을 위해서 아래에 getInitialProps에서 실행
        useEffect(() => {
            dispatch({
                type: LOAD_MAIN_POSTS_REQUEST,
            });
        }, []); 
    */

    const onScroll = useCallback(() => {
        if (hasMorePost) {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) { // 스크롤 다 내리기 전까지 300남았을 때 
                const lastId = mainPosts[mainPosts.length - 1].id;
                if (!countRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_MAIN_POSTS_REQUEST,
                        lastId
                    });
                }
                countRef.current.push(lastId);
            }
        }
    }, [mainPosts.length, hasMorePost]);

    // 인피니트 스크롤링을 위한 addEventListener달기
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPosts]);

    return (
        <>
            {me && <PostForm />}
            {mainPosts.map((c, i) => {
                return <PostCard key={c + i} post={c} />;
            })}
        </>
    );
};

Home.getInitialProps = async (context) => {
    context.store.dispatch({
        type: LOAD_MAIN_POSTS_REQUEST,
    });
};

export default Home;
