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
              <v-btn icon small fab disabled v-for="a in board.avatars" :key="a" class="mx-3 mb-3">
                <img :src="a+'/50.png'" style="border-radius:50%"/> 
              </v-btn>
              <v-icon  @click="new_member()" medium fab btn outline class=" dark ml-2" v-if="board.admin.includes(user.id)">person_add</v-icon>
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
      </v-flex>
      <v-flex md6>
        <v-layout align-center justify-start row reverse fill-height>
          <v-btn flat target="_blank" :href="board.desc.link">會議記錄連結</v-btn>
          <v-btn disabled flat :to="{name:'printout', params:{id:board.id}}">輸出文件</v-btn>
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
    }
  },
  methods: {
    ...mapActions(['getboardinfo', 'getlists', 'getsnackbar']),
    new_member: function(){
      this.newmemberdialog = true;  
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
    },
  },
  created: function() {
    if (this.$route.name == 'board') {
      this.mode = 'board'
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
    ...mapListFields({
      stakeholders: 'stakeholders',
      evidences: 'evidences',
      stakeholderList: 'stakeholderList',
      evidenceList: 'evidenceList',
    }),
    ...mapDictionaryFields({
      opendictionary: 'opendictionary',
    })
  }
}
</script>

<style>

</style>
