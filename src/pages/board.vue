<template>
  <v-container grid-list-md>
    <toolbar></toolbar>
    <v-layout row>
      <v-flex xs12 md4 lg3 v-for="(list) in lists" :key="list.id" v-show="list.name != '利害關係人' && list.name != '佐證文件'">
        <!-- <v-toolbar dense flat text-ms-center :color="list.color" >
          <v-toolbar-title class="subheading">{{list.name}}</v-toolbar-title>
        </v-toolbar> -->
        <!-- <v-card :style="bindlistcolor(list.name)"> -->
        <v-card :style="titlestyle + list.color" class="elevation-5 subheading font-weight-medium" tile>
          <v-card-title>
            {{list.name}}
          </v-card-title>
        </v-card>
        <v-card class="elevation-5" tile v-show="list.name != '利害關係人' && list.name != '佐證文件'">
          <v-container fluid grid-list-xs align-center class="pa-2">
            <draggable ml-0 :id="list.id" :options="{group:'cards',animation:200}" @add="movecard" style="min-height:1em" >
              <!-- <v-card :color="card.color" :dark="card.hover" hover v-for="card in searchcards(list)" :key="card.id" class="mb-2" style="margin:0; width:100%" :id="card.id" @mouseup="editcard(card,list)" @mouseover="hover = true;changecolor(card,list)" @mouseout="hover = false;changecolor(card,list)"> -->
                <v-card :dark="card.hover" :color="card.color" hover v-for="card in searchcards(list)" :key="card.id" class="mb-2" style="margin:0; width:100%; background-color:#FBF0D3" :id="card.id" @mouseup="editcard(card,list)" @mouseover="hover = true; changecolor(card,list)" @mouseout="hover = false; changecolor(card,list)">
                  <v-card-title primary-title>
                    <div class="body-2">{{card.name}}</div>
                  </v-card-title> 
              </v-card>
            </draggable>
          </v-container>
          <v-card tile color="grey lighten-3">
          <!-- <v-card tile v-if="board.admin.includes(user.id) || board.members.includes(user.id)" color="grey lighten-3"> -->
            <v-btn flat text-md-left style="margin:0;width:100%" @click.native.stop="newcard(list)" > 
              <v-icon small>add</v-icon>新增卡片<v-spacer></v-spacer> 
            </v-btn>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
    <form-card></form-card>
    <v-dialog v-model="deleteCard" max-width="290">
      <v-card>
        <v-card-title class="headline">確定刪除?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="deleteCard=false; closecard(deletedID)">確定</v-btn>
          <v-btn color="black" flat="flat" @click.native="deleteCard=false" >取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <snackbar></snackbar>
    <v-snackbar
      :timeout="5000"
      top="top"
      v-model="attachsnackbar"
    >
      請先刪除附件再重新上傳!
      <v-btn flat color="pink" @click.native="attachsnackbar = false">關閉</v-btn>
    </v-snackbar>
    <v-dialog v-model="boardtitledialog" max-width="50vw">
      <v-card>
        <v-card-text>
          <v-form>
            <v-container>
              <v-layout>
                <v-flex>
                  <v-text-field color="grey darken-4" v-model="board.name"></v-text-field> 
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat class="subheading" @click="getboardinfo();boardtitledialog = false">取消</v-btn>
          <v-btn flat color="cyan" type="submit" class="subheading" @click="editboardtitle()">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="openstakeholders" max-width="50vw">
      <v-card>
        <v-card-title>
          <h2 style="border-bottom: 0.5vh solid #21B5C2">利害關係人</h2>
        </v-card-title>
        <v-card-text>
          <p>請選點利害關係人即可開始編輯該人物之相關資訊</p>
          <v-btn outline class="elevation-5" v-for="stakeholder in stakeholders " :key="stakeholder.id"  @click.native="editcard(stakeholder, stakeholderList)">{{stakeholder.name}}</v-btn>
          <v-btn flat color="primary" @click.native="newcard(stakeholderList)">+新增利害關係人</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat class="subheading" @click="openstakeholders = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="openevidences" max-width="50vw">
      <v-card>
        <v-card-title>
          <h2 style="border-bottom: 0.5vh solid #21B5C2">佐證文件</h2>
        </v-card-title>
        <v-card-text>
          <p>請選點Ｖ即可開始編輯該文件之相關資訊</p>
          <v-btn outline class="elevation-5" v-for="evidence in evidences " :key="evidence.id"  @click.native="editcard(evidence, evidenceList)">{{evidence.name}}</v-btn>
          <v-btn flat color="primary" @click.native="newcard(evidenceList)">+新增佐證文件</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat class="subheading" @click="openevidences = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';
import draggable from 'vuedraggable'
import UploadButton from 'vuetify-upload-button';
import card from '../components/forms/card'
import snackbar from '../components/snackbar'
import toolbar from '../components/toolbar'

const { mapFields: mapBoardFields } = createHelpers({
  getterType: 'getBoardField',
  mutationType: 'updateBoardField',
});

const { mapFields: mapCardFields } = createHelpers({
  getterType: 'getCardField',
  mutationType: 'updateCardField',
});

const { mapFields: mapListFields } = createHelpers({
  getterType: 'getListField',
  mutationType: 'updateListField',
});

export default {
  components: {
    draggable,
    'upload-btn': UploadButton,
    'form-card': card,
    snackbar,
    toolbar
  },
  data () {
    return {
      members: [],
      avatar: [],
      success: '',
      hover: false,
      relationmode: false,
      firstcard: {},
      tab: 'tab-1',
    }
  },
  methods: {
    ...mapActions(['getboardinfo', 'getlists', 'getsnackbar']),
    movecard: function(event) {
      fetch("http://localhost:8787/movecard/" + event.item.id + "/" + event.to.id, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getrelated: function(currentlist) {
      this.relatedlist = []
      this.lists.map(list => {
        if (currentlist.name == '問題面向') {
          if (list.name == '問題細節') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name,
                'desc': data.desc
              })
            })
          }
        } else if (currentlist.name == '問題細節') {
           if (list.name == '現有解法') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name,
                'desc': data.desc
              })
            })
          }
        } else if (currentlist.name == '現有解法') {
           if (list.name == '政府回應') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name,
                'desc': data.desc
              })
            })
          }
        } else if (currentlist.name == '政府回應') {
           if (list.name == '困難') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name,
                'desc': data.desc
              })
            })
          }
        }
      })
    },
    newcard: function (list) {
      this.opencard = true; 
      this.selectedlist.name = list.name;
      this.selectedlist.id = list.id;
      this.selectedlist.color = list.color
      this.selectedlist.cards = list.cards
      this.selectedlist.column = list.column
      this.editable = false
      /* this.resetForm() */
      if (this.selectedlist.name == '政府回應') {
        if (this.card.desc.responsetime == 'nowadays') {
          this.card.name = '[現在]'
        } else {
          this.card.name = '[未來]'
        }
      }
      this.getrelated(list)
    },
    editcard: function( card, list) {
      this.opencard = true
      this.selectedlist.name = list.name;
      this.selectedlist.id = list.id;
      this.selectedlist.color = list.color
      this.selectedlist.cards = list.cards
      this.selectedlist.column = list.column
      this.card.id = card.id
      this.card.name = card.name
      this.card.desc.responsetime = card.desc.responsetime
      this.card.desc.data = card.desc.data
      this.card.desc.related = card.desc.related
      this.card.desc.explain = card.desc.explain
      this.card.desc.role = card.desc.role
      this.card.desc.department = card.desc.department
      this.card.desc.background = card.desc.background
      this.card.desc.stakeholders = card.desc.stakeholders
      this.card.desc.evidences = card.desc.evidences
      this.card.desc.attachment = card.desc.attachment 
      this.card.desc.x = card.desc.x
      this.card.desc.y = card.desc.y
      this.card.attachments = card.attachments
      this.editable = true
      this.getrelated(list)
    },
    searchcards: function(list) {
      return list.cards.filter(card => {
        return card.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    closecard: function(id) {
      let that = this
      fetch("http://localhost:8787/closecard/" + id, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( () => {
      /* Trello.put('cards/' + id ,{'closed':true}, function(res) { */
        that.getlists(that.board.id)
        let snackbar = {
          state: true,
          color: 'success',
          text: '刪除'
        }
        that.opencard = false
        that.$store.dispatch('getsnackbar', snackbar)
      })
    },
    getavatar: function(){
      let that = this
      this.board.admin.map( a => {
        Trello.get('/members/' + a, (res) => {
          that.avatar.push(res.avatarUrl);
        })
      })
      this.board.members.map( a => {
        Trello.get('/members/' + a, (res) => {
          that.avatar.push(res.avatarUrl);
        })
      })
    },
    /* getmembers: function() {
      let that = this
      let id = this.$route.params.id
      let heremembers = []
      Trello.boards.get(id + '/members', function(e){
        for (let i of e) {
          heremembers.push(i.username);
          that.getavatar(i.username);
        }
      })
      this.members = heremembers
    },
    newmember: function() {
      let that = this      
      for (let this_email of this.email.replace(' ','').split(",")) {
        Trello.put('boards/' + this.board.id +'/members' ,{'email':this_email ,'type':'normal'},function(res) {
          let snackbar = {
            state: true,
            color: 'success',
            text: '新增'
          }
          that.$store.dispatch('getsnackbar', snackbar)
          that.$store.dispatch('getboardinfo', that.$route.params.id)
        })
      }
    }, */
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
          case '現有解法':
          return  'light-green darken-2'
          break
          case '政府回應':
          return  'deep-orange lighten-1'
          break
          case '困難':
          return  'red accent-1'
          break
          case '利害關係人':
          return  'cyan darken-2'
          break
          case '佐證文件':
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
            card.color = 'blue-grey darken-2'
            card.hover = true
            this.lists.map( l => {
              l.cards.map( c => {
                if (c.desc.peoplefrom != undefined) {
                  c.desc.peoplefrom.map( p => {
                    if (p == card.id) {
                      c.color ='blue-grey darken-2'
                      c.hover = true
                    }
                  })
                }
              })
            })
            this.lists.map( l => {
              l.cards.map( c => {
                if (c.desc.peopleto != undefined) {
                  c.desc.peopleto.map( p => {
                    if (p == card.id) {
                      c.color ='blue-grey darken-2'
                      c.hover = true
                    }
                  })
                }
              })
            })
          }
          else if (list.name == '佐證文件') {
            card.color = 'blue-grey darken-2'
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
            card.color = 'blue-grey darken-2'
            card.hover = true
            if (card.desc.peoplefrom != undefined) {
              for (let p of card.desc.peoplefrom) {
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
            if (card.desc.peopleto != undefined) {
              for (let p of card.desc.peopleto) {
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
            card.color = '#FBF0D3'
            card.hover = false
            this.lists.map( l => {
              l.cards.map( c => {
                if (c.desc.peoplefrom != undefined) {
                  c.desc.peoplefrom.map( p => {
                    if (p == card.id) {
                      c.color = '#FBF0D3'
                      c.hover = false
                    }
                  })
                }
                if (c.desc.peopleto != undefined) {
                  c.desc.peopleto.map( p => {
                    if (p == card.id) {
                      c.color = '#FBF0D3'
                      c.hover = false
                    }
                  })
                }
              })
            })
          }
          else if (list.name == '佐證文件') {
            card.color = '#FBF0D3'
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
            card.color = '#FBF0D3'
            card.hover = false
            if (card.desc.peopleto != undefined) {
              for (let p of card.desc.peopleto) {
                for (let l of this.lists) {
                  for (let c of l.cards) {
                    if (c.id == p) {
                      c.color = '#FBF0D3'
                      c.hover = false
                    }
                  }
                }
              }
            }
            if (card.desc.peoplefrom != undefined) {
              for (let p of card.desc.peoplefrom) {
                for (let l of this.lists) {
                  for (let c of l.cards) {
                    if (c.id == p) {
                      c.color = '#FBF0D3'
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
                      c.color = '#FBF0D3'
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
                      c.color = '#FBF0D3'
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
    /* getcards: function() {
      let that = this;
      let id = this.$route.params.id
      Trello.boards.get(id + '/cards',{'fields':'all'}, function(res) {
        that.cards = res
      })
    }, */
/*     addperson: function(card) {
      let that = this;
      this.lists.map( l => {
        if (l.name == '利害關係人') {
          Trello.post('cards', {'name': this.newperson.title, 'idList': l.id,'desc': JSON.stringify(this.newperson.desc) } , function(res) {
            that.newperson.title = ''
            that.getlists()
            let snackbar = {
              state: true,
              color: 'success',
              text: '新增'
            }
            card.desc.peoplefrom.push(res.id)
            that.$store.dispatch('getsnackbar', snackbar)
          })
        }
      })
    }, */
    endrelationmode: function() {
      this.relationmode = false
      this.firstcard = {}
      this.lists.map(l => {
        l.cards.map(c => {
          c.color = l.color
          c.hover = false
        })
      })
    },
   /*  getattachments: function() {
      this.lists.map( l => {
        l.cards.map( c => {
          c.attachments = []
          Trello.cards.get(c.id,{fields: 'attachments',attachments: true,},function(res) {
            if (res.attachments.length != 0) {
              res.attachments.map( a => {
                let attachment = {}
                attachment.name = a.name
                attachment.url = a.url
                c.attachments.push(attachment)
              })
            }                
          })
        })
      })
    }, */
    /* fileChanged: function(file) {
      let formData = new FormData();
      formData.append('key','fb8dab318e1888679f571104d8b36ac7')
      formData.append('token',localStorage.trello_token)
      formData.append("file", file)
      formData.append("name", this.newattachment.title);
      this.filename = file.name
      this.uploadfile = formData
    }, */
    /* onFileChange: function(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      let formData = new FormData();
      formData.append('key','fb8dab318e1888679f571104d8b36ac7')
      formData.append('token',localStorage.trello_token)
      formData.append("file", files[0])
      formData.append("name", this.card.name);
      this.filename = file.name
      this.uploadfile = formData
    },
    upload: function(card) {
      if (card.attachments == undefined) {
        let request = new XMLHttpRequest()
        request.responseType = "json"
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            window.location.reload(true)
          }
        }
        request.open("POST", 'https://api.trello.com/1/cards/' + card.id + '/attachments/')
        request.send(this.uploadfile)
      } else {
        this.attachsnackbar = true
      }
    }, */
/*     changeresponsetime: function(card) {
      card.name = card.name.replace('[現在]','').replace('[未來]','')
      if (card.desc.responsetime == 'nowadays') {
        this.responsestring = '[現在]'
      } else {
        this.responsestring = '[未來]'
      }
      card.name = this.responsestring + card.name
    }, */
    new_member: function(){
      this.newmemberdialog = true;  
      // this.show_new_member = add_member!this.show_new_member;
    },
    /* deleteattachment: function(card) {
      Trello.delete('cards/' + card.id + '/attachments/' + card.attachments.id, function() {
        window.location.reload(true);
      })
    },
    editboardtitle: function() {
      let that = this
      Trello.put('boards/' + this.board.id,{'name':this.board.name},function(res) {
        let snackbar = {
          state: true,
          color: 'success',
          text: '修改'
        }
        that.$store.dispatch('getsnackbar', snackbar)
        that.boardtitledialog = false
        that.$store.dispatch('getboardinfo', that.$route.params.id)
      })
    }, */
    /* bindtitlestyle: function(title) {
      if (title == '問題面向') {
        this.titlecolor = '#FFCD13'
      } else if (title == '問題細節') { 
        this.titlecolor = '#FFE276'
      } else if (title == '現有解法') { 
        this.titlecolor = '#91AD70'
      } else if (title == '政府回應') { 
        this.titlecolor = '#F08B8B'
      } else if (title == '困難') { 
        this.titlecolor = '#C85938'
      } else if (title == '利害關係人') { 
        this.titlecolor = '#21B5C2'
      } else if (title == '佐證文件') { 
        this.titlecolor = '#D8CAC4'
      } 
      return this.titlestyle + this.titlecolor
    }, */
    /* addattachment: function(card) {
      let that = this;
      this.lists.map( l => {
        if (l.name == '佐證文件') {
          Trello.post('cards', {'name': this.newattachment.title, 'idList': l.id,'desc': JSON.stringify(this.newattachment.desc)} , function(res) {
            if (that.newattachment.desc.attachment != '' && that.newattachment.desc.attachment != undefined) {
              Trello.post('cards/' + res.id + '/attachments', {'url': that.newattachment.desc.attachment, 'name': that.newattachment.title}, function() {
                that.newattachment.title = ''
                that.newattachment.desc.attachment = ''
                that.getlists(that.board.id)
                let snackbar = {
                  state: true,
                  color: 'success',
                  text: '新增'
                }
                card.desc.data.push(res.id)
                that.$store.dispatch('getsnackbar', snackbar)
              })
            } else {
              if (that.newattachment.attachments == undefined) {
                let request = new XMLHttpRequest()
                request.responseType = "json"
                request.onreadystatechange = function() {
                  if (request.readyState === 4) {
                    that.newattachment.title = ''
                    that.getlists(that.board.id)
                    let snackbar = {
                      state: true,
                      color: 'success',
                      text: '新增'
                    }
                    card.desc.data.push(res.id)
                    that.$store.dispatch('getsnackbar', snackbar)
                  }
                }
                request.open("POST", 'https://api.trello.com/1/cards/' +  res.id + '/attachments/')
                request.send(that.uploadfile)
              } else {
              }
            }
          })
        }
      })
    }, */
  },
  created: function() {
    this.$store.dispatch('getlists', this.$route.params.id)
    /* this.getcards() */
    /* this.getavatar() */
    /* this.getmembers() */
    /* this.getattachments() */
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
    ...mapBoardFields({
      board: 'board',
      openstakeholders: 'openstakeholders',
      openevidences: 'openevidences',
      boardtitledialog: 'boardtitledialog',
      search: 'search'
    }),
    ...mapCardFields({
      card: 'card',
      opencard: 'opencard',
      selectedlist: 'selectedlist',
      editable: 'editable',
      titlestyle: 'titlestyle',
      titlecolor: 'titlecolor',
      relatedlist: 'relatedlist',
      deleteCard: 'deleteCard',
      deletedID: 'deletedID',
      attachsnackbar: 'attachsnackbar',
    }),
    ...mapListFields({
      lists: 'lists',
      stakeholders: 'stakeholders',
      evidences: 'evidences',
      stakeholderList: 'stakeholderList',
      evidenceList: 'evidenceList',
    }),
  },
}
</script>

<style>

</style>
