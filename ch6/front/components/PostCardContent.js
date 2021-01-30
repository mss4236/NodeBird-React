import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => {
    return (
        <div>
            {postData.split(/(#[^\s]+)/g).map(v => {
                if (v.match(/#[^\s]+/)) {    // 해시태그인 경우 링크로 리턴
                    return (
                        <Link href="/hashtag/[hashtag]" as={`/hashtag/${v.slice(1)}`} key={v}><a>{v}</a></Link>
                    );
                }
                return v;   // 해시태그 아닌경우 그냥 문자로 리턴
            })}
        </div>
    );
};

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired,
};

export default PostCardContent;