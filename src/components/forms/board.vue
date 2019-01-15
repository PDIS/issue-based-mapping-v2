<template>
  <div>
    <snackbar></snackbar>
    <v-dialog v-model="openboard" persistent  max-width="50vw">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn flat color="grey" @click="resetForm" class="subheading">重新填寫</v-btn>
        </v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit" class="pa-3">
          <v-container>
            <v-text-field label="議題名稱" prepend-icon="assignment" v-model="board.name" :counter="20" :rules="nameRules" color="grey-blue darken-2"></v-text-field>
            <v-radio-group v-model="board.desc.issuesource" row prepend-icon="settings_ethernet">
              <div slot="label">提案來源</div>
              <v-radio label="部會自提" value="dep"></v-radio>
              <v-radio label="Join平台" value="join"></v-radio>
              <v-radio label="其他" value="other"></v-radio>
            </v-radio-group>
            <v-text-field v-if=" board.desc.issuesource == 'join'" label="Join平台原始提案名稱" prepend-icon="announcement" v-model="board.desc.title" color="grey-blue darken-2"></v-text-field>
            <v-text-field v-if=" board.desc.issuesource == 'other'" label="" prepend-icon="announcement" v-model="board.desc.title" color="grey-blue darken-2"></v-text-field>
            <v-text-field label="專案負責人" prepend-icon="face" v-model="board.desc.person" :rules="requiredRules" color="grey-blue darken-2"></v-text-field>
            <v-menu ref="date" lazy :close-on-content-click="false" v-model="picker" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="date">
              <v-text-field slot="activator" label="提案日期" v-model="board.desc.date" prepend-icon="event" :rules="requiredRules" readonly color="grey-blue darken-2"></v-text-field>
              <v-date-picker color="cyan darken-4" v-model="board.desc.date" @input="$refs.date.save(date)" locale="zh-tw"></v-date-picker>
            </v-menu>
            <v-text-field label="主辦部會" prepend-icon="person" v-model="board.desc.department" :rules="requiredRules" color="grey-blue darken-2"></v-text-field>
            <v-text-field label="協辦部會" prepend-icon="supervised_user_circle" v-model="board.desc.codepartment" color="grey-blue darken-2"></v-text-field>
            <v-text-field label="會議筆記連結" prepend-icon="notes" v-model="board.desc.link" placeholder="建議您開一份線上筆記，紀錄跟此案相關的細節" color="grey-blue darken-2"></v-text-field>
          </v-container>
          <v-card-actions>
            <!-- <v-btn flat color="grey lighten-1" @click="resetForm" class="subheading">重新填寫</v-btn> -->
            <v-spacer></v-spacer>
            <v-btn flat class="subheading" @click="editboard('')">取消</v-btn>
            <v-btn flat color="cyan" type="submit" class="subheading" :disabled="!valid">確認</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';
import snackbar from '../snackbar'

const { mapFields } = createHelpers({
  getterType: 'getBoardField',
  mutationType: 'updateBoardField',
});

export default {
  components: {
    snackbar,
  },
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
    }
  },
  methods: {
    ...mapActions(['editboard', 'getsnackbar']),
    submit: function() {
      let that = this
      if (this.$refs.form.validate()) {
        if (this.board.desc.issuesource == 'dep') {
          this.board.desc.title = '部會自提'
        }
        if (this.selectedboardid != '') {
          Trello.put('boards/' + this.board.id,{'name':this.board.name},function(res) {
            Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.board.desc)},function() {
              let snackbar = {
                state: true,
                color: 'success',
                text: '修改'
              }
              that.$store.dispatch('getsnackbar', snackbar)
              that.$store.dispatch('editboard','')
              that.$store.dispatch('getboards')
            })
          })
        }
        else {
          Trello.post('boards',{'name':this.board.name,'idOrganization':'5ad56d6d96cb269a7a2aaa0a','idBoardSource':'5c19e75bc6ac7935093c0ae6','prefs_permissionLevel':'public'},function(res) {
            Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.board.desc)},function(res) {
              let snackbar = {
                state: true,
                color: 'success',
                text: '新增'
              }
              that.$store.dispatch('getsnackbar', snackbar)
              that.$router.push('board/' + res.id)
            })
          })
        }
      }
    },
    resetForm: function() {
      this.$refs.form.reset()
      this.board.desc.issuesource = 'dep'
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
        /* this.resetForm() */
      }
    }
  },
  computed: {
    ...mapFields ({
      openboard: 'openboard',
      selectedboardid: 'selectedboardid',
      board: 'board',
    }),
    formIsValid () {
      return (
        this.board.name &&
        this.board.desc.title &&
        this.board.desc.person &&
        this.board.desc.date &&
        this.board.desc.department &&
        this.board.desc.codepartment &&
        this.board.desc.issuesource
      )
    }
  },
  watch: {
    openboard: function() {
      this.getstatus()
    }
  },
}
</script>

