<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm6>
        <v-card>
          <v-toolbar color="teal">
            <v-btn icon>
              <v-icon color="white">arrow_back</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon color="white">more_vert</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container fluid>
            <v-layout row wrap>
             <!--  <v-flex xs12>
                <v-text-field
                  label="Title"
                  v-model="title"
                  counter
                  max="15"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-flex> -->
              <!-- <v-flex xs12>
                <v-text-field
                  label="E-mail"
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-flex> -->
              <v-flex xs12>
                <v-text-field
                  label="看版名稱"
                  v-model="boardname"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="議題名稱"
                  v-model="desc.title"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="提案人"
                  v-model="desc.person"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="提案日期"
                  v-model="desc.date"
                ></v-text-field>
                 <v-menu
        ref="menu"
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        min-width="290px"
        :return-value.sync="date"
      >
        <v-text-field
          slot="activator"
          label="Picker in menu"
          v-model="date"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
              <v-divider class="mt-5"></v-divider>
              <v-btn color="primary" flat @click="submit">Submit</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<script>
  export default {
    data () {
      return {
        title: 'Preliminary report',
        email: '',
        rules: {
          required: (value) => !!value || 'Required.',
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        },
        boardname:'',
        desc:{
          'title':'',
          'person':'',
          'date':''
          }
      }
    },
    methods: {
      submit: function() {
        let that = this
        Trello.post('boards',{'name':this.boardname,'idOrganization':'5ad56d6d96cb269a7a2aaa0a','idBoardSource':'5ab49c39f2917ad1cff1a3de','prefs_permissionLevel':'org','keepFromSource':'none'},function(res) {
          Trello.put('boards/' + res.id ,{'desc': JSON.stringify(that.desc)})
        })
      }
    }
  }
</script>

