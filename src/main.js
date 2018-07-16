// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueKonva from 'vue-konva'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n';
import store from './store'

Vue.use(Vuex)
Vue.use(vuexI18n.plugin, store )
Vue.use(VueKonva)
Vue.use(Vuetify)

Vue.config.productionTip = false

//i18n
import en from './i18n/en.json';
import tw from './i18n/tw.json';

Vue.i18n.add('en', en);
Vue.i18n.add('zh-TW', tw);
Vue.i18n.set(navigator.language);

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
})
