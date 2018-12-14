<template>
  <div>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
      dark 
      class="cyan darken-4 d-inline-block pa-5"
    >
      <img src="../assets/pdis-logo-03.png" style="width:190px; margin-top:-50px; margin-bottom:-30px;" alt="">
      <v-divider></v-divider>
      <!-- <v-text-field color="white" label="全站搜尋" value="Input text" v-model="search"></v-text-field> -->
      <v-list color="grey lighten-4">
        <v-list-tile to="/" active-class>
          <v-list-tile-action >
            <v-icon medium >home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content >
            <v-list-tile-title>{{$t("Home")}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon >work</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t("Instruction") }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="this.$route.params.id != undefined">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>announcement</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-html="board.desc.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <!-- <v-list-tile-sub-title>提案人</v-list-tile-sub-title> -->
            <v-list-tile-title v-html="board.desc.person"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon >event</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <!-- <v-list-tile-sub-title>提案日期</v-list-tile-sub-title> -->
            <v-list-tile-title v-html="board.desc.date"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon >supervised_user_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <!-- <v-list-tile-sub-title>提案日期</v-list-tile-sub-title> -->
            <v-list-tile-title v-html="board.desc.department"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
      prominent
      scroll-off-screen
      tabs
      flat
      light 
      color="grey lighten-3" 
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title >{{$t("Issue Mapping Instruction")}}</v-toolbar-title>
<!--       <v-spacer></v-spacer>
      <v-switch class='mt-4' color="primary" label="English"  :true-value="'en'" :false-value="'zh-TW'" v-model="lang" @change="setlang(lang)"></v-switch> -->
      <v-spacer></v-spacer>
      <strong class="mr-3 title">Hi, {{user.name}}</strong>
      <v-btn icon outline small fab btn disabled class="mr-3" v-if="user.avatar != ''">
        <v-avatar>
          <img :src="user.avatar" alt="username">
        </v-avatar> 
      </v-btn>
    </v-toolbar> 
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      title: this.$t("Issue Mapping Instruction"),
      search: '',
      lang: 'zh-TW'
    }
  },
  methods: {
    setlang: function(lang) {
      Vue.i18n.set(lang);
    }
  },
  created: function() {
    this.$store.dispatch('getuser')
    if (this.$route.params.id != undefined) {
      this.$store.dispatch('getboardinfo', this.$route.params.id)
    }
  },
  watch: {
    $route: function() {
      if (this.$route.params.id != undefined) {
        this.$store.dispatch('getboardinfo', this.$route.params.id)
      }
    }
  },
  computed: mapGetters({
    user: 'user',
    board: 'board'
  }),
}
</script>

<style>

</style>
