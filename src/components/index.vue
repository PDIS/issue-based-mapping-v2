<template>
  <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12 >
        <v-text-field color="blue-grey darken-4" class="mt-3 mb-0" prepend-icon="search" label="搜尋議題" value="Input text" v-model="search"></v-text-field>
      </v-flex>
      <v-flex xs4 text-xs-left pt-5>          
        <span>所有議題列表</span>
      </v-flex>
       <v-flex xs4 text-xs-right offset-xs4 pt-4>   
          <span class="group">
            <v-btn outline btn @click="showtable = true"><v-icon>subject</v-icon></v-btn>
            <v-btn outline btn @click="showtable = false"><v-icon>apps</v-icon></v-btn>
          </span>
      </v-flex > 
    </v-layout>  
    <v-divider></v-divider>
    <v-layout row wrap v-if="!showtable">
      <v-flex xs12 sm6 md4 lg3 text-xs-center v-if="orgadmin.includes(me)">
        <v-card height='20em' hover class="yellow darken-2" :to="{name:'newboard'}">
          <v-container fill-height>
            <v-layout align-center justify-center>
              <v-card-text >
                <v-btn class="cyan darken-4" fab dark large :to="{name:'newboard'}">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-card-text>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
        <v-flex xs12 sm6 md4 lg3 v-for="board in filteredList" :key="board.id" >
          <v-card color="white" :to="{name:'board', params:{id:board.id}}" hover height="20em">
            <v-list subheader style="background-color:white">
              <v-subheader class="grey lighten-3" style="color:black"># <div class="ml-2">{{ board.title }}</div>
                <v-spacer></v-spacer>
                <v-chip outline color="black" text-color="black">
                  {{board.desc.department}}
                </v-chip>
              </v-subheader>
              <v-list-tile class="mt-3">
                <v-list-tile-avatar>
                  <v-icon color="grey lighten-1">announcement</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-sub-title>提案名稱</v-list-tile-sub-title>
                  <v-list-tile-title v-html="board.desc.title"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-icon color="grey lighten-1">face</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-sub-title>提案人</v-list-tile-sub-title>
                  <v-list-tile-title v-html="board.desc.person"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-icon color="grey lighten-1">event</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-sub-title>提案日期</v-list-tile-sub-title>
                  <v-list-tile-title v-html="board.desc.date"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          <v-divider></v-divider> 
          <v-card-actions class="mt-1" style="background-color:white">  
            <v-btn class="blue-grey darken-4 white--text" :to="{name:'board', params:{id:board.id}}"><v-icon>arrow_right</v-icon> 進入議題</v-btn>
            <v-spacer></v-spacer> 
            <div v-if="board.admin.includes(me)">
              <v-btn icon flat color="grey" :to="{name:'editboard',params:{id:board.id}}"><v-icon>edit</v-icon></v-btn>
              <v-btn icon flat color="grey" :to="{name:'index'}" active-class @click.native.stop="dialog=true;selectedid=board.id"><v-icon>delete</v-icon></v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <template v-if="showtable">
      <v-data-table
        :headers="headers"
        :items="boards"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.title }}</td>
          <td class="text-xs-left">{{ props.item.desc.title }}</td>
          <td class="text-xs-left">{{ props.item.desc.person }}</td>
          <td class="text-xs-left">{{ props.item.desc.date }}</td>
          <td class="text-xs-left">{{ props.item.desc.department }}</td>
        </template>
      </v-data-table>
    </template>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">確定刪除?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="dialog=false; closeboard(selectedid)">確定</v-btn>
          <v-btn color="black" flat="flat" @click.native="dialog=false" :to="{name:'index'}" active-class>取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      boards: [],
      search: '',
      dialog: false,
      selectedid: '',
      me: '',
      canedit: true,
      orgadmin: [],
      showtable: false,
      headers: [
          {
            text: '議題名稱',
            align: 'left',
            sortable: false,
            value: 'title'
          },
          { text: '提案名稱', value: 'desc.title' },
          { text: '提案人', value: 'desc.person' },
          { text: '提案日期', value: 'desc.date' },
          { text: '主責部會', value: 'desc.department' },
        ],
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
          board.admin = []
          b.memberships.map( m => {
            if (m.memberType == 'admin') {
              board.admin.push(m.idMember)
            }
          })
          that.boards.push(board)
        })
      })
    },
    closeboard: function(id) {
      let that = this
      Trello.put('boards/' + id ,{'closed':true},function(res) {
        window.location.reload(true);
      })
    },
    getme: function() {
      let that = this;
      Trello.members.get('me', function (res) {
        that.me = res.id
      })
    },
    getorgadmin: function() {
      let that = this;
      Trello.organizations.get('ibm249',{'fields':'all'}, function(res) {
        res.memberships.map(m => {
          /* if (m.memberType == 'admin') {
            that.orgadmin.push(m.idMember)
          } */
          that.orgadmin.push(m.idMember)
        })
      })
    }
  },
  created: function() {
    this.getboards()
    this.getme()
    this.getorgadmin()
  },
  computed: {
    filteredList() {
      return this.boards.filter(board => {
        return board.title.toLowerCase().includes(this.search.toLowerCase())
      })
    },
  },
}
</script>

<style>

</style>
