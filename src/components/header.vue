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
            <v-list-tile-title>回到首頁</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon >work</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>說明文件</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon >pan_tool</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>常見問題</v-list-tile-title>
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
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <strong class="mr-3 title">Hi, {{me.name}}</strong>
      <v-btn icon outline small fab btn disabled class="mr-3" v-if="me.avatar != ''">
        <v-avatar>
          <img :src="me.avatar" alt="username">
        </v-avatar> 
      </v-btn>
    </v-toolbar> 
  </div>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      title: '議題分析表',
      me: {
        'id':'',
        'name':'',
        'avatar': ''
      },
      board: {
        id: '',
        name: '',
        desc: {}
      },
      search: ''
    }
  },
  methods: {
    login: function () {
      Trello.authorize({name: '議題分析表' ,expiration:'never',scope: { read: true, write: true },})
    },
    getuser: function() {
      let that = this
      Trello.members.get('me', function (res) {
        that.me.id = res.id
        that.me.name = res.fullName
        if (res.avatarSource != 'none')
        {
          that.me.avatar = res.avatarUrl + '/50.png'
        }
      },this.login())
    },
    getboardinfo: function() {
      let that = this
      if (this.$route.params.id != undefined) {
        this.board.id = this.$route.params.id
        Trello.boards.get(this.board.id, function(res) {
          that.board.name = res.name
          if (res.desc != '') {
            that.board.desc = JSON.parse(res.desc)
          }
        })
      }
      else {
        this.board.desc = {}
      }
    }
  },
  created: function() {
    this.getuser()
    this.getboardinfo()
  },
  watch: {
    $route: function() {
      this.getboardinfo()
    }
  }
}
</script>

<style>

</style>
