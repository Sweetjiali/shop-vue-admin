//跨域代理
module.exports={
    lintOnSave: false,
    // 输出文件目录
    outputDir: 'dist',
    assetsDir: 'assets',
    productionSourceMap: false,
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: true,
        proxy: {
            'api': {
                target: 'http://127.0.0.1:7001',
                ws: true,
                changeOrigin: true,
                // pathRewrite:{
                    //     //     '^/hyperone':'/'
                    //     // }
            },
            'public': {
                target: 'http://127.0.0.1:7001',
                ws: true,
                changeOrigin: true
            },
        }
    }
}