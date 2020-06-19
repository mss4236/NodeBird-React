// 메인 페이지
import React, { useEffect } from "react";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(loginAction);
    // }, []);

    // redux의 state 사용하는 방법 useSelector에서 state는 전체 state를 말함
    // const { user, isLoggedIn } = useSelector(state => state.user);

    const { mainPosts } = useSelector((state) => state.post);
    const { isLoggedIn } = useSelector((state) => state.user);

    return (
        <>
            {isLoggedIn && <PostForm />}
            {mainPosts.map((c, i) => {
                return <PostCard key={c + i} post={c} />;
            })}
        </>
    );
};

export default Home;
