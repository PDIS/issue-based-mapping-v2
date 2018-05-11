<template>

  <v-container grid-list-md >
    
    
      
    <v-layout row wrap>
      
      <v-flex xs12>
        
        <div class="white">
          <div class="text-xs-left">
            <v-btn color="grey lighten-1" outline small fab btn><v-icon>reorder</v-icon></v-btn>    
            <v-btn color="grey lighten-1" outline small fab btn><v-icon>work</v-icon></v-btn>    
            <v-btn color="grey lighten-1" outline small fab btn><v-icon>pan_tool</v-icon></v-btn>    
          </div>
          <div class="text-xs-center">
          <h1> 議題分析表 </h1>
          <div class="pb-4">分析議題的好幫手</div>
          </div>
        </div>
        <v-text-field class="mt-4 mb-2" prepend-icon="search" label="搜尋議題" value="Input text" v-model="search"></v-text-field>
      </v-flex>
       <v-flex xs12 text-xs-right>
         
        <span class="group pa-2">
          <v-btn outline btn><v-icon>subject</v-icon></v-btn>
          <v-btn outline btn><v-icon>apps</v-icon></v-btn>
        </span>
      </v-flex>
    </v-layout>  
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg3 text-xs-center>

        <v-card height='20em' hover color="yellow">
          <v-container fill-height>
               <v-layout align-center justify-center>
                  <v-card-text>
                      <v-btn fab dark large color="indigo darken-4" :to="{name:'newboard'}">
                          <v-icon dark>add</v-icon>
                      </v-btn>
                  </v-card-text>
               </v-layout>
          </v-container>
        </v-card>
      </v-flex>
       <v-flex xs12 sm6 md4 lg3 v-for="board in filteredList" :key="board.id" >
        <v-card color="white" :to="{name:'board', params:{id:board.id}}" hover height="20em">
          
          <!-- <v-card-title class="white" style="height:2em">
            <h4 class="ml-2">#{{ board.title }}</h4>
          </v-card-title>
          <v-card-text style="height:15em; background-color:white">
            
            <div style="color: grey"> <v-icon color="grey lighten-1" size="16px" class="mr-1">announcement</v-icon> 提案名稱</div> 
            <div style="height:5em" class="ml-4 body-2" v-html="board.desc.title"></div>
            
            <div style="color: grey"><v-icon color="grey lighten-1" size="16px" class="mr-1">person</v-icon> 提案人 <br></div>
            <div class="ml-4 body-2">{{board.desc.person}}</div>

            <div style="color: grey"><v-icon color="grey lighten-1" size="16px" class="mr-1">event</v-icon> 提案日期 <br></div>
            <div class="ml-4 body-2">{{board.desc.date}}</div> 
            </v-card-text>   -->
           
            <v-list subheader style="background-color:white">
               <v-subheader class="light-blue accent-1" style="color:black"># <div class="ml-2">{{ board.title }}</div>
               <v-spacer></v-spacer>
               <v-chip color="pink lighten-1" text-color="white" >
      教育部
    </v-chip></v-subheader>
               <v-divider></v-divider> 
               <br>
               <v-list-tile>
                 <v-list-tile-avatar><v-icon color="grey lighten-1">announcement</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title>提案名稱</v-list-tile-sub-title>
                <v-list-tile-title v-html="board.desc.title"></v-list-tile-title>
                
              </v-list-tile-content>
               </v-list-tile>
                <v-list-tile>
                 <v-list-tile-avatar><v-icon color="grey lighten-1">face</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title>提案人</v-list-tile-sub-title>
                <v-list-tile-title v-html="board.desc.person"></v-list-tile-title>
              </v-list-tile-content>
               </v-list-tile>
               
                <v-list-tile>
                 <v-list-tile-avatar><v-icon color="grey lighten-1">event</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title>提案日期</v-list-tile-sub-title>
                <v-list-tile-title v-html="board.desc.date"></v-list-tile-title>
              </v-list-tile-content>
               </v-list-tile>
               
            </v-list>
            
        
        <v-divider></v-divider> 
          <v-card-actions style=" background-color:white">  
                   
          <v-btn round outline flat color="blue darken-3" :to="{name:'board', params:{id:board.id}}">進入議題</v-btn>
          <v-spacer></v-spacer> 
          <v-btn icon flat color="grey" :to="{name:'editboard',params:{id:board.id}}"><v-icon>edit</v-icon></v-btn>
          <v-btn icon flat color="grey" :to="{name:'index'}" active-class @click.native.stop="dialog=true;selectedid=board.id"><v-icon>delete</v-icon></v-btn>
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
        window.location.reload(true);
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
