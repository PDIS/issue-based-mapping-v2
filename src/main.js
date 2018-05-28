// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueMindmap from 'vue-mindmap'
import 'vue-mindmap/dist/vue-mindmap.css'
import VueKonva from 'vue-konva'

Vue.use(VueKonva)

Vue.use(Vuetify)
Vue.use(VueMindmap)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
