<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="text-xs-center">
          <h1 class="mt-3 mb-4"> 議題分析表 </h1>
        </div>
        <v-text-field prepend-icon="search" label="搜尋提案" flat v-model="search"></v-text-field>
      </v-flex>
      <v-flex xs6 md4 lg3 text-xs-center>
        <v-card height='20em' hover>
          <v-container fill-height>
               <v-layout align-center justify-center>
                  <v-card-text>
                      <v-btn fab dark large color="purple" :to="{name:'newboard'}">
                          <v-icon dark>add</v-icon>
                      </v-btn>
                  </v-card-text>
               </v-layout>
          </v-container>
        </v-card>
      </v-flex>
       <v-flex xs6 md4 lg3 v-for="board in filteredList" :key="board.id" >
        <v-card color="white" :to="{name:'board', params:{id:board.id}}" hover height="20em">
          <v-card-text style="height:15em; background-color:white">
            <v-list subheader style="background-color:white">
               <v-subheader text-xs-center># <div class="ml-2" color="b">{{ board.title }}</div></v-subheader>
               <v-list-tile>
                 <v-list-tile-avatar><v-icon>announcement</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title>提案名稱</v-list-tile-sub-title>
                <v-list-tile-title v-html="board.desc.title"></v-list-tile-title>
                
              </v-list-tile-content>
               </v-list-tile>
                <v-list-tile>
                 <v-list-tile-avatar><v-icon>person</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title>提案人</v-list-tile-sub-title>
                <v-list-tile-title v-html="board.desc.person"></v-list-tile-title>
              </v-list-tile-content>
               </v-list-tile>
                <v-list-tile>
                 <v-list-tile-avatar><v-icon>event</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>提案日期</v-list-tile-title>
                <v-list-tile-sub-title v-html="board.desc.date"></v-list-tile-sub-title>
              </v-list-tile-content>
               </v-list-tile>
            </v-list>
        </v-card-text>
          <v-card-actions style="height:5em">
          <v-container text-xs-center>
            <v-layout row wrap>
              <v-flex xs6>
          <v-btn round outline color="purple darken-2" :to="{name:'editboard',params:{id:board.id}}">修改</v-btn>
            </v-flex>
            <v-flex xs6>
          <v-btn round outline color="pink lighten-2" :to="{name:'index'}" active-class @click.native.stop="dialog=true;selectedid=board.id">刪除</v-btn>
            </v-flex>
            </v-layout>
          </v-container>
          <!-- <v-btn flat color="purple" @click.native="closeboard(board.id)" >刪除</v-btn> -->
        </v-card-actions>
        </v-card>
       </v-flex>
    </v-layout>
     <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">確定刪除?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <v-btn color="green" large @click.native="dialog=false; closeboard(selectedid)">確定</v-btn>
          <v-btn color="red" flat @click.native="dialog=false" :to="{name:'index'}" active-class>取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      boards:[],
      search:'',
      dialog:false,
      selectedid:''
    }
  },
  methods: {
    getboards: function () {
      let that = this
      Trello.organizations.get('ibm249/boards',{'filter':'open'}, function(res) {
        res.map(b => {
          let board = {};
          board.id = b.id
          board.title = b.name
          if (b.desc != '') {
            board.desc = JSON.parse(b.desc)
          }
          that.boards.push(board)
        })
      })
    },
    closeboard: function(id) {
      let that = this
      Trello.put('boards/' + id ,{'closed':true},function(res) {
        that.$router.push('/')
      })
    }
  },
  created: function() {
    this.getboards()
  },
  watch: {
    search: function() {
      console.log(this.search)
    }
  },
  computed: {
    filteredList() {
      return this.boards.filter(board => {
        return board.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
}
</script>

<style>

</style>
