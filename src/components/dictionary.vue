<template>
  <v-navigation-drawer
    v-model="opendictionary"
    right
    app
    disable-route-watcher
    temporary
  >
    <v-toolbar color="#FFCD13">
       <v-toolbar-title>專有名詞字典/筆記
         <v-tooltip bottom>
          <v-icon slot="activator" class="ml-1">info</v-icon>
          <span>你可以於此新增議題相關專有名詞及其解釋，以利同仁間建立共同語言</span>
        </v-tooltip>
      </v-toolbar-title>
    </v-toolbar>
    <v-text-field color="blue-grey darken-4" prepend-icon="search" label="搜尋關鍵字" single-line v-model="search"></v-text-field>
<!--     <v-card color="#FBF0D3">
      <v-card-title>
        <p>你可以於此新增議題相關專有名詞及其解釋，以利同仁間建立共同語言</p>
      </v-card-title>
    </v-card> -->
    <v-btn flat color="primary" v-if="newdictionarymode == false"  @click.native="newdictionarymode = true">+新增專有名詞</v-btn>
    <v-container grid-list-xs v-if="newdictionarymode == true">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field color="blue-grey darken-2" label="專有名詞"  v-model="dictionary.name" ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-textarea color="blue-grey darken-2" label="名詞解釋"  v-model="dictionary.desc.explain" ></v-textarea>
        </v-flex>
        <v-flex xs12>
          <v-textarea color="blue-grey darken-2" label="資料來源"  v-model="dictionary.desc.source" ></v-textarea>
        </v-flex>
        <v-flex xs12>
          <v-layout align-center justify-end row fill-height>
            <v-btn color="black" class="mt-3" small outline @click.native="newdictionarymode = false;" >取消</v-btn>
            <v-btn color="black" class="mt-3" small dark @click.native="newdictionarymode = false; addDictionary()">確定</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-list two-line subheader>
      <v-list-tile
        v-for="dic in filteredList"
        :key="dic.id"
        @click="editDictionary(dic)"
      >
        <v-list-tile-action>
          <v-icon>fa-book</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ dic.name }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ dic.desc.explain }}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon @click.stop="deletedialog = true; selectedid = dic.id">fa-times</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
<!--     <v-footer absolute height="auto">
      <v-text-field single-line color="blue-grey darken-4" prepend-inner-icon="search" label="搜尋關鍵字" v-model="search"></v-text-field>
    </v-footer> -->
    <v-dialog v-model="deletedialog" max-width="290">
      <v-card>
        <v-card-title class="headline">確定刪除?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="deletedialog = false; deleteDictionary(selectedid)">確定</v-btn>
          <v-btn color="black" flat="flat" @click.native="deletedialog = false" >取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';

const { mapFields: mapDictionaryFields } = createHelpers({
  getterType: 'getDictionaryField',
  mutationType: 'updateDictionaryField',
});

export default {
  data () {
    return  {
      listid: '',
      dictionaries: [],
      dictionary: {
        id: '',
        name: '',
        desc: {
          explain: '',
          source: ''
        },
      },
      newdictionarymode: false,
      edit: false,
      search: '',
      deletedialog: false,
      selectedid: '',
    }
  },
  methods: {
    ...mapActions(['getsnackbar']),
    getDictionary: async function() {
      let that = this
      this.dictionaries = []
      let data = await fetch("http://localhost:8787/getlists/" + this.$route.params.id)
      let lists = await data.json()
      /* let lists = await Trello.boards.get(this.$route.params.id + '/lists',{cards: 'open'}) */
      lists.map( (list) => {
        if (list.name == '專有名詞字典') {
          that.listid = list.id
          list.cards.map( (card) => {
            card.desc = JSON.parse(card.desc)
            this.dictionaries.push(card)
          })
        }
      })
    },
    addDictionary: async function() {
      let that = this
      this.dictionary.idList = this.listid
      if(!this.edit) {
        fetch("http://localhost:8787/newcard/", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.dictionary)
        }).then( () => {
          let snackbar = {
            state: true,
            color: 'success',
            text: '新增'
          }
          that.$store.dispatch('getsnackbar', snackbar)
          that.getDictionary()
        })
      } else {
        fetch("http://localhost:8787/editcard/", {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.dictionary)
        }).then( () => {
          let snackbar = {
            state: true,
            color: 'success',
            text: '修改'
          }
          that.$store.dispatch('getsnackbar', snackbar)
        })
      }
    },
    editDictionary: function(dic) {
      this.dictionary = dic
      this.newdictionarymode = true
      this.edit = true
    },
    deleteDictionary: function(id) {
      let that = this
      fetch("http://localhost:8787/closecard/" + id, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
      }).then( () => {
        let snackbar = {
          state: true,
          color: 'success',
          text: '刪除'
        }
        that.$store.dispatch('getsnackbar', snackbar)
        that.getDictionary()
      })
    },
  },
  created: function() {
    this.getDictionary()
  },
  computed: {
    ...mapDictionaryFields({
      opendictionary: 'opendictionary',
    }),
    filteredList() {
      return this.dictionaries.filter(dic => {
        return dic.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
  }
}
</script>

<style>
/* .v-navigation-drawer {
  overflow: hidden;
} */
</style>
