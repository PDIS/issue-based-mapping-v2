<template>
  <v-app style="background-color:white">
    <vueheader></vueheader>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<style>
@import url(https://fonts.googleapis.com/earlyaccess/notosanstc.css);
.application, .title, .headline{
  font-family: Roboto, 'Noto Sans TC'!important
}
</style>


<script>
import header from './components/header'
import footer from './components/footer'
export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  name: 'App',
  components: {
    'vueheader' : header,
    'vuefooter' : footer
  }
}
</script>
