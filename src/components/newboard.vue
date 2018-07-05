<template>
  <v-container fluid >
    <v-layout row wrap justify-center>
      <v-flex xs12 sm6>
        <v-flex xs6 text-xs-left pt-5 pb-5>          
          <span class="title">新增看板</span>
        </v-flex>
        <v-flex>
          <v-snackbar
            v-model="snackbar"
            absolute
            top
            right
            color="cyan"
          >
            <span>新增成功!</span>
            <v-icon dark>check_circle</v-icon>
          </v-snackbar>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
            <v-container>
              <v-text-field label="看版名稱" prepend-icon="assignment" v-model="board.name" :counter="20" :rules="nameRules" color="grey-blue darken-2"></v-text-field>
              <v-text-field label="議題名稱" prepend-icon="announcement" v-model="board.desc.title" :rules="requiredRules" color="grey-blue darken-2"></v-text-field>
              <v-text-field label="提案人" prepend-icon="person" v-model="board.desc.person" :rules="requiredRules" color="grey-blue darken-2"></v-text-field>
              <v-menu ref="date" lazy :close-on-content-click="false" v-model="picker" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="date">
                <v-text-field slot="activator" label="提案日期" v-model="board.desc.date" prepend-icon="event" :rules="requiredRules" readonly color="grey-blue darken-2"></v-text-field>
                <v-date-picker color="cyan darken-4" v-model="board.desc.date" @input="$refs.date.save(date)" locale="zh-tw"></v-date-picker>
              </v-menu>
              <v-text-field label="負責單位" prepend-icon="supervised_user_circle" v-model="board.desc.department" :rules="requiredRules" color="grey-blue darken-2"></v-text-field>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn flat color="grey lighten-1" @click="resetForm" class="subheading">重新填寫</v-btn>
              <v-spacer></v-spacer>
              <v-btn to="/" flat class="subheading">取消</v-btn>
              <v-btn :disabled="!formIsValid" flat color="cyan" type="submit" class="subheading">確認</v-btn>
            </v-card-actions>
          </v-form>
        </v-flex>
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
        date: null,
        picker: false,
        valid:false,
        nameRules: [
          v => !!v || '此欄位為必填!',
          v => v.length <= 20 || '此欄位不可超過20個字!'
        ],
        requiredRules: [
          v => !!v || '此欄位為必填!',
        ],
        snackbar: false,
        board: {
          id:'',
          name:'',
          desc:{
            'title': '',
            'person': '',
            'date': null,
            'department': ''
          },
        }
      }
    },
    methods: {
      submit: function() {
        let that = this
        if (this.$route.params.id != undefined) {
          Trello.put('boards/' + this.board.id,{'name':this.board.name},function(res) {
            Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.board.desc)},function() {
              that.$router.push('/')
            })
          })
        }
        else {
          Trello.post('boards',{'name':this.board.name,'idOrganization':'5ad56d6d96cb269a7a2aaa0a','idBoardSource':'5ab49c39f2917ad1cff1a3de','prefs_permissionLevel':'public','keepFromSource':'none'},function(res) {
            Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.board.desc)},function() {
              this.snackbar = true
              that.$router.push('/')
            })
          })
        }
      },
      resetForm: function() {
        this.$refs.form.reset()
      },
      getstatus: function() {
        let that = this
        if (this.$route.params.id != undefined) {
          this.board.id = this.$route.params.id
          Trello.boards.get(this.board.id, function(res) {
            that.board.name = res.name
            if (res.desc != '') {
              that.board.desc = JSON.parse(res.desc)
            }
          })
        }
        else {
        }
      }
    },
    computed: {
      formIsValid () {
        return (
          this.board.name &&
          this.board.desc.title &&
          this.board.desc.person &&
          this.board.desc.date &&
          this.board.desc.department
        )
      }
    },
    created: function() {
      this.getstatus()
    }
  }
</script>

