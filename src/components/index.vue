<template>
  <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12 >
        <v-text-field color="blue-grey darken-4" class="mt-3 mb-0" prepend-icon="search" :label="$t('Search')" value="Input text" v-model="search"></v-text-field>
      </v-flex>
      <v-flex xs4 text-xs-left pt-5>          
        <span>{{ $t("IssueList") }}</span>
      </v-flex>
       <v-flex xs4 text-xs-right offset-xs4 pt-4>   
          <span class="group">
            <v-btn outline btn @click="showtable = true"><v-icon>subject</v-icon></v-btn>
            <v-btn outline btn @click="showtable = false"><v-icon>apps</v-icon></v-btn>
          </span>
      </v-flex > 
    </v-layout>  
    <v-divider></v-divider>
    <v-layout row wrap v-if="!showtable">
      <v-flex xs12 sm6 md4 lg3 text-xs-center v-if="members.includes(user.id)">
        <v-card height='20em' hover class="yellow darken-2">
          <v-container fill-height>
            <v-layout align-center justify-center>
              <v-card-text >
                <v-btn class="cyan darken-4" fab dark large @click="changeboardform('')">
                  <v-icon large dark>add</v-icon>
                </v-btn>
              </v-card-text>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
        <v-flex xs12 sm6 md4 lg3 v-for="board in orderBy(filteredList,'desc.date',-1) " :key="board.id" >
          <v-card color="white" :to="{name:'mindmap', params:{id:board.id}}" hover height="20em">
            <v-list subheader style="background-color:white">
              <v-subheader class="grey lighten-3" style="color:black"># <div class="ml-2">{{ board.title }}</div>
                <v-spacer></v-spacer>
                <v-chip outline color="black" text-color="black">
                  {{board.desc.department}}
                </v-chip>
              </v-subheader>
              <v-list-tile class="mt-3">
                <v-list-tile-avatar>
                  <v-icon color="grey lighten-1">announcement</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ $t("Name of Topic") }}</v-list-tile-sub-title>
                  <v-list-tile-title v-html="board.desc.title"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-icon color="grey lighten-1">face</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ $t("Initiator") }}</v-list-tile-sub-title>
                  <v-list-tile-title v-html="board.desc.person"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-icon color="grey lighten-1">event</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ $t("Kick-off Date") }}</v-list-tile-sub-title>
                  <v-list-tile-title v-html="board.desc.date"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          <v-divider></v-divider> 
          <v-card-actions class="mt-1" style="background-color:white">  
            <v-btn class="blue-grey darken-4 white--text" :to="{name:'mindmap', params:{id:board.id}}"><v-icon>arrow_right</v-icon>{{ $t("Enter") }}</v-btn>
            <v-spacer></v-spacer> 
            <div v-if="board.admin.includes(user.id)">
              <v-btn icon flat color="teal" :to="{name:'index'}" active-class @click="changeboardform(board.id)"><v-icon>edit</v-icon></v-btn>
              <v-btn icon flat color="pink" :to="{name:'index'}" active-class @click.native.stop="dialog=true;selectedid=board.id"><v-icon>delete</v-icon></v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <template v-if="showtable">
      <div v-if="members.includes(user.id)">
        <v-btn color="primary" dark class="mb-2" @click="changeboardform('')">{{ $t("New Topic") }}</v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="boards"
        hide-actions
        :search="search"
        disable-initial-sort
        class="elevation-1 mt-2"
      >
        <template slot="items" slot-scope="props" :to="{name:'board',params:{id:props.item.id}}">
          <td><router-link class="black--text" style="text-decoration: none;" :to="{ name: 'board', params: { id: props.item.id }}">{{ props.item.title }}</router-link></td>
          <td class="text-xs-left">{{ props.item.desc.title }}</td>
          <td class="text-xs-left">{{ props.item.desc.person }}</td>
          <td class="text-xs-left">{{ props.item.desc.date }}</td>
          <td class="text-xs-left">{{ props.item.desc.department }}</td>
          <td class="justify-center px-0">
            <div v-if="props.item.admin.includes(user.id)">
              <v-icon color="teal" class="mr-2" @click="changeboardform(props.item.id)">edit</v-icon>
              <v-icon color="pink" @click="dialog=true;selectedid=props.item.id">delete</v-icon>
            </div>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          沒有符合 "{{ search }}" 的搜尋結果:(
        </v-alert>
      </v-data-table>
    </template>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">確定刪除?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="closeboard(selectedid)">確定</v-btn>
          <v-btn color="black" flat="flat" @click.native="dialog=false" :to="{name:'index'}" active-class>取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :timeout="5000"
      top="top"
      v-model="snackbar"
    >
      刪除成功!
      <v-btn flat color="pink" @click.native="snackbar = false">關閉</v-btn>
    </v-snackbar>
    <boardform></boardform>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import boardform from './boardform'
export default {
  components: {
    boardform
  },
  data () {
    return {
      search: '',
      selectedid: '',
      canedit: true,
      showtable: false,
      headers: [
        {
          text: this.$t("Name of Topic"),
          align: 'left',
          sortable: false,
          value: 'title'
        },
        { text: this.$t("Name of Topic"), value: 'desc.title' },
        { text: this.$t("Initiator"), value: 'desc.person' },
        { text: this.$t("Kick-off Date"), value: 'desc.date' },
        { text: this.$t("Responsible Bodies"), value: 'desc.department' },
        { text: '', value:''}
      ],
      dialog: false,
      snackbar: false
    }
  },
  methods: {
    ...mapActions(['changeboardform']),
    closeboard: function(id) {
      let that = this
      Trello.put('boards/' + id ,{'closed':true},function(res) {
        that.dialog = false
        that.snackbar = true
        that.$store.dispatch('getboards')
      })
    },
  },
  created: function() {
    this.$store.dispatch('getuser')
    this.$store.dispatch('getmembers')
    this.$store.dispatch('getboards')
  },
  computed: {
    ...mapGetters({
      user: 'user',
      members: 'members',
      boards: 'boards'
    }), 
    filteredList() {
      return this.boards.filter(board => {
        return board.title.toLowerCase().includes(this.search.toLowerCase())
      })
    },
  },
}
</script>

<style scoped>

</style>
