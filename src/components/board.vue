<template>
  <div class="v-container">
   <h1> params.id：{{ $route.params }}</h1>
  </div>
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
