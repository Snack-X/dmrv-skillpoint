import Vue from 'vue';

import store from '../vue/store';
import App from '../vue/App.vue';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

new Vue({
  render: createElement => createElement(App),
  store,
}).$mount('#app');
