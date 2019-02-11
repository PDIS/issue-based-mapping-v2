<template>
  <v-container grid-list-md>
    <v-layout row>
      <v-flex xs9>
        <v-card flat class="mt-2">
          <v-card-text>
            <div class="headline"># {{board.name}} 
              <v-btn color="primary" icon flat @click="boardtitledialog = true" v-if="board.admin.includes(user.id)">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn icon small fab disabled v-for="a in board.avatars" :key="a">
                <img :src="a+'/50.png'" style="border-radius:50%"/> 
              </v-btn>
              <v-icon  @click="new_member()" medium fab btn outline class=" dark ml-2" v-if="board.admin.includes(user.id)">person_add</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-text-field color="grey darken-4" class="mt-3 mb-0" prepend-icon="search" label="搜尋卡片關鍵字" value="Input text" v-model="search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex md6>
        <v-tabs v-model="tab" left>
          <v-tabs-slider color="indigo"></v-tabs-slider>
          <v-tab href="#tab-1" style="font-size: 1.2rem" :to="{name:'board', params:{id:board.id}}">
            議題分析表
          </v-tab>
          <v-tab href="#tab-2" style="font-size: 1.2rem" :to="{name:'mindmap', params:{id:board.id}}">
            心智圖
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex md6>
        <v-layout align-center justify-start row reverse fill-height class="mb-2">
          <!-- <v-btn @click="relationmode = true" v-if="relationmode == false">關聯卡片</v-btn>
          <v-btn color="blue-grey darken-2" dark @click="endrelationmode()" v-if="relationmode == true">關聯卡片</v-btn> -->
          <v-btn flat target="_blank" :href="board.desc.link">會議記錄連結</v-btn>
          <v-btn flat :to="{name:'printout', params:{id:board.id}}">輸出文件</v-btn>
          <v-btn flat @click.stop="opendictionary = !opendictionary">專有名詞字典</v-btn>
          <!-- <v-btn flat :to="{name:'mindmap', params:{id:board.id}}">{{ $t("Mind Mapping") }}</v-btn> -->
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md4 lg3 v-for="(list) in lists" :key="list.id">
        <!-- <v-toolbar dense flat text-ms-center :color="list.color" >
          <v-toolbar-title class="subheading">{{list.name}}</v-toolbar-title>
        </v-toolbar> -->
        <!-- <v-card :style="bindlistcolor(list.name)"> -->
        <v-card :style="titlestyle + list.color" class="elevation-5 subheading font-weight-medium" tile>
          <v-card-title>
            {{list.name}}
          </v-card-title>
        </v-card>
        <v-card class="elevation-5" tile>
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
          <v-card tile v-if="board.admin.includes(user.id) || board.members.includes(user.id)" color="grey lighten-3">
            <v-btn flat text-md-left style="margin:0;width:100%" @click.native.stop="newcard(list)" > 
              <v-icon small>add</v-icon>新增卡片<v-spacer></v-spacer> 
            </v-btn>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
    <form-card></form-card>
    <v-dialog v-model="deletedialog" max-width="290">
      <v-card>
        <v-card-title class="headline">確定刪除?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="deletedialog=false; closecard(card.id)">確定</v-btn>
          <v-btn color="black" flat="flat" @click.native="deletedialog=false" >取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-dialog v-model="newpersondialog" max-width="290">
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
    </v-dialog> -->
    <v-dialog v-model="newmemberdialog" max-width="50vw">
      <v-card>
        <v-card-title>
          新增議題成員
        </v-card-title>
        <v-card-text>
        <v-form>
        <v-container>
          <v-layout>
            <v-flex>
          <v-text-field  color="grey darken-4" class="mt-0 mb-0" label="email address or name" value="Input text" v-model="email"></v-text-field> 
          </v-flex>
          </v-layout>
        </v-container>
      </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat class="subheading" @click="newmemberdialog = false">取消</v-btn>
          <v-btn flat color="cyan" type="submit" class="subheading" @click="newmember()">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <snackbar></snackbar>
    <v-snackbar
      :timeout="5000"
      top="top"
      v-model="attsnackbar"
    >
      請先刪除附件再重新上傳!
      <v-btn flat color="pink" @click.native="attsnackbar = false">關閉</v-btn>
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
    <dictionary></dictionary>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';
import draggable from 'vuedraggable'
import UploadButton from 'vuetify-upload-button';
import card from './forms/card'
import dictionary from './dictionary'
import snackbar from './snackbar'

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

const { mapFields: mapDictionaryFields } = createHelpers({
  getterType: 'getDictionaryField',
  mutationType: 'updateDictionaryField',
});

export default {
  components: {
    draggable,
    'upload-btn': UploadButton,
    'form-card': card,
    dictionary,
    snackbar
  },
  data () {
    return {
      members: [],
      avatar: [],
      success: '',
      show_new_member: false,
      search: '',
      deletedialog: false,
      email: '',
      hover: false,
      relationmode: false,
      firstcard: {},
      newmemberdialog: false,
      attsnackbar: false,
      boardtitledialog: false,
      tab: 'tab-1',
    }
  },
  methods: {
    ...mapActions(['getboardinfo', 'getlists', 'getsnackbar']),
    movecard: function(event) {
      let that = this
      Trello.put('cards/' + event.item.id,{'idList':event.to.id},function(res) {
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
                'name': data.name
              })
            })
          }
        } else if (currentlist.name == '問題細節') {
           if (list.name == '現有解法') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name
              })
            })
          }
        } else if (currentlist.name == '現有解法') {
           if (list.name == '政府回應') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name
              })
            })
          }
        } else if (currentlist.name == '政府回應') {
           if (list.name == '困難') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name
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
          this.card.title = '[現在]'
        } else {
          this.card.title = '[未來]'
        }
      }
    },
    editcard: function(card,list) {
      this.opencard = true
      if (this.relationmode == false) {
        /* if (this.board.admin.includes(this.user.id) || this.board.members.includes(this.user.id)) { */
          this.selectedlist.name = list.name;
          this.selectedlist.id = list.id;
          this.selectedlist.color = list.color
          this.selectedlist.cards = list.cards
          this.selectedlist.column = list.column
          this.card.id = card.id
          this.card.title = card.name
          this.card.desc.responsetime = card.desc.responsetime
          this.card.desc.data = card.desc.data
          this.card.desc.related = card.desc.related
          this.card.desc.explain = card.desc.explain
          this.card.desc.role = card.desc.role
          this.card.desc.department = card.desc.department
          this.card.desc.background = card.desc.background
          this.card.desc.attachment = card.desc.attachment 
          this.card.desc.x = card.desc.x
          this.card.desc.y = card.desc.y
          this.card.attachments = card.attachments
          this.editable = true
          this.getrelated(list)
        /* } */
      }
      else {
        /* if (Object.keys(this.firstcard).length == 0) {
          this.lists.map(l => {
            l.cards.map(c => {
              if (c.column == 1) {
                if (c.id != card.id && l.column != list.column + 1 && l.column != list.column) {
                  c.color = 'black'
                }
              } else {
                if (c.id != card.id && l.column != list.column + 1) {
                  c.color = 'black'
                }
              }
            })
          })
          this.firstcard = card
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
        else {
          let that = this
          if (this.firstcard.column == 1) {
            if (this.firstcard.column + 1 == list.column || this.firstcard.column == list.column ) {
              if (!this.firstcard.desc.related.includes(card.id)) {
                this.firstcard.desc.related.push(card.id)
                Trello.put('cards/' + this.firstcard.id, {'desc': JSON.stringify(this.firstcard.desc) } , function() {
                  card.color = 'blue-grey darken-2'
                  card.hover = true
                })
              } else {
                let index = this.firstcard.desc.related.indexOf(card.id);
                if (index !== -1) this.firstcard.desc.related.splice(index, 1);
                Trello.put('cards/' + this.firstcard.id, {'desc': JSON.stringify(this.firstcard.desc) } , function() {
                  card.color = list.color
                  card.hover = false
                })
              }
            } 
          } else {
            if (this.firstcard.column + 1 == list.column) {
              if (!this.firstcard.desc.related.includes(card.id)) {
                this.firstcard.desc.related.push(card.id)
                Trello.put('cards/' + this.firstcard.id, {'desc': JSON.stringify(this.firstcard.desc) } , function() {
                  card.color = 'blue-grey darken-2'
                  card.hover = true
                })
              } else {
                let index = this.firstcard.desc.related.indexOf(card.id);
                if (index !== -1) this.firstcard.desc.related.splice(index, 1);
                Trello.put('cards/' + this.firstcard.id, {'desc': JSON.stringify(this.firstcard.desc) } , function() {
                  card.color = list.color
                  card.hover = false
                })
              }
            } 
          }
        } */
      }
    },
    searchcards: function(list) {
      return list.cards.filter(card => {
        return card.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    closecard: function(id) {
      let that = this
      Trello.put('cards/' + id ,{'closed':true}, function(res) {
        that.getlists(that.board.id)
        let snackbar = {
          state: true,
          color: 'success',
          text: '刪除'
        }
        that.closeDialog()
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
    getmembers: function() {
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
      for (let this_email of this.email.split(", ")) {
        Trello.put('boards/' + this.board.id +'/members' ,{'email':this_email ,'type':'normal'},function(res) {
          window.location.reload(true);
        })
      }
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
    getcards: function() {
      let that = this;
      let id = this.$route.params.id
      Trello.boards.get(id + '/cards',{'fields':'all'}, function(res) {
        that.cards = res
      })
    },
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
    getattachments: function() {
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
    },
    fileChanged: function(file) {
      let formData = new FormData();
      formData.append('key','fb8dab318e1888679f571104d8b36ac7')
      formData.append('token',localStorage.trello_token)
      formData.append("file", file)
      formData.append("name", this.newattachment.title);
      this.filename = file.name
      this.uploadfile = formData
    },
    onFileChange: function(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      let formData = new FormData();
      formData.append('key','fb8dab318e1888679f571104d8b36ac7')
      formData.append('token',localStorage.trello_token)
      formData.append("file", files[0])
      formData.append("name", this.card.title);
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
        this.attsnackbar = true
      }
    },
/*     changeresponsetime: function(card) {
      card.title = card.title.replace('[現在]','').replace('[未來]','')
      if (card.desc.responsetime == 'nowadays') {
        this.responsestring = '[現在]'
      } else {
        this.responsestring = '[未來]'
      }
      card.title = this.responsestring + card.title
    }, */
    new_member: function(){
      this.newmemberdialog = true;  
      // this.show_new_member = add_member!this.show_new_member;
    },
    deleteattachment: function(card) {
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
    },
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
    addattachment: function(card) {
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
                /* this.attsnackbar = true */
              }
            }
          })
        }
      })
    },
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
    }),
    ...mapCardFields({
      card: 'card',
      opencard: 'opencard',
      selectedlist: 'selectedlist',
      editable: 'editable',
      titlestyle: 'titlestyle',
      titlecolor: 'titlecolor',
      relatedlist: 'relatedlist'
    }),
    ...mapListFields({
      lists: 'lists',
    }),
    ...mapDictionaryFields({
      opendictionary: 'opendictionary',
    })
  }
}
</script>

<style>

</style>
