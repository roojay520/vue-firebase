import 'normalize.css';

import Vue from 'vue';
import App from './App';
import router from './router';
import VueFire from 'vuefire';
import Firebase from 'firebase';


Vue.config.productionTip = false;

Vue.use(VueFire);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    render: h => h(App)
});
