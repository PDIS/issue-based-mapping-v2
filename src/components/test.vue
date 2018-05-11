<template>
  <v-container fluid >
    <v-layout row wrap justify-center>
      <v-flex xs12 sm6>
        <v-card>
          <v-snackbar v-model="snackbar" absolute top right color="success">
            <span>新增成功!</span>
          <v-icon dark>check_circle</v-icon>
          </v-snackbar>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
            <v-container fluid>
              <v-layout row wrap>
                <v-flex d-flex md4>
                  <v-card color="orange" dark>
                   <v-card-text>
                     fefefefefef
                   </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex d-flex md3>
                  <v-layout row wrap>
                    <v-flex d-flex xs12>
                      <v-card color="blue">
                         <v-card-text>
                     fefefefefef
                   </v-card-text>
                      </v-card>
                    </v-flex>
              <v-flex d-flex xs12>
                      <v-card color="blue">
                         <v-card-text>
                     fefefefefef
                   </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>
       <!--          <v-divider></v-divider>
                <v-flex xs8>
                  <v-text-field label="標題" prepend-icon="assignment" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>

                </v-flex>
                <v-flex>
                   <v-text-field label="標題" prepend-icon="assignment" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
   
                </v-flex> -->
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    const defaultForm = Object.freeze({
      card: {
        title: '',
        desc:{
          'title':'',
          'person':'',
          'date':null
        },
      }
    })
    return {
      snackbar: false,
      valid:false,
      titleRules: [
        v => !!v || '此欄位為必填!',
        v => v.length <= 20 || '此欄位不可超過20個字!'
      ],
      form: Object.assign({}, defaultForm)
    }
  }
}
</script>

<style>

</style>
