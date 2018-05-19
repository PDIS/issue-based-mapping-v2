<template>
  <v-container grid-list-md>
    <v-layout row wrap v-if="admin == me">
            <v-flex xs11>
        <v-text-field color="grey darken-4" class="mt-3 mb-0" prepend-icon="people" label="新增議題成員" value="Input text" v-model="search"></v-text-field> 
            </v-flex><v-flex xs1>
         <v-btn>新增</v-btn>
       </v-flex>
    </v-layout>
     <v-layout row>
        <v-flex xs3 >
        <v-card flat style="background-color:#032E3D;"  class="mt-2 white--text">
          <!-- color="black " -->
              <v-card-text color="indigo darken-4">
                <div class="headline"># {{board.name}} </div>
              </v-card-text>
        </v-card>
        </v-flex>
        <v-flex xs3 offset-xs6>
        <v-text-field color="grey darken-4" class="mt-3 mb-0" prepend-icon="search" label="搜尋卡片關鍵字" value="Input text" v-model="search"></v-text-field>
        </v-flex>


      </v-layout>
     <v-layout row>
    <v-flex xs12 md4 lg3 v-for="(list) in lists" :key="list.id">
      <v-toolbar dense dark flat text-ms-center color="grey darken-3" >
          <v-toolbar-title class="subheading">{{list.name}}</v-toolbar-title>
      </v-toolbar>
  
      <v-card >
      <v-container
        fluid
        grid-list-lg
        align-center
        wrap
      >

        <draggable ml-0 :id="list.id" :options="{group:'cards',animation:200}" @add="movecard" style="min-height:1em" >
            <v-card :color="list.color" hover  v-for="card in searchcards(list)" :key="card.id" class="mb-2" style="margin:0; width:100%" :id="card.id" @mouseup="editcard(card,list)">
              <v-tooltip right>
              <v-card-title primary-title slot="activator">
                <div class="body-2">{{card.name}}</div>
              </v-card-title>
              <div v-for="desc in card.desc">
                <div v-if=" typeof(desc) != 'object' && desc != ''">
                  <span class="body-2">{{desc}}</span>
                </div>
              </div>
              </v-tooltip>
            </v-card>
        </draggable>
      </v-container>
    
      <v-footer >
        <v-btn text-md-left color="grey lighten-3" style="margin:0;width:100%" @click.native.stop="newcard(list)" > 
          <v-icon small>add</v-icon>新增卡片<v-spacer></v-spacer> </v-btn>
      </v-footer>


      </v-card>
    </v-flex>
  </v-layout>
  <v-dialog v-model="dialog"  max-width="50em">
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
            <v-container>
              <v-layout row wrap>
                <v-flex d-flex md6>
                  <v-card :color='selectedlist.color'>
                   <v-card-title primary-title>
                {{card.title}}
              </v-card-title>
                  </v-card>
                </v-flex>
                <v-flex d-flex md6>
                  <v-layout row wrap>
                    <v-flex d-flex xs12>
   <div>
                   
       <v-chip small color="pink lighten-1" text-color="white" v-for="person in card.desc.people" :key="person.id" >
                  {{person.name}}
                </v-chip>
   </div>
                    </v-flex>
                     <v-flex d-flex xs12>
           <div>
       <v-chip small color="pink lighten-1" text-color="white" v-for="data in card.desc.data" :key="data.id" >
                  {{data.name}}
                </v-chip>
           </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
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
                      <v-layout row wrap v-if="selectedlist.name == '困難'">
                     <v-flex d-flex xs12>
                   <v-text-field label="困難" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
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
                          v-model="card.desc.people"
                          :items="peoplelist"
                          item-text="name"
                          label="關聯利害關係人"
                          prepend-icon="people"
                          chips
                          tags
                          multiple
                        ><template slot="selection" slot-scope="data">
            <v-chip
              :selected="data.selected"
              :disabled="data.disabled"
              :key="JSON.stringify(data.item)"
              class="chip--select-multi"
              @input="data.parent.selectItem(data.item)"
              
            >
              {{ data.item.name }}
            </v-chip>
          </template></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                  <v-flex d-flex md12>
                  <v-layout row wrap v-if="selectedlist.name != '資料/文件/連結' && selectedlist.name != '利害關係人'">
                    <v-flex d-flex xs12 >
                        <v-select
                          v-model="card.desc.data"
                          :items="datalist"
                          label="佐證文件"
                          prepend-icon="picture_as_pdf"
                          chips
                          tags
                          item-text="name"
                          multiple
                        >
                        <template slot="selection" slot-scope="data">
            <v-chip
              :selected="data.selected"
              :disabled="data.disabled"
              :key="JSON.stringify(data.item)"
              class="chip--select-multi"
              @input="data.parent.selectItem(data.item)"
              
            >
              {{ data.item.name }}
            </v-chip>
          </template></v-select>
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
      board: {
        id: '',
        name: '',
        desc: {
          'title': '',
          'person': '',
          'date': null,
          'department': ''
        }
      },
      lists: [],
      cards: [],
      dialog: false,
      selectedlist: {},
      snackbar: false,
      valid: false,
      titleRules: [
        v => !!v || '此欄位為必填!',
        v => v.length <= 20 || '此欄位不可超過20個字!'
      ],
      /* items: [
        'Programming',
        'Design',
        'Vue',
        'Vuetify',
      ], */
      card: {
        id: '',
        title: '',
        desc:{
          explain:'',
          department: '',
          background: '',
          summary: '',
          induction: '',
          people: [],
          data: []
        }
      },
      peoplelist: [],
      datalist: [],
      fab: false,
      editable: false,
      search: '',
      admin:'',
      me:''
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
      //this.$refs.form.reset()
      this.card.desc.people = []
      this.card.desc.data = []
      this.card.title = ''
    },
    submit: function() {
      let that = this
      if (this.editable == false) 
      {
        Trello.post('cards', {'name': this.card.title, 'idList': this.selectedlist.id,'desc': JSON.stringify(this.card.desc) } , function() {
          window.location.reload(true);
        })
      }
      else {
        Trello.put('cards/' + this.card.id, {'name': this.card.title, 'idList': this.selectedlist.id,'desc': JSON.stringify(this.card.desc) } , function() {
          window.location.reload(true);
        })
      }
    },
    getpeople: function() {
      this.lists.map(list => {
        if (list.name == '利害關係人') {
          list.cards.map( card => {
            this.peoplelist.push(card)
          })
        }
      })
    },
    getdata: function() {
      this.lists.map(list => {
        if (list.name == '資料/文件/連結') {
           list.cards.map( data => {
            this.datalist.push(data)
          })
        }
      })
    },
    newcard: function (list) {
      this.dialog = true; 
      this.selectedlist.name = list.name;
      this.selectedlist.id = list.id;
      this.selectedlist.color = list.color
      this.editable = false
      this.resetForm()
    },
    editcard: function(card,list) {
      this.dialog = true
      this.selectedlist.name = list.name;
      this.selectedlist.id = list.id;
      this.selectedlist.color = list.color
      this.card.id = card.id
      this.card.title = card.name
      //this.card.desc = card.desc
      this.card.desc.people = card.desc.people
      this.card.desc.data = card.desc.data
      this.editable = true
    },
    searchcards: function(list) {
      return list.cards.filter(card => {
        return card.name.toLowerCase().includes(this.search.toLowerCase())
      })
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
    Trello.boards.get(this.board.id +'/memberships', function(res) {
      res.map( m => {
        if (m.memberType == 'admin') {
          that.admin = m.idMember
          console.log(that.admin)
        }
      })
    })
    Trello.members.get('me', function (res) {
      that.me = res.id
      console.log(that.me)
    })
    Trello.boards.get(this.board.id + '/lists',{cards: 'open'}, function(res) {
      res.map( l => {
        let list = {}
        list.id = l.id
        list.name = l.name
        list.cards = l.cards
        switch (list.name)
        {
          case '資料/文件/連結':
          list.color = 'blue lighten-4'
          break
          case '問題面向':
          list.color = 'yellow darken-1'
          break
          case '問題細節':
          list.color = 'yellow lighten-4'
          break
          case '解法':
          list.color = 'light-green accent-2'
          break
          case '回應':
          list.color = 'amber accent-4'
          break
          case '困難':
          list.color = 'pink lighten-2'
          break
          case '利害關係人':
          list.color = 'cyan accent-4'
          break
          default:
          list.color = 'teal'
          break
        }
        /* console.log(list) */
        list.cards.map(card => {
          if (card.desc != '') {
            let desc = JSON.parse(card.desc)
            card.desc = desc
          }
        })
        that.lists.push(list)
      })
      that.getpeople()
      that.getdata()
    })
    /* Trello.cards.get("Uta5z7Fr/attachments", function(res) {
      console.log(res)
    }) */
  },
}
</script>

<style>

</style>
