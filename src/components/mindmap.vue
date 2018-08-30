<template>
<div id="fuck">
  <v-btn absolute dark fab bottom right color="pink" style="bottom:1em" @click="dialog = true">
    <v-icon medium>add</v-icon>
  </v-btn>
   <!-- <v-textarea id="textbox" v-model="textbox.text" solo no-resize outline color="black" :width="textbox.width" :height="textbox.height" v-show="textbox.show"></v-textarea> -->
  <v-stage id="stage" ref="stage" :config="getstageconfig()">
    <v-layer ref="layer">
      <v-group v-for="list in lists" :key="list.id">
        <v-group v-for="(card, index) in list.cards" :ref="card.id" :key="card.id" @dragmove="adjustPoint(card.id)" @dragend="changeposition(card,list)" :config="getgroupconfig(card)">
          <v-rect :config="getrectconfig(card)" ></v-rect>
          <v-text :config="gettextconfig(card)" @dblclick="edittext(card, index)" :ref="'text' + card.id"></v-text>
          <v-group v-for="(person,i) in card.tagsfrom" :key="person">
            <v-tag :config="gettagconfig(person,i,'#ABEBC6')"></v-tag>
            <v-text :config="gettagtextconfig(person,i)"></v-text>
          </v-group>
          <v-group v-for="(person,i) in card.tagsto" :key="person">
            <v-tag :config="gettagconfig(person,i,'#D2B4DE')"></v-tag>
            <v-text :config="gettagtextconfig(person,i)"></v-text>
          </v-group>
          <v-group v-for="(attachment, j) in card.attachments" :key="attachment.name" @mouseup="viewattachment(attachment)" @mouseover="changecursor(true)" @mouseout="changecursor(false)">
            <v-tag :config="gettagconfig(attachment.name, j,'#CFD8DC' , card.tags)"></v-tag>
            <v-text :config="gettagtextconfig(attachment.name, j, card.tags)"></v-text>
          </v-group>
        </v-group>
      </v-group>
      <v-arrow v-for="arrow in arrows" :key="arrow" ref="arrow" :config="arrowconfig[arrow]"></v-arrow>
    </v-layer>
  </v-stage>
  <v-dialog v-model="dialog" max-width="50em">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
          <v-container>
            <v-layout row wrap class="ma-5">
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
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="角色（此人與議題的關聯）" prepend-icon="folder" v-model="card.desc.role"  ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="selectedlist.name == '資料/文件/連結'">
                  <v-flex d-flex xs12>
                    <v-text-field color="blue-grey darken-2" label="資料/文件/連結" prepend-icon="announcement" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
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
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex xs12 v-if="selectedlist.name == '資料/文件/連結' && (board.admin.includes(user.id) || board.members.includes(user.id)) && editable == true && card.attachments == undefined">
                <input type="file" @change="onFileChange">
                <v-btn color="blue-grey" class="white--text" @click.prevent="upload(card)">
                  上傳檔案
                  <v-icon right dark >cloud_upload</v-icon>
                </v-btn>
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
              <v-btn flat color="cyan" type="submit" class="subheading">確認</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editdialog" max-width="50em" persistent>
      <v-card>
        <v-card-title class="headline">修改便利貼</v-card-title>
        <v-card-text>
          <v-form>
            <v-container>
              <v-layout row wrap>
                <v-flex d-flex md12>
                  <v-text-field color="blue-grey darken-2" v-model="card.title" :counter="20" :rules="titleRules"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
         <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn flat class="subheading" @click="editdialog = false">取消</v-btn>
            <v-btn flat color="cyan" type="submit" class="subheading" @click="edittextsubmit()">確認</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      lists: [],
      arrows: 0,
      arrowconfig: [],
      labeltextconfig: [],
      dialog: false,
      valid: false,
      selectedlist: {},
      peoplelist: [],
      datalist: [],
      snackbar: false,
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
      textbox: {
        text: '',
        width: '180px',
        height: '130px',
        show: false,
      },
      editdialog: false,
      titleRules: [
        v => !!v || '此欄位為必填!',
        v => v.length <= 20 || '此欄位不可超過20個字!'
      ],
    }
  },
  created: function() {
    this.getcards()
    /* this.getlabeltextconfig() */
  },
  mounted: function() {
    let that = this
/*     let stage = this.$refs.stage.getStage()
    let scaleBy = 1.1; */
    setTimeout( () => {
      that.lists.map(l => {
        l.cards.map(c => {
          if (c.desc.related != undefined) {
            if (c.desc.related.length != 0) {
              c.desc.related.map( r => {
                that.arrows++
                that.getarrowconfig(c.id,r)
              })
            }
          }
        })
      })
    }, 1000)
    window.addEventListener('wheel', (e) => {
      let stage = this.$refs.stage.getStage()
      let scaleBy = 1.1;
      e.preventDefault();
      let oldScale = stage.scaleX();

      let mousePointTo = {
          x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
          y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      let newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });

      let newPos = {
          x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
          y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
      };
      stage.position(newPos);
      stage.batchDraw();
    });
  },
  destroyed: function() {
    window.removeEventListener('wheel', (e) => {
          console.log('fuck')
      e.preventDefault();
      let oldScale = stage.scaleX();

      let mousePointTo = {
          x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
          y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      let newScale = e.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });

      let newPos = {
          x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
          y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
      };
      stage.position(newPos);
      stage.batchDraw();}
    )
  },
  methods: {
    getcards: async function() {
      this.lists = []
      let id = this.$route.params.id
      let listarray = await Trello.boards.get(id + '/lists',{cards: 'open'})
      listarray.map( await (l => {
        if (l.name != '利害關係人' && l.name != '資料/文件/連結') {
          let list = {}
          list.id = l.id
          list.name = l.name
          list.cards = l.cards
          switch (list.name)
          {
            case '問題面向':
            list.color = '#FBC02D'
            break
            case '問題細節':
            list.color = '#FFE082'
            break
            case '解法':
            list.color = '#689F38'
            break
            case '回應':
            list.color = '#F4511E'
            break
            case '困難':
            list.color = '#FF8A80'
            break
            case '利害關係人':
            list.color = '#0097A7'
            break
            case '資料/文件/連結':
            list.color = '#CFD8DC'
            break
            default:
            list.color = 'teal'
            break
          }
          list.cards.map( async (card) => {
            let desc = JSON.parse(card.desc)
            card.desc = desc
            card.color = list.color
            card.hover = false
            card.tagsfrom = []
            card.tagsto = []
            card.desc.peoplefrom.map( async (personid) => {
              let person = await Trello.cards.get(personid)
              card.tagsfrom.push(person.name)
            })
            card.desc.peopleto.map( async (personid) => {
              let person = await Trello.cards.get(personid)
              card.tagsto.push(person.name)
            })
            card.attachments = []
            card.desc.data.map( async (attachid) => {
              let attach = await Trello.cards.get(attachid,{fields: 'attachments',attachments: true})
              if (attach.attachments.length != 0) {
                attach.attachments.map( async (att) => {
                  let attachment = {}
                  attachment.name = att.name
                  attachment.url = att.url
                  card.attachments.push(attachment)
                })
              }
            })
          })
          this.lists.push(list)
        }
      }))
    },
    getstageconfig: function() {
      let stagewidth = window.innerWidth
      let stageheight = window.innerHeight - 64
      return {
        width: stagewidth,
        height: stageheight,
        draggable: true
      }
    },
    getgroupconfig: function(card) {
      return {
        x: card.desc.x,
        y: card.desc.y,
        draggable: true
      }
    },
    getrectconfig: function(card) {
      let tags = card.desc.peoplefrom.length + card.desc.peopleto.length + card.desc.data.length
      if (tags < 2) { tags = 2 }
      return {
        fill: card.color,
        width: 180,
        height: 130 + ((tags - 2) * 30),
        shadowColor: 'black',
        shadowOffset: {
          x: 5,
          y: 5
        },
        shadowOpacity: 0.6
      }
    },
    gettextconfig: function(card) {
      return { 
        text: card.name, 
        fontSize: 18, 
        width: 180, 
        padding: 15, 
        fontFamily: 'Noto Sans TC' ,
        lineHeight: 1.5,
      }
    },
    gettagconfig: function(text, i, color, tags) {
      let textlength = text.length
      let tagslength = 0
      let j = 0
      let k = 0
      if (tags != undefined) {
        tagslength = tags.length
        if (tagslength + i > 1) {
          j = (tagslength + i) / 2
        }
        k = (tagslength + i) % 2
      }
      else {
        k = (tagslength + i) % 2
      }
      return {
        x: 20 + k * 85,
        y: 100 + j * 30,
        width: 70,
        height: 20,
        fill: color,
        pointerDirection: 'left',
        pointerWidth: 10,
        pointerHeight: 20,
        lineJoin: 'round',
      }
    },
    gettagtextconfig: function(text, i, tags) {
      let textlength = text.length
      let tagslength = 0
      let j = 0
      let k = 0
      if (tags != undefined) {
        tagslength = tags.length
        if (tagslength + i > 1) {
          j = (tagslength + i) / 2
        }
        k = (tagslength + i) % 2
      }
      else {
        k = (tagslength + i) % 2
      }
      return {
        x: 25 + k * 85,
        y: 103 + j * 30,
        width: textlength * 15,
        text: text,
        fontSize: 12,
        fontFamily: 'Noto Sans TC',
      }
    },
    getarrowconfig: function(c,r) {
      let startpoint = this.$refs[c][0].getStage()
      let endpoint = this.$refs[r][0].getStage()
      let startpointx = startpoint.getX() + startpoint.children[0].getWidth()/2
      let startpointy = startpoint.getY() + startpoint.children[0].getHeight()
      let endpointx = endpoint.getX() + endpoint.children[0].getWidth()/2
      let endpointy = endpoint.getY()
      this.arrowconfig[this.arrows] = {
        name: c + ',' + r,
        fill: 'black',
        points: [startpointx,startpointy,endpointx,endpointy],
        stroke: 'black',
        strokeWidth: 4,
      }
    },
    adjustPoint: function(id){
      let point = this.$refs[id][0].getStage()
      this.$refs.arrow.map(a => {
        let ids = a.getStage().getName().split(',')
        if (id == ids[0]) {
          let p = [point.getX() + point.children[0].getWidth()/2,point.getY() + point.children[0].getHeight(),a.getStage().getPoints()[2],a.getStage().getPoints()[3]]
          a.getStage().setPoints(p)
        } else if (id == ids[1]) {
          let p = [a.getStage().getPoints()[0],a.getStage().getPoints()[1],point.getX() + point.children[0].getWidth()/2,point.getY()]
          a.getStage().setPoints(p)
        }       
      })
    },
    changeposition: function(card,list) {
      card.desc.x = this.$refs[card.id][0].getStage().getX()
      card.desc.y = this.$refs[card.id][0].getStage().getY()
      Trello.put('cards/' + card.id, {'idList': list.id,'desc': JSON.stringify(card.desc) } , function() {
      })
    },
    viewattachment: function(attachment) {
      window.open(attachment.url);
    },
    changecursor: function(mouseover) {
      if (mouseover) {
        document.body.style.cursor = 'pointer';
      }
      else {
        document.body.style.cursor = 'default';
      }
    },
    edittext: function(card,index) {
      this.editdialog = true
      this.card.id = card.id
      this.card.title = card.name
      
      /* let x = this.$refs[card.id][0].getStage().getX()
      let y = this.$refs[card.id][0].getStage().getY()
      let textarea = document.getElementById("textbox");
      let position = this.$refs[card.id][0].getStage().getAbsolutePosition()
      let left = this.$refs.stage.getStage().getContainer().getBoundingClientRect().left
      let top = this.$refs.stage.getStage().getContainer().getBoundingClientRect().top
      let areaPosition = {
        x: position.x + left ,
        y: position.y + top
      };
      console.log(areaPosition)
      var textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      document.getElementById("stage").appendChild(textarea);
      textarea.value = card.name;
      textarea.style.position = 'absolute';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.width = '180px';
      textarea.focus();
      console.log(areaPosition.y + 'px') */
    },
    edittextsubmit: function() {
      let that = this
      Trello.put('cards/' + this.card.id, {'name': this.card.title } , function(res) {
        that.getcards()
        that.editdialog = false
        /* let text = that.$refs['text' + this.card.id][0].getStage()
        text.text(that.card.title)
        let stage = that.$refs.stage.getStage();
        stage.draw() */
      })
    }
    /* handlescroll: function() {
      console.log(window.scrollY)
      let stage = this.$refs.stage.getStage()
      let scaleBy = 1.1;
      let oldScale = stage.scaleX();
      let mousePointTo = {
          x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
          y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };
      let newScale = window.scrollY.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });

      let newPos = {
          x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
          y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
      };
      stage.position(newPos);
      stage.batchDraw();
    } */
  },
  computed: mapGetters({
    user: 'user',
  }),
}
</script>

<style scoped>
body {
  overflow: hidden;
}

</style>
