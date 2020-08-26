import Vue from 'vue';

import store from '../vue/store';
import App from '../vue/App.vue';

import 'bootstrap';
import '../css/bootstrap.scss';
import '../css/global.scss';

new Vue({
  render: createElement => createElement(App),
  store,
}).$mount('#app');
