<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      disable-resize-watcher
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
      color="#2A396D" 
      dark
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title >{{$t("Issue Mapping Instruction")}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <GoogleLogin :params="params" :onSuccess="onSuccess" :onFailure="onFailure" class="v-btn v-btn--flat theme--dark" v-if="!isLogin">登入</GoogleLogin>
      <!-- <GoogleLogin :params="params" :logoutButton = "true" :onSuccess="logout" class="v-btn v-btn--flat theme--dark" v-if="isLogin">Logout</GoogleLogin> -->
      <!-- <strong class="mr-3 title">Hi, {{user.name}}</strong> -->
      <!-- <v-btn icon outline small fab btn disabled class="mr-3 mb-3" v-if="user.avatar != ''">
        <v-avatar>
          <img :src="user.avatar" alt="username">
        </v-avatar> 
      </v-btn> -->
      <!-- <v-speed-dial direction="bottom" open-on-hover = true transition="slide-y-reverse-transition" v-if="user.avatar != ''">
      <template v-slot:activator>
        <v-btn icon small fab class="mr-3 mb-3">
          <v-avatar>
            <img :src="user.avatar" alt="username">
          </v-avatar>
        </v-btn>
      </template>
      <v-btn fab dark small class="mr-3">
        <v-icon>exit_to_app<GoogleLogin :params="params" :logoutButton = "true" :onSuccess="logout" class="v-btn v-btn--flat theme--dark" v-if="isLogin"></GoogleLogin></v-icon>
      </v-btn>
    </v-speed-dial> -->
      <v-menu open-on-hover offset-y v-if="user.avatar != ''">
        <template v-slot:activator="{ on }">
          <v-btn icon small fab class="mr-3 mb-3" v-on="on">
            <v-avatar>
              <img :src="user.avatar" alt="username">
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-tile>
            <v-list-tile-title><GoogleLogin :params="params" :logoutButton = "true" :onSuccess="logout" v-if="isLogin">登出</GoogleLogin></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar> 
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';
import GoogleLogin from 'vue-google-login';

const { mapFields } = createHelpers({
  getterType: 'getBoardField',
  mutationType: 'updateBoardField',
});

export default {
  components: {
     GoogleLogin
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      title: this.$t("Issue Mapping Instruction"),
      search: '',
      lang: 'zh-TW',
      params: {
        client_id: "203197589455-a4mgtbjg6lvr2jb5eu2bngndrfrr75bn.apps.googleusercontent.com"
      },
      isLogin: false,
    }
  },
  methods: {
    setlang: function(lang) {
      Vue.i18n.set(lang);
    },
    onSuccess: function(googleUser) {
      /* this.user.id = googleUser.getBasicProfile().Eea */
      this.user.avatar = googleUser.getBasicProfile().Paa
      this.user.name = googleUser.getBasicProfile().ig
      this.user.email = googleUser.getBasicProfile().U3
      this.isLogin = true
      /* window.location.reload(true) */
    },
    onFailure: function() {
      
    },
    getLoginStatus: function() {
      Vue.GoogleAuth.then(auth2 => {
        if (auth2.currentUser.get().w3 == null) {
          this.isLogin = false
        } else {
          /* this.user.id = auth2.currentUser.get().w3.Eea */
          this.user.avatar = auth2.currentUser.get().w3.Paa
          this.user.name = auth2.currentUser.get().w3.ig
          this.user.email = auth2.currentUser.get().w3.U3
          this.isLogin = true
        }
      })
    },
    logout: function() {
      this.isLogin = false
      this.user.id = ''
      this.user.avatar = ''
      this.user.name = ''
      this.user.email = ''
      /* window.location.reload(true) */
    },
  },
  created: function() {
    this.getLoginStatus()
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
  computed: {
    ...mapGetters({
      user: 'user',
    }),
    ...mapFields ({
      board: 'board',
    }),
  },
}
</script>

<style>

</style>
