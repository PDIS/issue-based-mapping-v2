<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field
        prepend-icon="search"
        label="搜尋提案"
        flat
        v-model="search"
      ></v-text-field>
      </v-flex>
       <v-flex xs6 md4 lg3 v-for="board in filteredList" :key="board.id" >
        <v-card color="white" :to="{name:'board', params:{id:board.id}}" hover height="20em">
           <v-card-title primary-title style="height:5em">
          <div>
            <h3 class="headline mb-0">{{board.title}}</h3>
          </div>
        </v-card-title>
        <v-card-text style="height:10em">
            <div>提案名稱:{{board.desc.title}}</div>
            <div>提案人:{{board.desc.person}}</div>
            <div>日期:{{board.desc.date}}</div>
        </v-card-text>
          <v-card-actions style="height:5em">
          <v-btn flat color="orange" :to="{name:'editboard',params:{id:board.id}}">修改</v-btn>
          <v-btn flat color="purple" :to="{name:'index'}" active-class @click.native.stop="dialog=true;selectedid=board.id">刪除</v-btn>
          <!-- <v-btn flat color="purple" @click.native="closeboard(board.id)" >刪除</v-btn> -->
        </v-card-actions>
        </v-card>
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
    </v-layout>
     <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">確定刪除?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <v-btn color="green darken-1" flat="flat" @click.native="dialog=false;closeboard(selectedid)" :to="{name:'index'}" active-class>確定</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="dialog=false" :to="{name:'index'}" active-class>取消</v-btn>
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
