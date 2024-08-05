const webpack = require('webpack')

module.exports = function override(webpackConfig) {
    webpackConfig.module.rules.push({
        test: /.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
    });

    const fallback = webpackConfig.resolve.fallback || {};
    Object.assign(fallback, {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        // assert: require.resolve("assert"),
        net: require.resolve ("net-browserify"),
        tls:require.resolve("tls-browserify"),
        querystring: require.resolve("querystring-es3"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify"),
        url: require.resolve("url"),
        path: require.resolve("path-browserify"),
        zlib: require.resolve("browserify-zlib"),
        fs: false,
        'process/browser': require.resolve('process/browser')
    });
    webpackConfig.resolve.fallback = fallback;
    webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
        }),
    ]);

    return webpackConfig;
};