<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm6>
        <v-card>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  label="看版名稱"
                  prepend-icon="assignment"
                  v-model="boardname"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="議題名稱"
                  prepend-icon="announcement"
                  v-model="desc.title"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="提案人"
                  prepend-icon="person"
                  v-model="desc.person"
                ></v-text-field>
      <v-menu
        ref="date"
        lazy
        :close-on-content-click="false"
        v-model="picker"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        min-width="290px"
        :return-value.sync="date"
      >
        <v-text-field
          slot="activator"
          label="提案日期"
          v-model="desc.date"
          prepend-icon="event"
        ></v-text-field>
        <v-date-picker v-model="desc.date" @input="$refs.date.save(date)"  locale="zh-tw"></v-date-picker>

      </v-menu>
    </v-flex>
            </v-layout>
          </v-container>
              <v-divider class="mt-5"></v-divider>
              <v-btn color="primary" flat @click="submit">修改</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped>

</style>

<script>
  export default {
    data () {
      return {
        id:'',
        boardname:'',
        desc:{
          'title':'',
          'person':'',
          'date':null
          },
        date: null,
        picker: false,
      }
    },
    methods: {
      submit: function() {
        let that = this
        Trello.put('boards/' + this.id,{'name':this.boardname},function(res) {
          Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.desc)},function() {
            that.$router.push('/')
          })
        })
      }
    },
    created: function() {
      let that = this
      this.id = this.$route.params.id
      Trello.boards.get(this.id, function(res) {
        that.boardname = res.name
        if (res.desc != '') {
          that.desc = JSON.parse(res.desc)
        }
      })
    }
  }
</script>

