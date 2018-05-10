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
            <v-container>
              <v-layout row wrap>
                <v-card-title>
                <v-flex xs12>
                  <v-text-field label="標題" prepend-icon="assignment" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                </v-flex>
                </v-card-title>
                <v-card-text>
                <v-divider></v-divider>
                <v-flex sm8>
                  <v-text-field label="標題" prepend-icon="assignment" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                </v-flex>
                <v-flex sm4>
                   <v-text-field label="標題" prepend-icon="assignment" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                </v-flex>
                </v-card-text>
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
