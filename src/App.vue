<template>
  <v-app>
    <vueheader></vueheader>
    <v-content>
      <router-view/>
    </v-content>
<!--     <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
    <vuefooter></vuefooter>
  </v-app>
</template>

<style>
@import url(https://fonts.googleapis.com/earlyaccess/cwtexhei.css);
.content--wrap {
  overflow: auto
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
