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
      style="background-color:#032e3d;"
      class="d-inline-block pa-5"
      
    >
    <!-- class="grey darken-4 d-inline-block pa-5" -->
      <v-list 
        color="grey lighten-4"
        >
        <v-list-tile
        >
          <v-list-tile-action >
            <v-icon medium >home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content >
            <v-list-tile-title >回到首頁</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          
        >
          <v-list-tile-action>
            <v-icon >work</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>說明文件</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
         <v-list-tile
          
        >
          <v-list-tile-action>
            <v-icon >pan_tool</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>常見問題</v-list-tile-title>
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
      dark 
      
      style="background-color:#10768D;"
    >
    <!-- color="grey lighten-3" -->
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn> -->
     <v-toolbar-title v-text="title">議題分析表</v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- <v-btn icon outline small fab btn>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn icon outline small fab btn>
        <v-icon>work</v-icon>
      </v-btn>
      <v-btn icon outline small fab btn>
        <v-icon>pan_tool</v-icon>
      </v-btn> -->
      <v-btn icon outline small fab btn >
        <v-avatar>
          <img :src="me.avatar" alt="username">
        </v-avatar> 
      </v-btn>
          
      <!-- <v-btn color="primary" dark>{{me.name}}
        <v-icon dark right>person</v-icon>
      </v-btn> -->
<!--       <v-btn icon @click.stop="login">
        <v-icon>person</v-icon>
      </v-btn> -->
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
 /*      items: [{
        icon: '',
        title: ''
      }], */
      items: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '議題分析表',
      me: {
        'id':'',
        'name':'',
        'avatar': ''
      },
      message: 
        {
          avatar: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460',
          name: 'John Leider',
          title: 'Welcome to Vuetify.js!',
          excerpt: 'Thank you for joining our community...'
        },
      
    }
  },
  methods: {
    login: function () {
      Trello.authorize({name: '議題分析表' ,expiration:'never',scope: { read: true, write: true },})
    },
    menu: function () {
      console.log(this.items)
    },
    getsuccessed: function(res) {
      console.log(res)
    }
  },
  created: function() {
    let that = this
    let a = Trello.organizations.get('ibm249/boards',{'filter':'all'}, function(res) {
      this.items = []
      res.map(b => {
        let item = {};
        item.icon = 'bubble_chart'
        item.title = b.name
        this.items.push(item)
      })
    })
    Trello.members.get('me', function (res) {
      that.me.id = res.id
      that.me.name = res.username,
      that.me.avatar = res.avatarUrl + '/50.png'
      console.log(that.me)
    },this.login())
  }
}
</script>

<style>

</style>
