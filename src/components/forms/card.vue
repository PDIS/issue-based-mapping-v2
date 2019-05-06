<template>
  <v-dialog v-model="opencard" persistent max-width="50vw">
    <v-card>
      <v-card-title>
        <h2 :style="bindtitlestyle(selectedlist.name)">{{selectedlist.name}}</h2>
        <v-spacer></v-spacer>
        <div v-if="(board.admins.includes(user.email) || board.members.includes(user.email)) && editable == true">
          <v-btn flat color="grey" class="subheading" @click="resetForm">重新填寫</v-btn>
          <v-btn flat color="red lighten-1" class="subheading"  @click.native.stop="deleteCard = true; deletedID = card.id">刪除便利貼</v-btn>
        </div>
      </v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
        <v-container>
          <v-layout row wrap mx-3>
            <v-flex xs12>
              <v-layout align-center justify-start row fill-height>
                <v-icon>announcement</v-icon>
                <h3 style="color:rgba(0,0,0,.54)">內容</h3>
              </v-layout>
            </v-flex>
            <v-flex md12 mx-4>
              <v-layout row wrap>
                <v-flex flex xs12 v-if="selectedlist.name == '利害關係人'">
                  <v-text-field color="blue-grey darken-2" label="稱謂/單位名稱"  v-model="card.name" :counter="30" :rules="titleRules"></v-text-field>
                </v-flex>
                <v-flex flex xs12 v-else-if="selectedlist.name == '佐證文件'">
                  <v-text-field color="blue-grey darken-2" label="佐證文件名稱" v-model="card.name" :counter="30" :rules="titleRules"></v-text-field>
                </v-flex>
                <v-flex flex xs12 v-else>
                  <v-text-field color="blue-grey darken-2" v-model="card.name" :counter="30" :rules="titleRules"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="selectedlist.name == '問題細節'">
                <v-flex flex xs12>
                  <v-text-field color="blue-grey darken-2" label="補充說明" v-model="card.desc.explain" ></v-text-field>
                </v-flex>
              </v-layout >
              <v-layout row wrap  v-if="selectedlist.name == '政府回應'">
                <v-flex flex xs12>
                  <v-radio-group v-model="card.desc.responsetime" row @change="changeresponsetime(card)">
                    <v-radio label="現在" value="nowadays" selected ></v-radio>
                    <v-radio label="未來" color="orange" value="future"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex flex xs12>
                  <v-text-field color="blue-grey darken-2" label="補充說明"  v-model="card.desc.explain"  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="selectedlist.name == '困難'">
                <v-flex flex xs12>
                  <v-text-field color="blue-grey darken-2" label="補充說明"  v-model="card.desc.explain"  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="selectedlist.name == '利害關係人'">
                <v-flex flex xs12>
                  <v-text-field color="blue-grey darken-2" label="單位"  v-model="card.desc.department" ></v-text-field>
                </v-flex>
                <v-flex flex xs12>
                  <v-text-field color="blue-grey darken-2" label="背景"  v-model="card.desc.background"  ></v-text-field>
                </v-flex>
                <v-flex flex xs12>
                  <v-text-field color="blue-grey darken-2" label="角色（此人與議題的關聯）"  v-model="card.desc.role"  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="selectedlist.name == '佐證文件'">
                <v-flex flex xs12>
                  <v-layout row wrap>
                    <v-flex md12>
                      <v-radio-group v-model="attachmentselection" row >
                        <v-radio label="新增連結" value="attachmentlink"></v-radio>
                        <v-radio label="上傳檔案" value="attachmentupload"></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-layout row wrap v-if="attachmentselection == 'attachmentlink'">
                      <v-flex md12>
                        <v-text-field color="blue-grey darken-2" label="文件連結"  v-model="card.desc.attachment"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap v-if="attachmentselection == 'attachmentupload'">
                      <v-flex md4>
                        <upload-btn depressed outline title="附加檔案" :fileChangedCallback="fileChanged" class="mt-3">
                          <template slot="icon-left">
                            <v-icon left>attach_file</v-icon>
                          </template>
                        </upload-btn>
                      </v-flex>
                      <v-flex md2>
                        <h3 class="mt-4">{{filename}}</h3>
                      </v-flex>
                    </v-layout>
                    <!-- <v-flex md12>
                      <v-layout align-center justify-end row fill-height>
                        <v-btn color="black" class="mt-3" small outline @click.native="newattachmentmode = false; newcard.name = ''; newcard.desc.attachment = '';" >取消</v-btn>
                        <v-btn color="black" class="mt-3" small dark @click.native="newattachmentmode = false; addattachment(card)">確定</v-btn>
                      </v-layout>
                    </v-flex> -->
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex md12 mx-2 v-if="board.admins.includes(user.email) || board.members.includes(user.email)">
              <v-layout row wrap v-if="selectedlist.name != '佐證文件' && selectedlist.name != '利害關係人'">
                <v-flex>
                  <v-btn flat color="primary" v-if="newstakeholdermode == false && newattachmentmode == false" @click.native="newstakeholdermode = true">+新增利害關係人</v-btn>
                  <v-btn flat color="primary" v-if="newattachmentmode == false && newstakeholdermode == false" @click.native="newattachmentmode = true">+新增佐證文件
                    <v-tooltip bottom>
                      <v-icon slot="activator" class="ml-1">info</v-icon>
                      <span>1.既有資料是否可以先提供？這些資料包含：<br/>
                      -過去各項會議(內部會議、跨部會協調會議、專家學者會議等)討論的相關內參資料<br/>
                      -是否有推薦相關的研究論文<br/>
                      -其他不同意立場的陳述或是好文章<br/>
                      2.相關法制規定為何？過去相關規定的修正有沒有討論記錄？<br/>
                      3.有沒有立委曾經關心過此議題？立法院有沒有討論過此議題？有沒有會議記錄與部會當時的文書？<br/>
                      4.有沒有民間關心過此議題?<br/>
                      -有沒有NGO關心過此議題？有沒有相關的資料？<br/>
                      -有沒有陳抗過？收過陳情書？<br/>
                      -部長信箱有沒有收過類似的問題？<br/>
                      </span>
                    </v-tooltip>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex md12 mx-4 v-if="newstakeholdermode == true">
              <v-layout row wrap>
                <v-flex md6>
                  <v-text-field color="blue-grey darken-2" label="稱謂/單位名稱"  v-model="newcard.name" ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-btn color="black" class="mt-3" small outline @click.native="newstakeholdermode = false; newcard.name = ''" >取消</v-btn>
                  <v-btn color="black" class="mt-3" small dark @click.native="newstakeholdermode = false; addstakeholder(card)">確定</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex flex md12 mx-4 v-if="newstakeholdermode == false && newattachmentmode == false">
              <v-layout row wrap v-if="selectedlist.name != '利害關係人'">
                <v-flex flex xs12 >
                  <v-select
                    v-model="card.desc.stakeholders"
                    :items="stakeholders"
                    item-text="name"
                    item-value="id"
                    label="關聯利害關係人(資料來源)"     
                    return-object
                    chips
                    multiple
                    deletable-chips
                    no-data-text="目前尚無資料"
                  ></v-select>
                  <!-- <v-select
                    v-model="card.desc.stakeholders"
                    :items="stakeholders"
                    item-text="name"
                    item-value="id"
                    label="關聯利害關係人(資料來源)"                     
                    chips
                    multiple
                    deletable-chips
                    no-data-text="目前尚無資料"
                  >
                    <template slot="item" slot-scope="data">
                      <template v-if="typeof data.item !== 'object'">                   
                      </template>
                      <template v-else>
                        <v-list-tile-avatar>
                          <v-checkbox v-model="card.desc.stakeholders" :value="data.item.id"></v-checkbox>
                        </v-list-tile-avatar>
                        <v-list-tile-content v-text="data.item.name"></v-list-tile-content> 
                      </template>
                    </template>                                        
                  </v-select> -->
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex md12 mx-4 v-if="newattachmentmode == true">
              <v-layout row wrap>
                <v-flex md12>
                  <v-radio-group v-model="attachmentselection" row >
                    <v-radio label="新增連結" value="attachmentlink"></v-radio>
                    <v-radio label="上傳檔案" value="attachmentupload"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-layout row wrap v-if="attachmentselection == 'attachmentlink'">
                  <v-flex md12>
                    <v-text-field color="blue-grey darken-2" label="佐證文件名稱"  v-model="newcard.name" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex md12>
                    <v-text-field color="blue-grey darken-2" label="文件連結"  v-model="newcard.desc.attachment"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="attachmentselection == 'attachmentupload'">
                  <v-flex md6>
                    <v-text-field color="blue-grey darken-2" label="佐證文件名稱"  v-model="newcard.name" :counter="30" :rules="titleRules"></v-text-field>
                  </v-flex>
                  <v-flex md4>
                    <upload-btn depressed outline title="附加檔案" :fileChangedCallback="fileChanged" class="mt-3">
                      <template slot="icon-left">
                        <v-icon left>attach_file</v-icon>
                      </template>
                    </upload-btn>
                  </v-flex>
                  <v-flex md2>
                    <h3 class="mt-4">{{filename}}</h3>
                  </v-flex>
                </v-layout>
                <v-flex md12>
                  <v-layout align-center justify-end row fill-height>
                    <v-btn color="black" class="mt-3" small outline @click.native="newattachmentmode = false; newcard.name = ''; newcard.desc.attachment = '';" >取消</v-btn>
                    <v-btn color="black" class="mt-3" small dark @click.native="newattachmentmode = false; addattachment(card)">確定</v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex flex md12 mx-4 v-if="newstakeholdermode == false && newattachmentmode == false">
              <v-layout row wrap v-if="selectedlist.name != '佐證文件' && selectedlist.name != '利害關係人'">
                <v-flex flex xs12 >
                  <v-select
                    v-model="card.desc.evidences"
                    :items="evidences"
                    item-text="name"
                    item-value="id"
                    label="選取佐證文件"     
                    return-object
                    chips
                    multiple
                    deletable-chips
                    no-data-text="目前尚無資料"
                  ></v-select>
                  <!-- <v-select
                    v-model="card.desc.evidences"
                    :items="evidences"
                    item-text="name"
                    item-value="id"
                    label="選取佐證文件"
                    color="blue-grey darken-2"
                    chips
                    multiple
                    deletable-chips
                    no-data-text="目前尚無資料"
                  >
                    <template slot="item" slot-scope="data">
                      <v-list-tile-avatar>
                        <v-checkbox v-model="card.desc.evidences" :value="data.item.id"></v-checkbox>
                      </v-list-tile-avatar>
                      <v-list-tile-content v-text="data.item.name"></v-list-tile-content>
                    </template>
                  </v-select> -->
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex flex md12 v-if="newstakeholdermode == false && newattachmentmode == false">
              <v-layout row wrap v-if="selectedlist.name != '佐證文件' && selectedlist.name != '利害關係人'">
                <v-flex flex xs12 >
                  <v-select
                    v-model="card.desc.related"
                    :items="relatedlist"
                    item-text="name"
                    item-value="id"
                    label="關聯卡片"     
                    return-object
                    chips
                    multiple
                    deletable-chips
                    no-data-text="目前尚無資料"
                    prepend-icon="fa-link"
                  ></v-select>
                  <!-- <v-select
                    v-model="card.desc.related"
                    :items="relatedlist"
                    item-text="name"
                    item-value="id"
                    label="關聯卡片"
                    color="blue-grey darken-2"
                    chips
                    multiple
                    deletable-chips
                    no-data-text="目前尚無資料"
                    prepend-icon="fa-link"
                  >
                    <template slot="item" slot-scope="data">
                      <v-list-tile-avatar>
                        <v-checkbox v-model="card.desc.related" :value="data.item.id"></v-checkbox>
                      </v-list-tile-avatar>
                      <v-list-tile-content v-text="data.item.name"></v-list-tile-content>
                    </template>
                  </v-select> -->
                </v-flex>
              </v-layout>
            </v-flex>
           
            <v-flex flex xs12 v-if="selectedlist.name == '佐證文件' && editable == true && card.attachments != undefined && card.attachments.preview != undefined">
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
                  <v-btn flat color="error" @click="deleteAttachment(card)">刪除附件</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex flex xs12 v-if="selectedlist.name == '佐證文件' && editable == true && card.attachments != undefined && card.attachments.preview == undefined">
                <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{card.attachments.name}}</h3>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat color="" target="_blank" :href="card.attachments.url">下載附件</v-btn>
                  <v-btn flat color="error" @click="deleteAttachment(card)">刪除附件</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
          <v-card-actions class="px-3" v-if="(board.admins.includes(user.email) || board.members.includes(user.email)) && newstakeholdermode == false && newattachmentmode == false">
            <v-spacer></v-spacer>
            <v-btn flat @click.native="opencard = !opencard" class="subheading">取消</v-btn>
            <v-btn flat color="cyan" type="submit" class="subheading" :disabled="!valid" >確認</v-btn>
          </v-card-actions>
          <v-card-actions class="px-3" v-if="(!board.admins.includes(user.email) && !board.members.includes(user.email))">
            <v-spacer></v-spacer>
            <v-btn flat @click.native="opencard = !opencard" class="subheading">關閉</v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';
import UploadButton from 'vuetify-upload-button';

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
    'upload-btn': UploadButton,
  },
  data() {
    return {
      valid: false,
      newstakeholdermode: false,
      newattachmentmode: false,
      titleRules: [
        v => !!v || '此欄位為必填!',
        v => v.length <= 30 || '此欄位不可超過30個字!'
      ],
      responsestring: '',
      attachmentselection: 'attachmentlink',
      filename: '',
      uploadfile: FormData,
      newcard: {
        title: '',
        desc: {
          explain:'',
          responsetime: 'nowadays',
          department: '',
          background: '',
          role: '',
          stakeholders: [],
          evidences: [],
          related: [],
          attachment: '',
          x: 0,
          y: 0
        }
      },
    }
  },
  methods: {
    bindtitlestyle: function(title) {
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
    },
    changeresponsetime: function(card) {
      card.name = card.name.replace('[現在]','').replace('[未來]','')
      if (card.desc.responsetime == 'nowadays') {
        this.responsestring = '[現在]'
      } else {
        this.responsestring = '[未來]'
      }
      card.name = this.responsestring + card.name
    },
    addstakeholder: function(card) {
      let that = this
      this.lists.map( async l => {
        if (l.name == '利害關係人') {
          this.newcard.idList = l.id
          this.newcard.user = this.user
          let data = await fetch("https://improxy.pdis.nat.gov.tw/newcard/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.newcard)
          })
          let res = await data.json()
          /* Trello.post('cards', {'name': this.newcard.name, 'idList': l.id,'desc': JSON.stringify(this.newcard.desc) } , function(res) { */
          that.newcard.name = ''
          card.desc.stakeholders.push(res)
          that.$store.dispatch('getlists', that.$route.params.id)
          let snackbar = {
            state: true,
            color: 'success',
            text: '新增'
          }
          that.$store.dispatch('getsnackbar', snackbar)
        }
      })
    },
    addattachment: function(card) {
      let that = this;
      this.lists.map(async l => {
        if (l.name == '佐證文件') {
          this.newcard.idList = l.id
          this.newcard.user = this.user
          let data = await fetch("https://improxy.pdis.nat.gov.tw/newcard/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.newcard)
          })
          let res = await data.json()
          if (that.newcard.desc.attachment != '' && that.newcard.desc.attachment != undefined) {
            /* Trello.post('cards/' + res.id + '/attachments', {'url': that.newcard.desc.attachment, 'name': that.newcard.name}, function() { */
            fetch("https://improxy.pdis.nat.gov.tw/newattachmenturl/" + that.card.id + "/" + that.newcard.name + "/" + that.newcard.desc.attachment, {
              method: "post",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.user)
            }).then( () => {
              that.newcard.name = ''
              that.newcard.desc.attachment = ''
              that.$store.dispatch('getlists', that.$route.params.id)
              let snackbar = {
                state: true,
                color: 'success',
                text: '新增'
              }
              card.desc.evidences.push(res)
              that.$store.dispatch('getsnackbar', snackbar)
            })
          } else {
            if (that.newcard.attachments == undefined) {
              fetch("https://improxy.pdis.nat.gov.tw/newattachment/" + that.card.id + "/" + that.card.name, {
                method: "post",
                body: that.uploadfile
              }).then( data => {
                that.newcard.name = ''
                that.$store.dispatch('getlists', that.$route.params.id)
                let snackbar = {
                  state: true,
                  color: 'success',
                  text: '新增'
                }
                card.desc.evidences.push(res)
                that.$store.dispatch('getsnackbar', snackbar)
              }).catch( e => {

              })
            } else {

            }
          }
        }
      })
    },
    deleteAttachment: function(card) {
      let that = this
      /* Trello.delete('cards/' + card.id + '/attachments/' + card.attachments.id, function() { */
      fetch("https://improxy.pdis.nat.gov.tw/deleteattachment/" + card.id + "/" + card.attachments.id, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.user)
      }).then( () => {
        let snackbar = {
          state: true,
          color: 'success',
          text: '刪除'
        }
        that.$store.dispatch('getsnackbar', snackbar)
        that.$store.dispatch('getlists', that.$route.params.id)
        that.opencard = false
      })
    },
    fileChanged: function(file) {
      let title = ''
      if (this.newcard.name != '') {
        title = this.newcard.name
      } else {
        title = this.card.name
      }
      let formData = new FormData();
      /* formData.append('key','fb8dab318e1888679f571104d8b36ac7')
      formData.append('token',localStorage.trello_token) */
      formData.append("file", file)
      /* formData.append("name", title); */
      this.filename = file.name
      this.uploadfile = formData
    },
    resetForm: function() {
      this.card.name = ''
      this.card.desc.explain = ''
      this.card.desc.department= ''
      this.card.desc.background= ''
      this.card.desc.role= ''
      this.card.desc.stakeholders = []
      this.card.desc.evidences = []
      this.card.desc.related= []
    },
    submit: async function() {
      let that = this
      if (this.$refs.form.validate()) {
        if (this.editable == false) 
        {
          this.card.desc.x = 100 + this.selectedlist.cards.length * 150
          this.card.desc.y = this.selectedlist.column * 150
          this.card.idList = this.selectedlist.id
          this.card.user = this.user
          let data = await fetch("https://improxy.pdis.nat.gov.tw/newcard/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.card)
          })
          let res = await data.json() 
          if (that.cardFrom !== null) {
            let newCardID = res.id
            let relatedObject = {id: newCardID, name: that.card.name}
            that.cardFrom.desc.related.push(relatedObject)
            data = await fetch("https://improxy.pdis.nat.gov.tw/editcard/", {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(that.cardFrom)
            })
            res = await data.json()
            if (that.card.desc.attachment != '' && that.card.desc.attachment != undefined) {
              fetch("https://improxy.pdis.nat.gov.tw/newattachmenturl/" + res.id + "/" + that.card.name + "/" + that.card.desc.attachment, {
                method: "post",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.user)
              }).then( () => {
                let snackbar = {
                  state: true,
                  color: 'success',
                  text: '新增'
                }
                that.$store.dispatch('getsnackbar', snackbar)
                that.opencard = false
                that.$store.dispatch('getlists', that.$route.params.id)
              })
            } else {
              if (that.card.attachments == undefined) {
                fetch("https://improxy.pdis.nat.gov.tw/newattachment/" + that.card.id + "/" + that.card.name, {
                  method: "post",
                  body: that.uploadfile
                }).then( data => {
                    let snackbar = {
                      state: true,
                      color: 'success',
                      text: '新增'
                    }
                    that.$store.dispatch('getsnackbar', snackbar)
                    that.opencard = false
                    that.$store.dispatch('getlists', that.$route.params.id)
                  })
                }
              }
            } else {
              if (that.card.desc.attachment != '' && that.card.desc.attachment != undefined) {
                /* Trello.post('cards/' + res.id + '/attachments', {'url': that.card.desc.attachment, 'name': that.card.name}, function() { */
                fetch("https://improxy.pdis.nat.gov.tw/newattachmenturl/" + res.id + "/" + that.card.name + "/" + that.card.desc.attachment, {
                  method: "post",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(this.user)
                }).then( () => {
                  let snackbar = {
                    state: true,
                    color: 'success',
                    text: '新增'
                  }
                  that.$store.dispatch('getsnackbar', snackbar)
                  that.opencard = false
                  that.$store.dispatch('getlists', that.$route.params.id)
                })
              } else {
                if (that.card.attachments == undefined) {
                  fetch("https://improxy.pdis.nat.gov.tw/newattachment/" + that.card.id + "/" + that.card.name, {
                    method: "post",
                    body: that.uploadfile
                  }).then( data => {
                      let snackbar = {
                        state: true,
                        color: 'success',
                        text: '新增'
                      }
                      that.$store.dispatch('getsnackbar', snackbar)
                      that.opencard = false
                      that.$store.dispatch('getlists', that.$route.params.id)
                    })
                }
              }
            }
        }
        else {
          this.card.idList = this.selectedlist.id
          let data = await fetch("https://improxy.pdis.nat.gov.tw/editcard/", {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.card)
          })
          let res = await data.json()
          /* Trello.put('cards/' + this.card.id, {'name': this.card.name, 'idList': this.selectedlist.id,'desc': JSON.stringify(this.card.desc) } , function(res) { */
            if (that.card.attachments == undefined) {
              if (that.card.desc.attachment != '' && that.card.desc.attachment != undefined) {
                fetch("https://improxy.pdis.nat.gov.tw/newattachmenturl/" + res.id + "/" + that.card.name + "/" + that.card.desc.attachment, {
                  method: "post",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(this.user)
                }).then( () => {
                  let snackbar = {
                    state: true,
                    color: 'success',
                    text: '新增'
                  }
                  that.$store.dispatch('getsnackbar', snackbar)
                  that.opencard = false
                  that.$store.dispatch('getlists', that.$route.params.id)
                })
              } else {
                if (that.card.attachments == undefined) {
                  fetch("https://improxy.pdis.nat.gov.tw/newattachment/" + that.card.id + "/" + that.card.name, {
                    method: "post",
                    body: that.uploadfile
                  }).then( data => {
                      let snackbar = {
                        state: true,
                        color: 'success',
                        text: '新增'
                      }
                      that.$store.dispatch('getsnackbar', snackbar)
                      that.opencard = false
                      that.$store.dispatch('getlists', that.$route.params.id)
                    })
                }
              }
            } else if (that.card.desc.attachment == that.card.attachments.url.replace('http://','')) {
              let snackbar = {
                state: true,
                color: 'success',
                text: '修改'
              }
              that.$store.dispatch('getsnackbar', snackbar)
              that.opencard = false
              that.$store.dispatch('getlists', that.$route.params.id)
            } else if (that.filename == that.card.attachments.name) {
              let snackbar = {
                state: true,
                color: 'success',
                text: '修改'
              }
              that.$store.dispatch('getsnackbar', snackbar)
              that.opencard = false
              that.$store.dispatch('getlists', that.$route.params.id)
            } else if (that.card.desc.attachment == '' || that.card.desc.attachment == undefined) {
              let snackbar = {
                state: true,
                color: 'success',
                text: '修改'
              }
              that.$store.dispatch('getsnackbar', snackbar)
              that.opencard = false
              that.$store.dispatch('getlists', that.$route.params.id)
            } else {
              that.attachsnackbar = true
            }
        }
      }
    },
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
      relatedlist: 'relatedlist',
      deleteCard: 'deleteCard',
      deletedID: 'deletedID',
      attachsnackbar: 'attachsnackbar',
      cardFrom: 'cardFrom',
    }),
    ...mapListFields({
      lists: 'lists',
      stakeholders: 'stakeholders',
      evidences: 'evidences',
    }),
  }
}
</script>

<style>

</style>
