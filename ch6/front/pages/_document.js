import React from 'react';
import Document, { Main, NextScript } from 'next/document';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
    static getInitialProps(context) {
        const sheet = new ServerStyleSheet();
        const page = context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
        const styleTags = sheet.getStyleElement();
        return { ...page, helmet: Helmet.renderStatic(), styleTags };   // helmet SSR, styleComponent SSR
    };

    render() {
        const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
        const htmlAttrs = htmlAttributes.toComponent(); // htmlAttributes가 기본적으로 객체형식이라 컴포넌트 형식으로 바꿔주어야함
        const bodytAttrs = bodyAttributes.toComponent();

        return (
            <html {...htmlAttrs}>
                <head>
                    {this.props.styleTags}
                    {Object.values(helmet).map(el => el.toComponent())}
                </head>
                <body {...bodytAttrs}>
                    <Main />     {/* _app.js에서 Component역할 */}
                    <NextScript />      {/* next구동에 필요한 스크립트 모음 */}
                </body>
            </html>
        );
    };
};

MyDocument.propTypes = {
    helmet: PropTypes.object.isRequired,
    styleTags: PropTypes.object.isRequired,
};

export default MyDocument;