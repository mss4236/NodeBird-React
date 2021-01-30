import React, { useEffect, useCallback, useRef } from 'react'; 'axios';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../components/PostCard';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';

const Hashtag = () => {
    const router = useRouter();
    const { hashtag } = router.query;
    const dispatch = useDispatch();
    const { mainPosts, hasMorePost } = useSelector(state => state.post);
    const countRef = useRef([]);

    // useEffect(() => {
    //     dispatch({
    //         type: LOAD_HASHTAG_POSTS_REQUEST,
    //         data: hashtag,
    //     });
    // }, [hashtag]);

    const onScroll = useCallback(() => {
        if (hasMorePost && (mainPosts.length - 1) !== -1) {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) { // 스크롤 다 내리기 전까지 300남았을 때 
                const lastId = mainPosts[mainPosts.length - 1].id;
                if (!countRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_HASHTAG_POSTS_REQUEST,
                        data: hashtag,
                        lastId,
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
            <div>
                {mainPosts.map(c => (
                    <PostCard key={+c.createdAt} post={c} />
                ))}
            </div>
        </>
    );
};

// getInitialProps는 클라이언트랑 서버 둘다에서 실행됨
Hashtag.getInitialProps = async (context) => {   // getInitialProps도 lifeCycle의 일종임(next가 임의로 추가를 해준) // 제일 먼저 실행됨(가장 최초의 작업을 먼저 할 수 있음) componentDidMount보다도 먼저
    const { hashtag } = context.query;
    context.store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: hashtag,
    });
};

export default Hashtag;