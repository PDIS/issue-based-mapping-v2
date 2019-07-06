<template>
  <div>
    <v-layout row>
      <v-flex xs9>
        <v-card flat class="">
          <v-card-text>
            <div class="headline"># {{board.name}} 
              <!-- <v-btn color="primary" icon flat @click="boardtitledialog = true" v-if="board.admin.includes(user.id)">
                <v-icon>edit</v-icon>
              </v-btn> -->
              <v-btn icon small fab disabled v-for="a in board.avatars" :key="a" class="mb-3">
                <img :src="a+'/50.png'" style="border-radius:50%" v-if="a !== null"/>
                <img src="https://c7.uihere.com/files/150/864/961/anonymous-icon-business-user-cliparts.jpg" width="55" style="border-radius:50%" v-else/>
              </v-btn>
              <v-icon  @click="new_member()" medium fab btn outline class=" dark ml-2" v-if="board.admins.includes(user.email)">person_add</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3 v-if="mode == 'board'">
        <v-text-field color="grey darken-4" class="mt-3 mb-0" prepend-icon="search" label="搜尋卡片關鍵字" value="Input text" v-model="search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex md6>
        <v-btn-toggle v-model="mode">
          <v-btn flat value="board" :to="{name:'board', params:{id:board.id}}">
            議題分析表
          </v-btn>
          <v-btn flat value="mindmap" :to="{name:'mindmap', params:{id:board.id}}">
            心智圖
          </v-btn>
        </v-btn-toggle>
        <v-btn flat @click="showLogs">最後更新時間：{{lastUpdatetime}}</v-btn>
      </v-flex>
      <v-flex md6>
        <v-layout align-center justify-start row reverse fill-height>
          <v-btn flat target="_blank" :href="board.desc.link">會議記錄連結</v-btn>
          <!-- <v-btn disabled flat :to="{name:'printout', params:{id:board.id}}">輸出文件</v-btn> -->
          <v-btn flat @click.stop="opendictionary = !opendictionary">專有名詞字典</v-btn>
        </v-layout>
      </v-flex>
      <v-flex md12 v-if="mode == 'board'">
        <v-btn flat icon @click.native="openstakeholders = true">
          <v-icon large>supervisor_account</v-icon>
        </v-btn>
        <v-btn flat icon @click.native="openevidences = true">
          <v-icon large>attachment</v-icon>
        </v-btn>
      </v-flex>
      <v-flex md12 v-if="mode == 'mindmap'">
        <v-layout align-center justify-start row fill-height>
          <v-menu>
            <template #activator="{ on: menu }">
              <v-tooltip bottom>
                <template #activator="{ on: tooltip }">
                  <v-btn flat icon v-on="{ ...tooltip, ...menu }">
                    <v-icon large>note</v-icon>
                  </v-btn>
                </template>
                <span>新增卡片</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-tile
                v-for="(item, index) in items"
                :key="index"
                @click="newcard(item.title)"
              >
                <v-list-tile-title >{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
         <!--  <v-item-group>
            <v-item>
              <v-btn flat icon slot-scope="{ active, toggle }" :color="active ? 'primary' : ''" @click="toggle">
                <v-icon>fa-link</v-icon>
              </v-btn>
            </v-item>
            <v-item>
              <v-btn flat icon slot-scope="{ active, toggle }" :color="active ? 'primary' : ''" @click="toggle">
                <v-icon>fa-unlink</v-icon>
              </v-btn>
            </v-item>
          </v-item-group> -->
        </v-layout>
        <!-- <v-btn flat icon @click.native="newcard('問題面向')" color="#FFCD13">
          <v-icon large>note</v-icon>
        </v-btn>
        <v-btn flat icon @click.native="newcard('問題細節')" color="#FFE276">
          <v-icon large>note</v-icon>
        </v-btn>
        <v-btn flat icon @click.native="newcard('現有解法')" color="#91AD70">
          <v-icon large>note</v-icon>
        </v-btn>
        <v-btn flat icon @click.native="newcard('政府回應')" color="#F08B8B">
          <v-icon large>note</v-icon>
        </v-btn>
        <v-btn flat icon @click.native="newcard('困難')" color="#C85938">
          <v-icon large>note</v-icon>
        </v-btn> -->
      </v-flex>
    </v-layout>
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
          <v-text-field  color="grey darken-4" class="mt-0 mb-0" label="請輸入email(可輸入多個email，中間以 , 分開)" value="Input text" v-model="email"></v-text-field> 
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
    <dictionary></dictionary>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';
import snackbar from './snackbar'
import dictionary from './dictionary'
import moment from 'moment'

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
    dictionary,
    snackbar,
  },
  data () {
    return {
      members: [],
      avatar: [],
      success: '',
      show_new_member: false,
      email: '',
      relationmode: false,
      newmemberdialog: false,
      mode: 'board',
      items: [
        { title: '問題面向' },
        { title: '問題細節' },
        { title: '現有解法' },
        { title: '政府回應' },
        { title: '困難' },
      ],
      linkingMode: false,
      invite: {},
      lastUpdatetime: '',
      logs: []
    }
  },
  methods: {
    ...mapActions(['getboardinfo', 'getlists', 'getsnackbar']),
    new_member: function(){
      this.newmemberdialog = true;  
    },
    newmember: async function() {
      let that = this
      this.invite.board = this.board
      this.invite.email = this.email
      this.invite.user = this.user
      try {
        let data = await fetch('https://improxy.pdis.nat.gov.tw/invite/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.invite)
        })
        let snackbar = {
          state: true,
          color: 'success',
          text: '新增'
        }
        that.$store.dispatch('getsnackbar', snackbar)
        that.$store.dispatch('getboardinfo', that.$route.params.id)
        this.newmemberdialog = false;
      } catch (e) {
        console.log(e)
      }      
    },
    newcard: function (name) {
      this.lists.map( list => {
        if (list.name == name) {
          this.opencard = true; 
          this.selectedlist.name = list.name;
          this.selectedlist.id = list.id;
          this.selectedlist.color = list.color
          this.selectedlist.cards = list.cards
          this.selectedlist.column = list.column
          this.editable = false
          this.resetForm()
          if (this.selectedlist.name == '政府回應') {
            if (this.card.desc.responsetime == 'nowadays') {
              this.card.name = '[現在]'
            } else {
              this.card.name = '[未來]'
            }
          }
          this.getrelated(list)
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
    getLogs: async function() {
      try {
        /* let data = await fetch('https://improxy.pdis.nat.gov.tw/getlogs/' + this.board.id, { */
        let res = await fetch('https://improxy.pdis.nat.gov.tw/getlogs/' + this.$route.params.id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        let data = await res.json()
        if (data.length != 0) {
          this.lastUpdatetime = moment(data[0].createdAt).format('YYYY-MM-DD h:mm:ss a')
          data.map( l => {
            let log = {}
            log.name = l.user.name
            log.time =  moment(l.createdAt).format('YYYY-MM-DD h:mm:ss a')
            log.data = l.data.name
            switch (l.action) {
              case 'CreateCard':
                log.action = '新增卡片'
              case 'EditCard':
                log.action = '修改卡片'
              case 'CloseCard':
                log.action = '刪除卡片'
            }
            this.logs.push(log)
          })
          console.log(this.logs)
        }
      } catch (e) {
        console.log(e)
      }      
    },
    showLogs: function() {

    },
  },
  created: function() {
    if (this.$route.name == 'board') {
      this.mode = 'board'
      this.getLogs()
    } else {
      this.mode = 'mindmap'
    }
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
      search: 'search',
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
    ...mapDictionaryFields({
      opendictionary: 'opendictionary',
    })
  },
}
</script>

<style>

</style>
