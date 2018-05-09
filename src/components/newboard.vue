<template>
<v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm6>
  <v-card>
     <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>新增成功!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
    <v-container>
                <v-text-field
                  label="看版名稱"
                  prepend-icon="assignment"
                  v-model="form.boardname"
                  :counter="20"
                  :rules="nameRules"
                ></v-text-field>

                <v-text-field
                  label="議題名稱"
                  prepend-icon="announcement"
                  v-model="form.desc.title"
                  :rules="requiredRules"
                ></v-text-field>
 
                <v-text-field
                  label="提案人"
                  prepend-icon="person"
                  v-model="form.desc.person"
                  :rules="requiredRules"
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
          v-model="form.desc.date"
          prepend-icon="event"
          :rules="requiredRules"
          readonly
        ></v-text-field>
        <v-date-picker v-model="form.desc.date" @input="$refs.date.save(date)"  locale="zh-tw"></v-date-picker>

      </v-menu>
          </v-container>
          <v-card-actions>
              <v-btn
          :disabled="!formIsValid"
          flat
          color="primary"
          type="submit"
        >確認</v-btn>
                <v-spacer></v-spacer>
        <v-btn flat @click="resetForm">清除</v-btn>
      </v-card-actions>
  </v-form>
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
      const defaultForm = Object.freeze({
        boardname:'',
         desc:{
          'title':'',
          'person':'',
          'date':null
          },
      })
      return {
        /* boardname:'',
        desc:{
          'title':'',
          'person':'',
          'date':null
          }, */
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
        form: Object.assign({}, defaultForm)
      }
    },
    methods: {
      submit: function() {
        let that = this
        Trello.post('boards',{'name':this.boardname,'idOrganization':'5ad56d6d96cb269a7a2aaa0a','idBoardSource':'5ab49c39f2917ad1cff1a3de','prefs_permissionLevel':'org','keepFromSource':'none'},function(res) {
          Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.desc)},function() {
            this.snackbar = true
            that.$router.push('/')
          })
        })
      },
      resetForm: function() {
        this.form = Object.assign({}, this.defaultForm)
        this.$refs.form.reset()
      },
    },
    computed: {
      formIsValid () {
        return (
          this.form.boardname &&
          this.form.desc.title &&
          this.form.desc.person &&
          this.form.desc.date
        )
      }
    },
  }
</script>

