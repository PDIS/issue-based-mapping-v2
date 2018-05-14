<template>
  <v-container grid-list-md>
     <v-layout row>
    <v-flex xs12 md4 lg3 v-for="(list, index) in lists" :key="list.id">
      <v-toolbar text-center>
          <v-toolbar-title class="subheading">{{list.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      <v-card>
          <v-container
        fluid
        grid-list-lg
      >

                       <draggable v-model="list.cards" :options="{group:'cards',animation:200}" @start="drag=true" @end="drag=false" @add="newcard" style="min-height:1em" >

            <v-card :color="list.color" hover  v-for="card in list.cards" :key="card.id" class="ma-2" :id="card.id">
              <v-card-title primary-title>
                <div class="body-2">{{card.name}}</div>
              </v-card-title>
              <!-- <v-card-actions>
                <v-btn flat dark>Listen now</v-btn>
              </v-card-actions> -->
            </v-card>
  
                    </draggable>
          </v-container>
    
      <v-footer><v-btn color="black" dark style="margin:0;width:100%" class="subheading" @click.native.stop="dialog = true">新增卡片
              <v-icon dark right>add</v-icon>
            </v-btn></v-footer>


      </v-card>
    </v-flex>
  </v-layout>
     <newcard :dialog='dialog'></newcard>
  </v-container>
</template>

<script>
import draggable from 'vuedraggable'
import newcard from './newcard'
export default {
  components: {
    draggable,
    newcard
  },
  data () {
    return {
      board: {},
      lists: [],
      cards: [],
      dialog: false
    }
  },
  methods: {
    getcards: function(id) {
      let newcards = []
      for (let c of this.cards) {
        if (c.idList == id) {
          newcards.push(c)
        }
      }
      return newcards
    },
    newcard: function(e) {
      console.log(e)
    }
  },
  created: function() {
    let that = this;
    this.board.id = this.$route.params.id
    Trello.boards.get(this.board.id, function(res) {
      that.board.name = res.name
      if (res.desc != '') {
        that.board.desc = JSON.parse(res.desc)
      }
    })
    Trello.boards.get(this.board.id + '/lists',{cards: 'open'}, function(res) {
      /* for (let i in res) {
        let list = {}
        list.id = res[i].id
        list.name = res[i].name
        list.cards = res[i].cards
        switch (list.name)
        {
          case '資料/文件/連結':
          list.color = 'blue accent-1'
          break
          case '問題面向':
          list.color = 'yellow lighten-1'
          break
          case '問題細節':
          list.color = 'yellow lighten-3'
          break
          case '解法':
          list.color = 'light green accent-3'
          break
          case '回應':
          list.color = 'orange'
          break
          case '困難':
          list.color = 'pink'
          break
          case '利害關係人':
          list.color = 'indigo'
          break
          default:
          list.color = 'teal'
          break
        }
        that.lists.push(list)
      } */
      res.map( l => {
        let list = {}
        list.id = l.id
        list.name = l.name
        list.cards = l.cards
        switch (list.name)
        {
          case '資料/文件/連結':
          list.color = 'blue accent-1'
          break
          case '問題面向':
          list.color = 'yellow lighten-1'
          break
          case '問題細節':
          list.color = 'yellow lighten-3'
          break
          case '解法':
          list.color = 'light green accent-3'
          break
          case '回應':
          list.color = 'orange'
          break
          case '困難':
          list.color = 'pink'
          break
          case '利害關係人':
          list.color = 'indigo'
          break
          default:
          list.color = 'teal'
          break
        }
        that.lists.push(list)
      })
    })
    /* Trello.boards.get(this.board.id + '/cards',{cards: 'open'}, function(res) {
      that.cards = res
    }) */
  }
}
</script>

<style>

</style>
