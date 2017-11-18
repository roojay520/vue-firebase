## vue + firebase 模拟实现地址选择四级联动

使用 vue + firebase 完成一个简单的地址选择器, 使用 webpack 打包生成.

将地址数据导入到 firebase 实时数据库中, 在应用中通过 firebase + vuefire 获得数据, 再使用 vue 将数据渲染到页面上.

* 安装 firebase 和 vuefire:
`npm i -S firebase vuefire`

* 在入口文件中注册使用 vuefire 和 firebase:
```JavaScript
// main.js
import VueFire from 'vuefire';
import Firebase from 'firebase';

Vue.use(VueFire);

```
在 vue 组件中注册使用 firebase
```javascript
import Firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyBSHeqABc_pmcXwBgP4GhIvO3DH9eJtZlo',
    authDomain: 'roojay123.firebaseapp.com',
    databaseURL: 'https://roojay123.firebaseio.com',
    projectId: 'roojay123',
    storageBucket: 'roojay123.appspot.com',
    messagingSenderId: '691637156012'
};
// 注册 app
Firebase.initializeApp(config);
// 获取数据库引用
const db = Firebase.database();
```
通过 `.ref('/')` 取得位于根目录下的地址数据数组:
```JavaScript
firebase: {
        data: db.ref('/')
    },
```
使用 vue `v-for` 指令, 将数组数据渲染到页面列表中.

为列表绑定一个 click 方法, 用于获取点击元素的 index, 在根据这个 index 的值渲染后面其他列表的数据.

![gif](https://i.loli.net/2017/11/18/5a0f0ff5c6cdb.gif)

查看:

`$ npm i`

`$ npm run dev `
