<template>
  <v-container grid-list-md>
     <v-layout row>
    <v-flex xs12 md4 lg3 v-for="(list) in lists" :key="list.id">
      <v-toolbar text-center>
          <v-toolbar-title class="subheading">{{list.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      <v-card>
          <v-container
        fluid
        grid-list-lg
      >

                       <draggable :id="list.id" v-model="list.cards" :options="{group:'cards',animation:200}" @add="movecard" style="min-height:1em" >

            <v-card :color="list.color" hover  v-for="card in list.cards" :key="card.id" class="ma-2" :id="card.id">
              <v-card-title primary-title>
                <div class="body-2">{{card.name}}</div>
              </v-card-title>
              <!-- <v-card-actions>
                <v-btn flat dark>Listen now</v-btn>
              </v-card-actions> -->
            </v-card>
  
                    </draggable>
          </v-container>
    
      <v-footer><v-btn color="black" dark style="margin:0;width:100%" class="subheading" @click.native.stop="dialog = true; selectedlist.name = list.name;selectedlist.id = list.id;selectedlist.color = list.color">新增卡片
              <v-icon dark right>add</v-icon>
            </v-btn></v-footer>


      </v-card>
    </v-flex>
  </v-layout>
  <v-dialog v-model="dialog" persistent max-width="50em">
        <v-card>
          <!-- <v-snackbar v-model="snackbar" absolute top right color="success">
            <span>新增成功!</span>
          <v-icon dark>check_circle</v-icon>
          </v-snackbar> -->
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
            <v-container fluid>
              <v-layout row wrap>
                <v-flex d-flex md6>
                  <v-card :color='selectedlist.color'>
                    <v-card-text>
                    {{card.title}}
                    </v-card-text>
                  </v-card>
                </v-flex>
                <!-- <v-flex d-flex md6>
                  <v-layout row wrap>
                    <v-flex d-flex xs12>
                      <v-card color="white">
                         <v-card-text>

                    </v-card-text>
                      </v-card>
                    </v-flex>
                     <v-flex d-flex xs12>
                      <v-card color="white">
                         <v-card-text>
     
                    </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-flex> -->
                <v-flex d-flex md12 class="mt-3">
                  <v-layout row wrap v-if="selectedlist.name =='問題面向'">
                    <v-flex d-flex xs12>
                   <v-text-field label="問題面向" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap v-if="selectedlist.name == '問題細節'">
                         <v-flex d-flex xs12>
                   <v-text-field label="問題細節" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                     <v-flex d-flex xs12>
                   <v-text-field label="補充說明" prepend-icon="people" v-model="card.desc.explain" ></v-text-field>
                    </v-flex>
                  </v-layout>
                      <v-layout row wrap  v-if="selectedlist.name == '解法'">
                         <v-flex d-flex xs12>
                   <v-text-field label="解法" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                      </v-layout>
                      <v-layout row wrap  v-if="selectedlist.name == '回應'">
                        <v-flex d-flex xs12>
                   <v-text-field label="回應" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                      <v-flex d-flex xs12>
                   <v-text-field label="補充說明" prepend-icon="people" v-model="card.desc.explain"  ></v-text-field>
                    </v-flex>
                        </v-layout>
                      <v-layout row wrap v-if="selectedlist.name == '困雖'">
                     <v-flex d-flex xs12>
                   <v-text-field label="困雖" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                      <v-flex d-flex xs12>
                   <v-text-field label="補充說明" prepend-icon="people" v-model="card.desc.explain"  ></v-text-field>
                    </v-flex>
                        </v-layout>
                      <v-layout row wrap v-if="selectedlist.name == '利害關係人'">
                      <v-flex d-flex xs12>
                   <v-text-field label="利害關係人" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                     <v-flex d-flex xs12>
                   <v-text-field label="單位" prepend-icon="announcement" v-model="card.desc.department" ></v-text-field>
                    </v-flex>
                     <v-flex d-flex xs12>
                   <v-text-field label="背景" prepend-icon="announcement" v-model="card.desc.background"  ></v-text-field>
                    </v-flex>
                        </v-layout>
                      <v-layout row wrap v-if="selectedlist.name == '資料/文件/連結'">
                      <v-flex d-flex xs12>
                   <v-text-field label="資料/文件/連結" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                      <v-flex d-flex xs12>
                   <v-text-field label="摘要" prepend-icon="people" v-model="card.desc.summary"></v-text-field>
                    </v-flex>
                    <v-flex d-flex xs12>
                   <v-text-field label="歸納" prepend-icon="people" v-model="card.desc.induction" ></v-text-field>
                    </v-flex>
                        </v-layout>
                
                </v-flex>

                <v-flex d-flex md12>
                  <v-layout row wrap v-if="selectedlist.name != '資料/文件/連結' && selectedlist.name != '利害關係人'">
                    <v-flex d-flex xs12 >
                        <v-select
                          v-model="select"
                          :items="items"
                          label="關聯利害關係人"
                          prepend-icon="people"
                          chips
                          tags
                        ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                  <v-flex d-flex md12>
                  <v-layout row wrap v-if="selectedlist.name != '資料/文件/連結' && selectedlist.name != '利害關係人'">
                    <v-flex d-flex xs12 >
                        <v-select
                          v-model="select"
                          :items="items"
                          label="佐證文件"
                          prepend-icon="picture_as_pdf"
                          chips
                          tags
                        ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
               <v-card-actions>
               <!--  <v-btn :disabled="!formIsValid" flat color="primary" type="submit" class="subheading">確認</v-btn> -->
               <v-btn flat color="primary" type="submit" class="subheading">確認</v-btn>
                <v-spacer></v-spacer>
        <v-btn flat class="subheading" @click="resetForm">清除</v-btn>
        <v-spacer></v-spacer>
         <v-btn flat @click.native="closeDialog" class="subheading">關閉</v-btn>
          </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import draggable from 'vuedraggable'
import newcard from './newcard'
export default {
  components: {
    draggable,
    newcard
  },
  data () {
    /* const defaultForm = Object.freeze({
      card: {
        title: '',
        desc: '',
        department: '',
        background: '',
        summary: '',
        induction: ''
      }
    }) */
    return {
      board: {},
      lists: [],
      cards: [],
      dialog: false,
      selectedlist: {},
      snackbar: false,
      valid:false,
      titleRules: [
        v => !!v || '此欄位為必填!',
        v => v.length <= 20 || '此欄位不可超過20個字!'
      ],
      select: [],
      items: [
        'Programming',
        'Design',
        'Vue',
        'Vuetify',
      ],
      card: {
        title: '',
        desc:{
          explain:'',
          department: '',
          background: '',
          summary: '',
          induction: ''
        }
      }
      /* form: Object.assign({}, defaultForm), */
    }
  },
  methods: {
    getcards: function(id) {
      let newcards = []
      for (let c of this.cards) {
        if (c.idList == id) {
          newcards.push(c)
        }
      }
      return newcards
    },
    movecard: function(event) {
      let that = this
      Trello.put('cards/' + event.item.id,{'idList':event.to.id},function(res) {
      })
    },
    closeDialog: function() {
      this.dialog = false
    },
    resetForm: function() {
      /* this.form = Object.assign({}, this.defaultForm) */
      this.$refs.form.reset()
    },
    submit: function() {
      let that = this
      Trello.post('cards', {'name': this.card.title, 'idList': this.selectedlist.id,'desc': JSON.stringify(this.card.desc) } , function() {
        window.location.reload(true);
      })
    },
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
      /* for (let i in res) {
        let list = {}
        list.id = res[i].id
        list.name = res[i].name
        list.cards = res[i].cards
        switch (list.name)
        {
          case '資料/文件/連結':
          list.color = 'blue accent-1'
          break
          case '問題面向':
          list.color = 'yellow lighten-1'
          break
          case '問題細節':
          list.color = 'yellow lighten-3'
          break
          case '解法':
          list.color = 'light green accent-3'
          break
          case '回應':
          list.color = 'orange'
          break
          case '困難':
          list.color = 'pink'
          break
          case '利害關係人':
          list.color = 'indigo'
          break
          default:
          list.color = 'teal'
          break
        }
        that.lists.push(list)
      } */
      res.map( l => {
        let list = {}
        list.id = l.id
        list.name = l.name
        list.cards = l.cards
        switch (list.name)
        {
          case '資料/文件/連結':
          list.color = 'blue accent-1'
          break
          case '問題面向':
          list.color = 'yellow lighten-1'
          break
          case '問題細節':
          list.color = 'yellow lighten-3'
          break
          case '解法':
          list.color = 'light green accent-3'
          break
          case '回應':
          list.color = 'orange'
          break
          case '困難':
          list.color = 'pink'
          break
          case '利害關係人':
          list.color = 'indigo'
          break
          default:
          list.color = 'teal'
          break
        }
        that.lists.push(list)
      })
    })
  },
}
</script>

<style>

</style>
