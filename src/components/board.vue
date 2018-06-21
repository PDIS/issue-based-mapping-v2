<template>
  <v-container grid-list-md>
    <v-layout row wrap v-if="board.admin.includes(me)">
      <v-flex xs11>
        <v-text-field color="grey darken-4" class="mt-3 mb-0" prepend-icon="people" label="新增議題成員" value="Input text" v-model="email"></v-text-field> 
      </v-flex>
      <v-flex xs1>
         <v-btn top color="info" @click="newmember()">新增</v-btn>
       </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs3 >
        <v-card flat class="mt-2">
          <v-card-text>
            <div class="headline"># {{board.name}} </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-btn :to="{name:'mindmap', params:{id:board.id}}">心智圖</v-btn>
        <v-btn @click="relationmode = true" v-if="relationmode == false">關聯卡片</v-btn>
        <v-btn @click="endrelationmode()" v-if="relationmode == true">結束關聯卡片</v-btn>
      </v-flex>
      <v-flex xs3>
        <v-text-field color="grey darken-4" class="mt-3 mb-0" prepend-icon="search" label="搜尋卡片關鍵字" value="Input text" v-model="search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md4 lg3 v-for="(list) in lists" :key="list.id">
        <v-toolbar dense dark flat text-ms-center color="blue-grey darken-4" >
          <v-toolbar-title class="subheading">{{list.name}}</v-toolbar-title>
        </v-toolbar>
        <v-card >
          <v-container fluid grid-list-lg align-center wrap>
            <draggable ml-0 :id="list.id" :options="{group:'cards',animation:200}" @add="movecard" style="min-height:1em" >
              <v-card :color="card.color" :dark="card.hover" hover v-for="card in searchcards(list)" :key="card.id" class="mb-2" style="margin:0; width:100%" :id="card.id" @mouseup="editcard(card,list)" @mouseover="hover = true;changecolor(card,list)" @mouseout="hover = false;changecolor(card,list)">
                <v-card-title primary-title>
                  <div class="body-2">{{card.name}}</div>
                </v-card-title> 
              </v-card>
            </draggable>
          </v-container>
          <v-footer v-if="board.admin.includes(me) || board.members.includes(me)">
            <v-btn text-md-left color="grey lighten-3" style="margin:0;width:100%" @click.native.stop="newcard(list)" > 
              <v-icon small>add</v-icon>新增卡片<v-spacer></v-spacer> 
            </v-btn>
          </v-footer>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog"  max-width="50em">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
          <v-container>
            <v-layout row wrap class="ma-5">
              <v-flex d-flex md6>
                <v-card :color='selectedlist.color'>
                  <v-card-title primary-title>
                    {{card.title}}
                  </v-card-title>
                </v-card>
              </v-flex>
              <v-flex d-flex md6>
                <v-layout row wrap>
                 <!--  <v-flex d-flex xs12>
                    <div>
                      <v-chip small color="pink lighten-1" text-color="white" v-for="person in card.desc.people" :key="person.id" >
                      </v-chip>
                    </div>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <div>
                      <v-chip small color="pink lighten-1" text-color="white" v-for="data in card.desc.data" :key="data.id" >
                      </v-chip>
                    </div>
                  </v-flex> -->
                </v-layout >
              </v-flex>
              <v-flex d-flex md12 class="pt-5">
                <v-layout row wrap v-if="selectedlist.name =='問題面向'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="問題面向" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '問題細節'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="問題細節" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="補充說明" prepend-icon="people" v-model="card.desc.explain" ></v-text-field>
                  </v-flex>
                </v-layout >
                <v-layout row wrap  v-if="selectedlist.name == '解法'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="解法" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap  v-if="selectedlist.name == '回應'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="回應" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="補充說明" prepend-icon="people" v-model="card.desc.explain"  ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '困難'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="困難" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="補充說明" prepend-icon="people" v-model="card.desc.explain"  ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '利害關係人'">
                  <v-flex d-flex xs12>
                    <v-text-field  color="blue-grey darken-2" label="利害關係人" prepend-icon="person" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="單位" prepend-icon="work" v-model="card.desc.department" ></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="背景" prepend-icon="folder" v-model="card.desc.background"  ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '資料/文件/連結'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="資料/文件/連結" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="關聯利害關係人" prepend-icon="people" v-model="card.desc.summary"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="歸納" prepend-icon="people" v-model="card.desc.induction" ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-divider></v-divider>
              <v-flex d-flex md12>
                <v-layout row wrap v-if="selectedlist.name != '資料/文件/連結' && selectedlist.name != '利害關係人'">
                  <v-flex d-flex xs12 >
                    <v-select
                      v-model="card.desc.people"
                      :items="peoplelist"
                      item-text="name"
                      item-value="id"
                      prepend-icon="people"
                      label="關聯利害關係人"                     
                      chips
                      multiple
                      autocomplete
                      deletable-chips
                    >
                      <template slot="item" slot-scope="data">
                        <template v-if="typeof data.item !== 'object'">                   
                        </template>
                        <template v-else>
                          <v-list-tile-avatar class="mt-4">
                            <v-checkbox v-model="card.desc.people" :value="data.item.id"></v-checkbox>
                          </v-list-tile-avatar>
                          <v-list-tile-content v-text="data.item.name"></v-list-tile-content> 
                        </template>
                      </template>                                        
                    </v-select>
                    <!-- <v-select
                      v-model="card.desc.people"
                      :items="peoplelist"
                      item-text="name"
                      label="關聯利害關係人"
                      prepend-icon="people"
                      color="blue-grey darken-2" 
                      chips
                      tags
                      multiple
                    >
                      <template slot="selection" slot-scope="data">
                        <v-chip
                          :selected="data.selected"
                          :key="JSON.stringify(data.item)"
                          class="chip--select-multi"
                          @input="data.parent.selectItem(data.item)"
                          close
                        >
                          {{ data.item.name }}
                        </v-chip>
                      </template>
                    </v-select> -->
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex md12>
                <v-layout row wrap v-if="selectedlist.name != '資料/文件/連結' && selectedlist.name != '利害關係人'">
                  <v-flex d-flex xs12 >
                    <v-select
                      v-model="card.desc.data"
                      :items="datalist"
                      item-text="name"
                      item-value="id"
                      prepend-icon="picture_as_pdf"
                      label="佐證文件"
                      color="blue-grey darken-2"
                      chips
                      multiple
                      autocomplete
                      deletable-chips
                    >
                      <template slot="item" slot-scope="data">
                        <v-list-tile-avatar class="mt-4">
                          <v-checkbox v-model="card.desc.data" :value="data.item.id"></v-checkbox>
                        </v-list-tile-avatar>
                        <v-list-tile-content v-text="data.item.name"></v-list-tile-content>
                      </template>
                    </v-select>
                    <!-- <v-select
                      v-model="card.desc.data"
                      :items="datalist"
                      label="佐證文件"
                      prepend-icon="picture_as_pdf"
                      color="blue-grey darken-2" 
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
                      </template>
                    </v-select> -->
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex md12>
                <v-layout row wrap v-if="selectedlist.name != '資料/文件/連結' && selectedlist.name != '利害關係人'">
                  <v-flex d-flex xs6>
                    <v-btn color="blue-grey" class="white--text" @click.native="newpersondialog=true">
                      <v-icon small>add</v-icon>
                      新增利害關係人
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-card-actions class="pa-3">
              <!--  <v-btn :disabled="!formIsValid" flat color="primary" type="submit" class="subheading">確認</v-btn> -->
              <v-btn flat color="red lighten-1" class="subheading"  @click.native.stop="deletedialog=true;selectedid=card.id">刪除便利貼</v-btn>
              <v-btn flat color="grey lighten-1" class="subheading" @click="resetForm">重新填寫</v-btn>
              <v-spacer></v-spacer>
              <v-btn flat @click.native="closeDialog" class="subheading">取消</v-btn>
              <v-btn flat color="cyan" type="submit" class="subheading">確認</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deletedialog" max-width="290">
      <v-card>
        <v-card-title class="headline">確定刪除?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="deletedialog=false; cloasecard(card.id)">確定</v-btn>
          <v-btn color="black" flat="flat" @click.native="deletedialog=false" >取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="newpersondialog" max-width="290">
      <v-card>
        <v-card-title class="headline">新增利害關係人</v-card-title>
        <v-form>
          <v-container>
            <v-layout>
              <v-flex>
                <v-text-field color="blue-grey darken-2" label="姓名" prepend-icon="people" v-model="newperson" ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="newpersondialog=false;addperson()">確定</v-btn>
          <v-btn color="black" flat="flat" @click.native="newpersondialog=false;newperson=''" >取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :timeout="5000"
      top="top"
      v-model="snackbar"
    >
      新增成功!
      <v-btn flat color="pink" @click.native="snackbar = false">關閉</v-btn>
    </v-snackbar>
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
    return {
      board: {
        id: '',
        name: '',
        desc: {
          'title': '',
          'person': '',
          'date': null,
          'department': ''
        },
        admin: [],
        members: []
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
          data: [],
          related: []
        }
      },
      peoplelist: [],
      datalist: [],
      fab: false,
      editable: false,
      search: '',
      admin: [],
      me: '',
      deletedialog: false,
      email: '',
      hover: false,
      newpersondialog: false,
      newperson: '',
      newpersondesc: {
        explain:'',
        department: '',
        background: '',
        summary: '',
        induction: '',
        people: [],
        data: [],
        related: []
      },
      relationmode: false,
      firstcard: {},
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
      this.card.title = ''
      this.card.desc.explain = ''
      this.card.desc.department= ''
      this.card.desc.background= ''
      this.card.desc.summary= ''
      this.card.desc.induction= ''
      this.card.desc.people = []
      this.card.desc.data = []
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
          list.cards.map( people => {
            this.peoplelist.push({
              'id': people.id,
              'name': people.name
            })
          })
        }
      })
      /* this.peoplelist.push('新增利害關係人') */
    },
    getdata: function() {
      this.lists.map(list => {
        if (list.name == '資料/文件/連結') {
          list.cards.map( data => {
            this.datalist.push({
              'id': data.id,
              'name': data.name
            })
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
      if (this.relationmode == false) {
        if (this.board.admin.includes(this.me) || this.board.members.includes(this.me)) {
          this.dialog = true
          this.selectedlist.name = list.name;
          this.selectedlist.id = list.id;
          this.selectedlist.color = list.color
          this.card.id = card.id
          this.card.title = card.name
          //this.card.desc = card.desc
          this.card.desc.people = card.desc.people
          this.card.desc.data = card.desc.data
          this.card.desc.related = card.desc.related
          this.card.desc.explain = card.desc.explain
          this.editable = true
        }
      }
      else {
        if (Object.keys(this.firstcard).length == 0) {
          this.lists.map(l => {
            l.cards.map(c => {
              if (c.id != card.id && l.column != list.column + 1) {
                c.color = 'black'
              }
            })
          })
          this.firstcard = card
        }
        else {
          let that = this
          if (this.firstcard.column + 1 == list.column) {
            if (!this.firstcard.desc.related.includes(card.id)) {
              this.firstcard.desc.related.push(card.id)
              Trello.put('cards/' + this.firstcard.id, {'desc': JSON.stringify(this.firstcard.desc) } , function() {
              })
            }
          }
        }
      }
    },
    searchcards: function(list) {
      return list.cards.filter(card => {
        return card.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    cloasecard: function(id) {
      let that = this
      Trello.put('cards/' + id ,{'closed':true},function(res) {
        window.location.reload(true);
      })
    },
    getboard: function() {
      let that = this;
      this.board.id = this.$route.params.id
      Trello.boards.get(this.board.id,{'fields':'all'}, function(res) {
        that.board.name = res.name
        if (res.desc != '') {
          that.board.desc = JSON.parse(res.desc)
        }
        that.board.admin = []
        that.board.members = []
        res.memberships.map( m => {
          if (m.memberType == 'admin') {
            that.board.admin.push(m.idMember)
          }
          else {
            that.board.members.push(m.idMember)
          }
        })
      })
    },
   /*  getadmin: function() {
      let that = this;
      Trello.boards.get(this.board.id +'/memberships', function(res) {
        res.map( m => {
          if (m.memberType == 'admin') {
            that.admin.push(m.idMember)
          }
        })
      })
    }, */
    getme: function() {
      let that = this;
      Trello.members.get('me', function (res) {
        that.me = res.id
      })
    },
    getlists: function() {
      let that = this;
      this.lists = []
      Trello.boards.get(this.board.id + '/lists',{cards: 'open'}, function(res) {
        res.map( l => {
          let list = {}
          list.id = l.id
          list.name = l.name
          list.cards = l.cards
          switch (list.name)
          {
            case '問題面向':
            list.color = 'yellow darken-2'
            list.column = 1
            break
            case '問題細節':
            list.color = 'amber lighten-3'
            list.column = 2
            break
            case '解法':
            list.color = 'light-green darken-2'
            list.column = 3
            break
            case '回應':
            list.color = 'deep-orange lighten-1'
            list.column = 4
            break
            case '困難':
            list.color = 'red accent-1'
            list.column = 5
            break
            case '利害關係人':
            list.color = 'cyan darken-2'
            break
            case '資料/文件/連結':
            list.color = 'blue-grey lighten-4'
            break
            default:
            list.color = 'teal'
            break
          }
          list.cards.map(card => {
            if (card.desc != '') {
              let desc = JSON.parse(card.desc)
              card.desc = desc
            }
            card.color = list.color
            card.column = list.column
            card.hover = false
          })
          that.lists.push(list)
        })
        that.getpeople()
        that.getdata()
      })
    },
    newmember: function() {
      Trello.put('boards/' + this.board.id +'/members' ,{'email':this.email ,'type':'normal'},function(res) {
        window.location.reload(true);
      })
    },
    getcolor: function() {
      if (this.hover == true) {
        return 'black'
      }
      else {
        switch (list.name)
        {
          case '問題面向':
          return 'yellow darken-2'
          break
          case '問題細節':
          return  'amber lighten-3'
          break
          case '解法':
          return  'light-green darken-2'
          break
          case '回應':
          return  'deep-orange lighten-1'
          break
          case '困難':
          return  'red accent-1'
          break
          case '利害關係人':
          return  'cyan darken-2'
          break
          case '資料/文件/連結':
          return  'blue-grey lighten-4'
          break
          default:
          return  'teal'
          break
        }
      }
    },
    changecolor: function(card,list) {
      if (this.relationmode == false) {
        if (this.hover == true) {
          if (list.name == '利害關係人') {
            card.color = 'black'
            card.hover = true
            this.lists.map( l => {
              l.cards.map( c => {
                if (c.desc.people != undefined) {
                  c.desc.people.map( p => {
                    if (p == card.id) {
                      c.color ='blue-grey darken-2'
                      c.hover = true
                    }
                  })
                }
              })
            })
          }
          else if (list.name == '資料/文件/連結') {
            card.color = 'black'
            card.hover = true
            this.lists.map( l => {
              l.cards.map( c => {
                if (c.desc.data != undefined) {
                  c.desc.data.map( p => {
                    if (p == card.id) {
                      c.color ='blue-grey darken-2'
                      c.hover = true
                    }
                  })
                }
              })
            })
          }
          else {
            card.color = 'black'
            card.hover = true
            if (card.desc.people != undefined) {
              for (let p of card.desc.people) {
                for (let l of this.lists) {
                  for (let c of l.cards) {
                    if (c.id == p) {
                      c.color = 'blue-grey darken-2'
                      c.hover = true
                    }
                  }
                }
              }
            }
            if (card.desc.data != undefined) {
              for (let p of card.desc.data) {
                for (let l of this.lists) {
                  for (let c of l.cards) {
                    if (c.id == p) {
                      c.color = 'blue-grey darken-2'
                      c.hover = true
                    }
                  }
                }
              }
            }
            if (card.desc.related != undefined) {
              card.desc.related.map( r => {
                this.lists.map(l => {
                  l.cards.map( c => {
                    if (c.id == r) {
                      c.color = 'blue-grey darken-2'
                      c.hover = true
                    }
                  })
                })
              })
            }
          }
        }
        else {
          if (list.name == '利害關係人') {
            card.color = list.color
            card.hover = false
            this.lists.map( l => {
              l.cards.map( c => {
                if (c.desc.people != undefined) {
                  c.desc.people.map( p => {
                    if (p == card.id) {
                      c.color = l.color
                      c.hover = false
                    }
                  })
                }
              })
            })
          }
          else if (list.name == '資料/文件/連結') {
            card.color = list.color
            card.hover = false
            this.lists.map( l => {
              l.cards.map( c => {
                if (c.desc.data != undefined) {
                  c.desc.data.map( p => {
                    if (p == card.id) {
                      c.color = l.color
                      c.hover = false
                    }
                  })
                }
              })
            })
          }
          else {
            card.color = list.color
            card.hover = false
            if (card.desc.people != undefined) {
              for (let p of card.desc.people) {
                for (let l of this.lists) {
                  for (let c of l.cards) {
                    if (c.id == p) {
                      c.color = l.color
                      c.hover = false
                    }
                  }
                }
              }
            }
            if (card.desc.data != undefined) {
              for (let p of card.desc.data) {
                for (let l of this.lists) {
                  for (let c of l.cards) {
                    if (c.id == p) {
                      c.color = l.color
                      c.hover = false
                    }
                  }
                }
              }
            }
            if (card.desc.related != undefined) {
              card.desc.related.map( r => {
                this.lists.map(l => {
                  l.cards.map(c => {
                    if (c.id == r) {
                      c.color = l.color
                      c.hover = false
                    }
                  })
                })
              })
            }
          }
        }
      }
    },
    getcards: function() {
      let that = this;
      this.board.id = this.$route.params.id
      Trello.boards.get(this.board.id + '/cards',{'fields':'all'}, function(res) {
        that.cards = res
      })
    },
    addperson: function() {
      let that = this;
      this.lists.map( l => {
        if (l.name == '利害關係人') {
          Trello.post('cards', {'name': this.newperson, 'idList': l.id,'desc': JSON.stringify(this.newpersondesc) } , function() {
            that.newperson = ''
            that.getlists()
            that.snackbar = true
          })
        }
      })
    },
    endrelationmode: function() {
      this.relationmode = false
      this.firstcard = {}
      this.lists.map(l => {
        l.cards.map(c => {
          c.color = l.color
        })
      })
    }
  },
  created: function() {
    this.getboard()
    /* this.getadmin() */
    this.getme()
    this.getlists()
    this.getcards()
    /* Trello.cards.get("Uta5z7Fr/attachments", function(res) {
      console.log(res)
    }) */
  },
}
</script>

<style>

</style>
