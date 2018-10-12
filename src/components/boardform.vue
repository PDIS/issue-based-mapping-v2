<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      top
      color="cyan"
    >
      <span>{{success}}!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-dialog v-model="boardform" persistent  max-width="50em">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit" class="pa-3">
          <v-container>
            <v-text-field label="看版名稱" prepend-icon="assignment" v-model="board.name" :counter="20" :rules="nameRules" color="grey-blue darken-2"></v-text-field>
            <v-text-field label="議題名稱" prepend-icon="announcement" v-model="board.desc.title" :rules="requiredRules" color="grey-blue darken-2"></v-text-field>
            <v-text-field label="提案人" prepend-icon="person" v-model="board.desc.person" :rules="requiredRules" color="grey-blue darken-2"></v-text-field>
            <v-menu ref="date" lazy :close-on-content-click="false" v-model="picker" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="date">
              <v-text-field slot="activator" label="提案日期" v-model="board.desc.date" prepend-icon="event" :rules="requiredRules" readonly color="grey-blue darken-2"></v-text-field>
              <v-date-picker color="cyan darken-4" v-model="board.desc.date" @input="$refs.date.save(date)" locale="zh-tw"></v-date-picker>
            </v-menu>
            <v-text-field label="負責單位" prepend-icon="supervised_user_circle" v-model="board.desc.department" :rules="requiredRules" color="grey-blue darken-2"></v-text-field>
            <v-text-field label="共筆連結" prepend-icon="supervised_user_circle" v-model="board.desc.link"  color="grey-blue darken-2"></v-text-field>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn flat color="grey lighten-1" @click="resetForm" class="subheading">重新填寫</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat class="subheading" @click="changeboardform('')">取消</v-btn>
            <v-btn flat color="cyan" type="submit" class="subheading" :disabled="!valid">確認</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      date: null,
      picker: false,
      valid: true,
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
          'department': '',
          'link': ''
        },
      },
      success: '',
    }
  },
  methods: {
    ...mapActions(['changeboardform']),
    submit: function() {
      let that = this
      if (this.selectedboardid != '') {
        Trello.put('boards/' + this.board.id,{'name':this.board.name},function(res) {
          Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.board.desc)},function() {
            that.success = '修改成功!'
            that.snackbar = true
            that.$store.dispatch('changeboardform','')
            that.$store.dispatch('getboards')
          })
        })
      }
      else {
        Trello.post('boards',{'name':this.board.name,'idOrganization':'5ad56d6d96cb269a7a2aaa0a','idBoardSource':'5ab49c39f2917ad1cff1a3de','prefs_permissionLevel':'public','keepFromSource':'none'},function(res) {
          Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.board.desc)},function() {
            that.success = '新增成功!'
            that.snackbar = true
            that.$router.push('/')
            that.$store.dispatch('changeboardform','')
            that.$store.dispatch('getboards')
          })
        })
      }
    },
    resetForm: function() {
      this.$refs.form.reset()
    },
    getstatus: function() {
      let that = this
      if (this.selectedboardid != '') {
        this.board.id = this.selectedboardid
        Trello.boards.get(this.board.id, function(res) {
          that.board.name = res.name
          that.board.desc = JSON.parse(res.desc)
        })
      }
      else {
        this.resetForm()
      }
    }
  },
  computed: {
    ...mapGetters ({
      boardform: 'boardform',
      selectedboardid: 'selectedboardid'
    }),
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
  watch: {
    selectedboardid: function() {
      this.getstatus()
    }
  },
}
</script>

