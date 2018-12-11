<template>
  <v-container grid-list-md>
    <v-layout row wrap v-if="board.admin.includes(user.id)">
      <v-btn icon small fab btn disabled v-for="a in avatar" :key="a">
          <img :src="a+'/50.png'" style="border-radius:50%"/> 
      </v-btn>
      <v-icon  @click="new_member()" medium fab btn outline class=" dark ml-2">person_add</v-icon>
          <v-flex xs5 v-if="show_new_member">
            <v-text-field  color="grey darken-4" class="mt-0 mb-0" label="新增議題成員" value="Input text" v-model="email"></v-text-field> 
          </v-flex>
          <v-flex xs3 v-if="show_new_member">
            <v-btn top color="info" @click="newmember()">新增</v-btn>
          </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs3 >
        <v-card flat class="mt-2">
          <v-card-text>
            <div class="headline"># {{board.name}} 
              <v-btn color="primary" icon flat @click="boardtitledialog = true" v-if="board.admin.includes(user.id)">
                <v-icon>edit</v-icon>
              </v-btn> 
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs6 class="mt-3">
        <v-btn :to="{name:'mindmap', params:{id:board.id}}">{{ $t("Mind Mapping") }}</v-btn>
        <v-btn @click="relationmode = true" v-if="relationmode == false">關聯卡片</v-btn>
        <v-btn color="blue-grey darken-2" dark @click="endrelationmode()" v-if="relationmode == true">關聯卡片</v-btn>
        <v-btn target="_blank" :href="board.desc.link">會議記錄連結</v-btn>
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
              <!-- <v-card :color="card.color" :dark="card.hover" hover v-for="card in searchcards(list)" :key="card.id" class="mb-2" style="margin:0; width:100%" :id="card.id" @mouseup="editcard(card,list)" @mouseover="hover = true;changecolor(card,list)" @mouseout="hover = false;changecolor(card,list)"> -->
                <v-card :color="card.color" :dark="card.hover" hover v-for="card in searchcards(list)" :key="card.id" class="mb-2" style="margin:0; width:100%" :id="card.id" @mouseup="editcard(card,list)">
                <v-card-title primary-title>
                  <div class="body-2">{{card.name}}</div>
                </v-card-title> 
              </v-card>
            </draggable>
          </v-container>
          <v-footer v-if="board.admin.includes(user.id) || board.members.includes(user.id)">
            <v-btn text-md-left color="grey lighten-3" style="margin:0;width:100%" @click.native.stop="newcard(list)" > 
              <v-icon small>add</v-icon>新增卡片<v-spacer></v-spacer> 
            </v-btn>
          </v-footer>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" max-width="50em">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
          <v-container>
            <v-layout row wrap class="ma-3">
              <v-flex d-flex md12 class="pt-5">
                <v-layout row wrap v-if="selectedlist.name =='問題面向'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="問題面向" prepend-icon="announcement" v-model="card.title" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '問題細節'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="問題細節" prepend-icon="announcement" v-model="card.title" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="補充說明" prepend-icon="people" v-model="card.desc.explain" ></v-text-field>
                  </v-flex>
                </v-layout >
                <v-layout row wrap  v-if="selectedlist.name == '解法'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="解法" prepend-icon="announcement" v-model="card.title" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap  v-if="selectedlist.name == '回應'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="回應" prepend-icon="announcement" v-model="card.title" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-radio-group prepend-icon="schedule" v-model="card.desc.responsetime" row @change="changeresponsetime(card)">
                      <v-radio label="現在" value="nowadays" selected ></v-radio>
                      <v-radio label="未來" color="orange" value="future"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="補充說明" prepend-icon="people" v-model="card.desc.explain"  ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '困難'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="困難" prepend-icon="announcement" v-model="card.title" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="補充說明" prepend-icon="people" v-model="card.desc.explain"  ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '利害關係人'">
                  <v-flex d-flex xs12>
                    <v-text-field  color="blue-grey darken-2" label="利害關係人" prepend-icon="person" v-model="card.title" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="單位" prepend-icon="work" v-model="card.desc.department" ></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="背景" prepend-icon="folder" v-model="card.desc.background"  ></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="角色（此人與議題的關聯）" prepend-icon="folder" v-model="card.desc.role"  ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '資料/文件/連結'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="資料/文件/連結" prepend-icon="announcement" v-model="card.title" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="文件連結" prepend-icon="announcement" v-model="card.desc.attachment"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-divider></v-divider>
              <v-flex d-flex md12>
                <v-layout row wrap v-if="selectedlist.name != '利害關係人'">
                  <v-flex d-flex xs12 >
                    <v-select
                      v-model="card.desc.peoplefrom"
                      :items="peoplelist"
                      item-text="name"
                      item-value="id"
                      prepend-icon="people"
                      label="關聯利害關係人(資料來源)"                     
                      chips
                      multiple
                      autocomplete
                      deletable-chips
                      no-data-text="目前尚無資料"
                    >
                      <template slot="item" slot-scope="data">
                        <template v-if="typeof data.item !== 'object'">                   
                        </template>
                        <template v-else>
                          <v-list-tile-avatar>
                            <v-checkbox v-model="card.desc.peoplefrom" :value="data.item.id"></v-checkbox>
                          </v-list-tile-avatar>
                          <v-list-tile-content v-text="data.item.name"></v-list-tile-content> 
                        </template>
                      </template>                                        
                    </v-select>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex md12>
                <v-layout row wrap v-if="selectedlist.name != '利害關係人'">
                  <v-flex d-flex xs12 >
                    <v-select
                      v-model="card.desc.peopleto"
                      :items="peoplelist"
                      item-text="name"
                      item-value="id"
                      prepend-icon="people"
                      label="關聯利害關係人(要向誰提問)"                     
                      chips
                      multiple
                      autocomplete
                      deletable-chips
                      no-data-text="目前尚無資料"
                    >
                      <template slot="item" slot-scope="data">
                        <template v-if="typeof data.item !== 'object'">                   
                        </template>
                        <template v-else>
                          <v-list-tile-avatar>
                            <v-checkbox v-model="card.desc.peopleto" :value="data.item.id"></v-checkbox>
                          </v-list-tile-avatar>
                          <v-list-tile-content v-text="data.item.name"></v-list-tile-content> 
                        </template>
                      </template>                                        
                    </v-select>
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
                      no-data-text="目前尚無資料"
                    >
                      <template slot="item" slot-scope="data">
                        <v-list-tile-avatar>
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
              <v-flex d-flex xs12 v-if="selectedlist.name == '資料/文件/連結' && (board.admin.includes(user.id) || board.members.includes(user.id)) && editable == true && card.attachments == undefined">
                <input type="file" @change="onFileChange">
                <v-btn color="blue-grey" class="white--text" @click.prevent="upload(card)">
                  上傳檔案
                  <v-icon right dark >cloud_upload</v-icon>
                </v-btn>
                <!-- <v-btn color="warning" class="white--text" target="_blank" :href="card.attachments.url" v-if="card.attachments != undefined">
                  {{card.attachments.name}}
                </v-btn> -->
                <!-- <v-btn color="error" class="white--text" @click="deleteattachment(card)">
                  刪除附件
                </v-btn> -->
              </v-flex>
              <v-flex d-flex xs12 v-if="selectedlist.name == '資料/文件/連結' && editable == true && card.attachments != undefined && card.attachments.preview != undefined">
                <v-card>
                  <v-card-media
                    :src="card.attachments.preview.url"
                    :height="card.attachments.preview.height"
                  ></v-card-media>

                  <v-card-title primary-title>
                    <div>
                      <h3 class="headline mb-0">{{card.attachments.name}}</h3>
                    </div>
                  </v-card-title>

                  <v-card-actions>
                    <v-btn flat color="" target="_blank" :href="card.attachments.url">下載附件</v-btn>
                    <v-btn flat color="error" @click="deleteattachment(card)">刪除附件</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
              <v-flex d-flex xs12 v-if="selectedlist.name == '資料/文件/連結' && editable == true && card.attachments != undefined && card.attachments.preview == undefined">
                 <v-card>
                  <v-card-title primary-title>
                    <div>
                      <h3 class="headline mb-0">{{card.attachments.name}}</h3>
                    </div>
                  </v-card-title>

                  <v-card-actions>
                    <v-btn flat color="" target="_blank" :href="card.attachments.url">下載附件</v-btn>
                    <v-btn flat color="error" @click="deleteattachment(card)">刪除附件</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
              <v-flex d-flex md12 v-if="board.admin.includes(user.id) || board.members.includes(user.id)">
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
            <v-card-actions class="pa-3" v-if="board.admin.includes(user.id) || board.members.includes(user.id)">
              <!--  <v-btn :disabled="!formIsValid" flat color="primary" type="submit" class="subheading">確認</v-btn> -->
              <v-btn flat color="red lighten-1" class="subheading"  @click.native.stop="deletedialog=true;selectedid=card.id">刪除便利貼</v-btn>
              <v-btn flat color="grey lighten-1" class="subheading" @click="resetForm">重新填寫</v-btn>
              <v-spacer></v-spacer>
              <v-btn flat @click.native="closeDialog" class="subheading">取消</v-btn>
              <v-btn flat color="cyan" type="submit" class="subheading" :disabled="!valid" >確認</v-btn>
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
          <v-btn color="blue" flat="flat" @click.native="deletedialog=false; closecard(card.id)">確定</v-btn>
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
    <v-dialog v-model="newmemberdialog" max-width="500px">
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
            <v-btn flat class="subheading">取消</v-btn>
            <v-btn flat color="cyan" type="submit" class="subheading" @click="newmember()">確認</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <v-snackbar
      :timeout="5000"
      top="top"
      v-model="snackbar"
    >
      <span>{{success}}!</span>
      <v-btn flat color="pink" @click.native="snackbar = false">關閉</v-btn>
    </v-snackbar>
    <v-snackbar
      :timeout="5000"
      top="top"
      v-model="attsnackbar"
    >
      請先刪除附件再重新上傳!
      <v-btn flat color="pink" @click.native="attsnackbar = false">關閉</v-btn>
    </v-snackbar>
    <v-dialog v-model="boardtitledialog" max-width="500px">
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
          <v-btn flat class="subheading" @click="getboard();boardtitledialog = false">取消</v-btn>
          <v-btn flat color="cyan" type="submit" class="subheading" @click="editboardtitle()">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable,
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
          'department': '',
          'link': ''
        },
        admin: [],
        members: []
      },
      lists: [],
      cards: [],
      members: [],
      avatar: [],
      dialog: false,
      selectedlist: {},
      snackbar: false,
      success: '',
      valid: false,
      show_new_member: false,
      titleRules: [
        v => !!v || '此欄位為必填!',
        v => v.length <= 30 || '此欄位不可超過30個字!'
      ],
      card: {
        id: '',
        title: '',
        desc:{
          explain:'',
          responsetime: 'nowadays',
          department: '',
          background: '',
          role: '',
          peopleto: [],
          peoplefrom: [],
          data: [],
          related: [],
          attachment: '',
          x: 0,
          y: 0
        },
      },
      peoplelist: [],
      datalist: [],
      fab: false,
      editable: false,
      search: '',
      deletedialog: false,
      email: '',
      hover: false,
      newpersondialog: false,
      newperson: '',
      newpersondesc: {
          explain:'',
          responsetime: 'nowadays',
          department: '',
          background: '',
          role: '',
          peopleto: [],
          peoplefrom: [],
          data: [],
          related: [],
          attachment: '',
          x: 0,
          y: 0
      },
      relationmode: false,
      firstcard: {},
      uploadfile: FormData,
      responsestring: '',
      newmemberdialog: false,
      attsnackbar: false,
      boardtitledialog: false,
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
      this.card.desc.role= ''
      this.card.desc.peopleto = []
      this.card.desc.peoplefrom = []
      this.card.desc.data = []
    },
    submit: function() {
      let that = this
      if (this.$refs.form.validate()) {
        if (this.editable == false) 
        {
          this.card.desc.x = 100 + this.selectedlist.cards.length * 150
          this.card.desc.y = this.selectedlist.column * 150 
          Trello.post('cards', {'name': this.card.title, 'idList': this.selectedlist.id,'desc': JSON.stringify(this.card.desc)} , function(res) {
            if (that.card.desc.attachment != '' && that.card.desc.attachment != undefined) {
              if (that.card.attachments == undefined) {
                Trello.post('cards/' + res.id + '/attachments', {'url': that.card.desc.attachment, 'name': that.card.title}, function() {
                  window.location.reload(true);
                })
              } else if (that.card.desc.attachment == that.card.attachments.url) {
                window.location.reload(true);
              } else {
                that.attsnackbar = true
              }
            } else {
              window.location.reload(true);
            }
          })
        }
        else {
          Trello.put('cards/' + this.card.id, {'name': this.card.title, 'idList': this.selectedlist.id,'desc': JSON.stringify(this.card.desc) } , function(res) {
            if (that.card.desc.attachment != '' && that.card.desc.attachment != undefined) {
              if (that.card.attachments == undefined) {
                Trello.post('cards/' + res.id + '/attachments', {'url': that.card.desc.attachment, 'name': that.card.title}, function() {
                  window.location.reload(true);
                })
              } else if (that.card.desc.attachment == that.card.attachments.url) {
                window.location.reload(true);
              } else {
                that.attsnackbar = true
              }
            } else {
              window.location.reload(true);
            }
          })
        }
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
      this.selectedlist.cards = list.cards
      this.selectedlist.column = list.column
      this.editable = false
      this.resetForm()
      if (this.selectedlist.name == '回應') {
        if (this.card.desc.responsetime == 'nowadays') {
          this.card.title = '[現在]'
        } else {
          this.card.title = '[未來]'
        }
      }
    },
    editcard: function(card,list) {
      if (this.relationmode == false) {
        /* if (this.board.admin.includes(this.user.id) || this.board.members.includes(this.user.id)) { */
          this.dialog = true
          this.selectedlist.name = list.name;
          this.selectedlist.id = list.id;
          this.selectedlist.color = list.color
          this.selectedlist.cards = list.cards
          this.selectedlist.column = list.column
          this.card.id = card.id
          this.card.title = card.name
          this.card.desc.responsetime = card.desc.responsetime
          this.card.desc.peopleto = card.desc.peopleto
          this.card.desc.peoplefrom = card.desc.peoplefrom
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
    getlists: async function() {
      this.lists = []
      let id = this.$route.params.id
      let listarray = await Trello.boards.get(id + '/lists',{cards: 'open'})
      listarray.map( async (l) => {
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
          list.column = 6
          break
          case '資料/文件/連結':
          list.color = 'blue-grey lighten-4'
          list.column = 7
          break
          default:
          list.color = 'teal'
          break
        }
        list.cards.map( async (card) => {
          let desc = JSON.parse(card.desc)
          card.desc = desc
          card.color = list.color
          card.column = list.column
          card.hover = false
          let attach = await Trello.cards.get(card.id,{fields: 'attachments',attachments: true})
          if (attach.attachments.length != 0) {
            attach.attachments.map( async (att) => {
              let attachment = {}
              attachment.id = att.id
              attachment.name = att.name
              attachment.url = att.url
              if (att.previews.length != 0) {
                attachment.preview = att.previews[4]
              }
              card.attachments = await attachment
            })
          }
        })
        this.lists.push(list)
      })
      this.getpeople()
      this.getdata()
    },
    getavatar: function(usr){;
      let that = this
      Trello.get('/members/'+usr,function(e){
          that.avatar.push(e.avatarUrl);
      })
    },
    getmembers: function(){
      let that = this
      let heremembers = []
      this.board.id = this.$route.params.id
      Trello.boards.get(this.board.id+'/members', function(e){
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
            card.color = list.color
            card.hover = false
            this.lists.map( l => {
              l.cards.map( c => {
                if (c.desc.peoplefrom != undefined) {
                  c.desc.peoplefrom.map( p => {
                    if (p == card.id) {
                      c.color = l.color
                      c.hover = false
                    }
                  })
                }
                if (c.desc.peopleto != undefined) {
                  c.desc.peopleto.map( p => {
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
            if (card.desc.peopleto != undefined) {
              for (let p of card.desc.peopleto) {
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
            if (card.desc.peoplefrom != undefined) {
              for (let p of card.desc.peoplefrom) {
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
            that.success = '新增成功！'
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
    onFileChange: function(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      let formData = new FormData();
      formData.append('key','fb8dab318e1888679f571104d8b36ac7')
      formData.append('token',localStorage.trello_token)
      formData.append("file", files[0])
      formData.append("name", this.card.title);
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
    changeresponsetime: function(card) {
      card.title = card.title.replace('[現在]','').replace('[未來]','')
      if (card.desc.responsetime == 'nowadays') {
        this.responsestring = '[現在]'
      } else {
        this.responsestring = '[未來]'
      }
      card.title = this.responsestring + card.title
    },
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
        that.success = '修改成功!'
        that.snackbar = true
        that.boardtitledialog = false
        that.getboard()
      })
    }
  },
  created: function() {
    this.$store.dispatch('getuser')
    this.getboard()
    this.getlists()
    this.getcards()
    this.getmembers()
    /* this.getattachments() */
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
    formIsValid () {
      return (
        this.card.title
      )
    }
  }
  /* mounted: function() {
    this.getattachments()
  } */
}
</script>

<style>

</style>
