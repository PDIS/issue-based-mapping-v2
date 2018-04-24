<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
       <v-flex xs3 v-for="board in boards" :key="board.id">
        <v-card color="white">
           <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{board.title}}</h3>

            <p>{{board.desc.title}}</p>
            <p>{{board.desc.people}}</p>
          </div>
        </v-card-title>
          <v-card-actions>
          <v-btn flat color="orange">修改</v-btn>
          <v-btn flat color="purple">刪除</v-btn>
        </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      boards:[]
    }
  },
  methods: {
    getboards: function () {
      let that = this
      Trello.organizations.get('ibm249/boards',{'filter':'all'}, function(res) {
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
    }
  },
  created: function() {
    this.getboards()
  }
}
</script>

<style>

</style>
