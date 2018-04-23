<template>
  <v-container fluid grid-list-sm>
   <v-layout row wrap class="full-height" >
      <v-flex xs12 sm4 md3 v-for="board in boards" :key="board.id">
        <v-layout column>
          <v-flex d-flex>
            <v-card class="post" style="margin: 2px;" color="blue-grey darken-3" tile raised>
              <v-card-media :src="result.image_url" height="200px">
              </v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">
                    <p class="nyt">{{result.title}}</p>
                  </h3>
                  <div>
                    <p>{{result.abstract}}</p>
                  </div>
                  <span class="grey--text">{{makeFriendlyDate(result.published_date)}}</span>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
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
      let a = Trello.organizations.get('ibm249/boards',{'filter':'all'}, function(res) {
      this.boards = []
      res.map(b => {
        console.log(b)
        let board = {};
        board.id = b.id
        board.title = b.name

        this.boards.push(board)
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
