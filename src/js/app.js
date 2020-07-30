import Vue from 'vue';

import store from './store';
import App from './App.vue';

new Vue({
  render: createElement => createElement(App),
  store,
}).$mount('#app');
