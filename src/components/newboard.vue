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
                  :counter="20"
                  required
                  :rules="nameRules"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="議題名稱"
                  prepend-icon="announcement"
                  v-model="desc.title"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="提案人"
                  prepend-icon="person"
                  v-model="desc.person"
                  required
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
          required
        ></v-text-field>
        <v-date-picker v-model="desc.date" @input="$refs.date.save(date)"  locale="zh-tw"></v-date-picker>

      </v-menu>
    </v-flex>
            </v-layout>
          </v-container>
              <v-divider class="mt-5"></v-divider>
              <v-btn color="primary" flat @click="submit">新增</v-btn>
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
        boardname:'',
        desc:{
          'title':'',
          'person':'',
          'date':null
          },
        date: null,
        picker: false,
        valid:false,
        nameRules: [
        v => !!v || '此欄位為必填!',
        v => v.length <= 20 || '此欄位不可超過20個字!'
      ],
      }
    },
    methods: {
      submit: function() {
        let that = this
        Trello.post('boards',{'name':this.boardname,'idOrganization':'5ad56d6d96cb269a7a2aaa0a','idBoardSource':'5ab49c39f2917ad1cff1a3de','prefs_permissionLevel':'org','keepFromSource':'none'},function(res) {
          Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.desc)},function() {
            that.$router.push('/')
          })
        })
      }
    }
  }
</script>

