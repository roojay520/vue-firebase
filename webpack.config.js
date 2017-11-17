// 路径支持
const path = require('path');
// node glob 对象
const glob = require('glob');
// 引 入webpack 内部文件
const webpack = require('webpack');
// css 分离导出插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// js 压缩
const UglifyPlugin = require('uglifyjs-webpack-plugin');
// html 插入
const HtmlPlugin = require('html-webpack-plugin');
// 无需编译打包的静态资源转移
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 路径配置
let web;
let tool;
process.env.type === 'build' ? (web = 'http://roojay.com/') && (tool = 'false') :  (web = 'http://127.0.0.1:4399/') && (tool = 'eval-source-map');


const log = e => console.log(e);
log(process.env.type);
log(web);
log(tool);

function resolve(dir) {
    return path.join(__dirname, '.', dir);
}

module.exports = {
    // 开发调试设置
    // devtool: 'eval-source-map',
    devtool: `${tool}`,
    // 入口文件
    entry: {
        // js 入口文件
        app: `${__dirname}/src/main.js`,
        vue: 'vue'
    },
    // 出口文件
    output: {
        // 打包文件路径
        path: `${__dirname}/dist/`,
        filename: 'js/[name].[hash:6].js',
        publicPath: web
    },
    // 路径别名配置
    resolve: {
        extensions: ['.js', '.vue', '.json', '.scss'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    // 模块
    module: {
        // 编译规则
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        },
            // 配置 babel
        {
            test: /\.js$/,
            use: {
                loader: 'babel-loader'
            },
            include: [resolve('src')],
            // 匹配正则表达式排除
            exclude: /node_modules/
        },
            // 配置sass编译规则
        {
            // 匹配处理文件的扩展名的正则表达式
            test: /\.(css|scss)$/,
            // 使用模块的名称
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true,
                        sourceMap: true,
                        modules: true,
                        importLoaders: 1
                    }
                },
                    // 前缀自动插入
                {
                    loader: 'postcss-loader'
                },
                    // scss 转换
                {
                    loader: 'sass-loader'
                }
                ]
            })
        },
            // 图片字体处理
        {
            test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
            use: {
                loader: 'url-loader',
                options: {
                    // 将小于 10KB 的图片转换为成 Base64 的格式，写入JS。
                    limit: 10240,
                    outputPath: 'images/[name].[hash:7].[ext]'
                }
            }
        },
        {
            test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.*)?$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 10240
                    // outputPath: 'fonts/'
                }
            }
        },
            // html 文件中引入 <img> 标签
        {
            test: /\.(htm|html)$/i,
            loader: 'html-withimg-loader'
        }
        ]
    },

    // 插件配置
    plugins: [
        // 开头文件插入
        new webpack.BannerPlugin('Created by @Roojay.'),
        // 打包生成 html
        new HtmlPlugin({
            // 开启 html 压缩
            minify: {
                // 去掉属性双引号
                removeAttributeQuotes: true
            },
            // 避免缓存JS
            hash: true,
            filename: 'index.html',
            // html 打包模板文件路径
            template: './src/index.html'
        }),
        // css 打包分离
        new ExtractTextPlugin('css/[name].[hash:6].css'),
        // js 压缩
        new UglifyPlugin({
            uglifyOptions: {
                ie8: false,
                output: {
                    // 去掉注释
                    comments: false,
                    // 压缩掉空格
                    beautify: false
                },
                mangle: {
                    keep_fnames: true
                },
                compress: {
                    drop_console: true
                },
                sourceMap: true
            }
        }),
        // 无需编译的静态资源转移
        new CopyWebpackPlugin([{
            from: `${__dirname}/src/static`,
            to: 'static'
        }]),
        // 启用热加载
        // new webpack.HotModuleReplacementPlugin(),
        // 第三方类库引入
        new webpack.ProvidePlugin({
            Vue: 'vue',
            Firebase: 'firebase'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vue'],
            filename: 'lib/[name].js',
            minChunks: 2
        })
    ],
    watchOptions: {
        poll: 1000,
        aggregeateTimeout: 500,
        ignore: /node_modules/
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: '127.0.0.1',
        compress: true,
        port: 4399,
        historyApiFallback: true
    }
};
