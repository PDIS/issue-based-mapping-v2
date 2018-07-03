// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueKonva from 'vue-konva'
import VueI18n from 'vue-i18n';
import Vuex from 'vuex'
import store from './store'


Vue.use(Vuex)
Vue.use(VueKonva)
Vue.use(VueI18n);
Vue.use(Vuetify)

Vue.config.productionTip = false

//i18n
import en from './i18n/en.json';
import tw from './i18n/tw.json';

const locales = {
  'en': en,
  'zh-TW': tw,
};

const i18n = new VueI18n({
  locale: navigator.language, // set locale
  messages: locales // set locale messages
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
  i18n
})
