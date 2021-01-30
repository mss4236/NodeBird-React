import Error from 'next/error';
import React from 'react';
import PropTypes from 'prop-types';

const MyError = ({ statusCode }) => {
    return (
        <div>
            <h1>에러 발생!!</h1>
            <Error statusCode={statusCode} />
        </div>
    );
};

MyError.propsTypes = {
    statusCode: PropTypes.number,
};
MyError.defaultProps = {
    statusCode: 400,
}

MyError.getInitialProps = (context) => {
    const statusCode = context.res ? context.res.statusCode : context.err ? err.statusCode : null;
    return { statusCode };
};

export default MyError;