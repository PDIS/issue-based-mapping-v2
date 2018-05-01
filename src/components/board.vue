<template>
<v-container grid-list-md>
     <v-layout row>
    <v-flex xs2 sm6  v-for="list in lists" :key="list.id">
      <v-card>
        <v-toolbar color="teal" dark>
          <v-toolbar-title>{{list.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list>
          <v-list-group
            v-for="card in list.cards"
            :key="card.id"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ card.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="card in list.cards" :key="card.id" @click="">
              <v-list-tile-content>
                <v-list-tile-title>{{ card.name }}</v-list-tile-title>
              </v-list-tile-content>
             <!--  <v-list-tile-action>
                <v-icon>{{ subItem.action }}</v-icon>
              </v-list-tile-action> -->
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      board:{},
      lists:[],
      cards:[]
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
      res.map( l => {
        let list = {}
        list.id = l.id
        list.name = l.name
        list.cards = l.cards
        that.lists.push(list)
      })
      console.log(that.lists)
    })
  }
}
</script>

<style>

</style>
