const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
    analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        server: {
            analyzerMode: 'static',
            reportFilename: '../../bundles/server.html'
        },
        browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html'
        }
    },
    webpack(config) {
        const prod = process.env.NODE_ENV === 'produciton';
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/monent[/\\]locale$/, /^\.\/ko$/), // treeshaking
        ];
        if (prod) {
            plugins.push(new CompressionPlugin())   // 배포일때만 사용(production)  // .gz로 만들어줌(보통 용량을 1/3? 1/4? 정도로 줄여줌)
        }
        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map' : 'eval',
            module: {
                ...config.module,
                rules: [
                    ...config.module.rules,
                    {
                        loader: 'webpack-ant-icon-loader',
                        enforce: 'pre',
                        include: [
                            require.resolve('@ant-design/icons/lib/dist')
                        ]
                    }
                ]
            },
            plugins,
        };
    },
});