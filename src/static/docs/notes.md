## 学习记录
### 模块

#### CommonJS
Node.js 遵循 CommonJS 规范, 模块通过 `exports` 或者 `module.exports` 导出需要暴露的接口, 使用 `require` 方法同步加载所要依赖的其它模块.

```javascript
// bar.js 导出文件
exports.addSum = (a, b) => a + b;
// 或者
module.exports = function(a, b){
    return a + b;
}

// foo.js 引入文件
const addSum = require('bar');
// 或者 const addSum = require('./bar.js');
const result = addSum(2, 5); // 7

```

#### ES6 模块
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西(require 是运行时加载模块)。ES6 通过过 `export` 命令显式指定输出的代码，再通过 `import` 命令输入。


```javascript
// bar.js
const sumAdd = (x, y) => x + y;
const sumMinus = (a, b) => a - b;
// 导出两个方法
export {sumAdd, sumMinus};

// foo.js
// 只加载 sumAdd 方法
import {sumAdd} from './bar';
sumAdd(2, 3); // 5
sumMinus(3, 2); // 报错

// 加载两个方法
import {sumAdd,sumMinus } from './bar';
sumAdd(2, 3); // 5
sumMinus(3, 2); // 1

// 加载所有模块
import './bar';
sumAdd(2, 3); // 5
sumMinus(3, 2); // 1
```
`export default` 用于导出匿名函数.
`import()` 类似于 Node 的 `require `方法，区别主要是前者是异步加载，后者是同步加载.
`import()`返回一个 Promise 对象.

### webpack

> Webpack 是一个模块打包器。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。

![webpack](https://ooo.0o0.ooo/2017/11/14/5a0ab0cbd7554.png)

#### Loader
Webpack 本身只能处理原生的 JavaScript 模块，但是 loader 转换器可以将各种类型的资源转换成 JavaScript 模块。任何资源都可以成为 Webpack 可以处理的模块。

#### 插件
 plugin 和 loader 的区别是, loader 是在 import 时根据不同的文件名, 匹配不同的 loader对这个文件做处理,而 plugin 关注的不是文件的格式, 而是在编译的各个阶段, 会触发不同的事件,让你可以干预每个编译阶段.

#### 配置文件

```bash
# 初始化一个项目,生成 package.json 文件
$ npm init
```
更改 package.json 文件:
```json
{
  "name": "webpack",
  "version": "1.0.0",
  "description": "Webpack setting.",
  "scripts": {
    "dev": "set type=dev&webpack&webpack-dev-server --open",
    "build": "set type=build&webpack"
  },
  "keywords": [
    "webpack"
  ],
  "author": "roojay <roojay520@gmail.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/roojay520/webpack.git"
  },
  "license": "MIT",
  "devDependencies": {
    "autoprefixer": "^7.1.6",
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "copy-webpack-plugin": "^4.2.0",
    "css-loader": "^0.28.7",
    "extract-text-webpack-plugin": "^3.0.2",
    "file-loader": "^1.1.5",
    "glob": "^7.1.2",
    "html-webpack-plugin": "^2.30.1",
    "html-withimg-loader": "^0.1.16",
    "node-sass": "^4.5.3",
    "postcss-loader": "^2.0.8",
    "purify-css": "^1.2.5",
    "purifycss-webpack": "^0.7.0",
    "sass-loader": "^6.0.6",
    "style-loader": "^0.19.0",
    "uglifyjs-webpack-plugin": "^1.0.1",
    "url-loader": "^0.6.2",
    "webpack": "^3.8.1",
    "webpack-dev-server": "^2.9.3"
  },
  "dependencies": {
    "normalize.css": "^7.0.0"
  }
}
```
设置 webpack.config 文件
```js
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
// 去掉未使用的 CSS,减少 CSS 冗余
const PurifyCss = require('purifycss-webpack');
// 无需编译打包的静态资源转移
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 公共路径配置
let publicPath;
process.env.type === 'build' ? (publicPath = 'http://cdn.roojay.com/') : (publicPath = 'http://127.0.0.1:4399/');

module.exports = {
    // 开发调试设置
    devtool: 'eval-source-map',
    // 入口文件
    entry: {
        // js 入口文件
        app: `${__dirname}/src/main.js`
        // 第三方库抽离
        // jquery: 'jquery',
        // vue: 'vue'
    },
    // 出口文件
    output: {
        // 打包文件路径
        path: `${__dirname}/dist/`,
        filename: 'js/[name].[hash:6].js',
        publicPath: website.publicPath
    },
    // 模块
    module: {
        // 编译规则
        rules: [
             // 配置 babel
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
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
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 将小于 10KB 的图片转换为成 Base64 的格式，写入JS。
                        limit: 10240,
                        outputPath: 'images/'
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
        new webpack.BannerPlugin('Created by @Roojay.')
        // 打包生成 html
        new HtmlPlugin({
            // 开启 html 压缩
            minify: {
                // 去掉属性双引号
                removeAttributeQuotes: true
            },
            // 避免缓存JS
            hash: true,
            // html 打包模板文件路径
            template: './src/index.html'
        }),
        // css 打包分离
        new ExtractTextPlugin('./css/[name].[hash:6].css'),
        // 去掉未使用的 css
        // 如果存在使用 js 更改元素类名实现 css 样式,不要启用这个插件 启用 css-loader 里面的压缩
        // new PurifyCss({
        //     // 配置解析规则的路径(绝对路径)
        //     paths: glob.sync(path.join(__dirname, 'src/*.html')),
        //     // css 空格压缩
        //     minimize: true
        // }),
        // js压缩
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
                }
            }
        }),
        // 无需编译的静态资源转移
        new CopyWebpackPlugin([{
            from: `${__dirname}/src/docs`,
            to: './docs'
        }]),
        // 启用热加载
        new webpack.HotModuleReplacementPlugin(),
        // 第三方类库引入
        // new webpack.ProvidePlugin({
        // $: "jquery",
        // Vue: "vue"
        // }),
        // 第三方库打包抽离
        // new webpack.optimize.CommonsChunkPlugin({
        //     // 入口引入时的名字
        //     name: ['vue', 'jquery'],
        //     // 打包文件的路径
        //     filename: 'static/js/[name].min.js',
        //     // 最小打包模块
        //     minChunks: 3
        // }),
    ],
    // watch 配置
    watchOptions: {
        // 检测文件修改时间,单位(毫秒)
        poll: 1000,
        // 防止误操作重复打包,半秒内重复保存,不执行打包操作
        aggregeateTimeout: 500,
        ignore: /node_modules/
    },
    // 配置开发时用的服务器
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: '127.0.0.1',
        // 服务端压缩开启
        compress: true,
        port: 4399,
        historyApiFallback: true
    }
};

```