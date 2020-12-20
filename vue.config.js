module.exports = {
    publicPath: '/form',
    runtimeCompiler: true,
    devServer: {
        proxy: {
            '/ycl': {
                target: 'http://127.0.0.1:4000',
                changeOrigin: true,
                pathRewrite: {
                    '^/ycl': ''
                }
            }
        },
        open: true
    }
}
