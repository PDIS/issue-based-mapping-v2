<template>
  <v-container fluid >
    <v-layout row wrap justify-center>
      <v-dialog v-model="dialog" persistent max-width="50em">
        <v-card>
          <!-- <v-snackbar v-model="snackbar" absolute top right color="success">
            <span>新增成功!</span>
          <v-icon dark>check_circle</v-icon>
          </v-snackbar> -->
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
            <v-container fluid>
              <v-layout row wrap>
                <v-flex d-flex md6>
                  <v-card color="orange" dark>
                    <v-card-text>
                    <!-- 一定要有字才會出來 -->
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex d-flex md6>
                  <v-layout row wrap>
                    <v-flex d-flex xs12>
                      <v-card color="white">
                         <v-card-text>
                    <!-- 一定要有字才會出來 -->
                    </v-card-text>
                      </v-card>
                    </v-flex>
                     <v-flex d-flex xs12>
                      <v-card color="white">
                         <v-card-text>
                    <!-- 一定要有字才會出來 -->
                    </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-divider></v-divider>
  
                <v-flex d-flex md12>
                  <v-layout row wrap v-if="listname =='問題面向'">
                    <v-flex d-flex xs12>
                   <v-text-field label="問題面向" prepend-icon="announcement" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap v-if="listname == '問題細節'">
                         <v-flex d-flex xs12>
                   <v-text-field label="問題細節" prepend-icon="announcement" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                     <v-flex d-flex xs12>
                   <v-text-field label="補充說明" prepend-icon="people" v-model="form.card.title" ></v-text-field>
                    </v-flex>
                  </v-layout>
                      <v-layout row wrap  v-if="listname == '解法'">
                         <v-flex d-flex xs12>
                   <v-text-field label="解法" prepend-icon="announcement" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                      </v-layout>
                      <v-layout row wrap  v-if="listname == '回應'">
                        <v-flex d-flex xs12>
                   <v-text-field label="回應" prepend-icon="announcement" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                      <v-flex d-flex xs12>
                   <v-text-field label="補充說明" prepend-icon="people" v-model="form.card.title"  ></v-text-field>
                    </v-flex>
                        </v-layout>
                      <v-layout row wrap v-if="listname == '困雖'">
                     <v-flex d-flex xs12>
                   <v-text-field label="困雖" prepend-icon="announcement" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                      <v-flex d-flex xs12>
                   <v-text-field label="補充說明" prepend-icon="people" v-model="form.card.title"  ></v-text-field>
                    </v-flex>
                        </v-layout>
                      <v-layout row wrap v-if="listname == '利害關係人'">
                      <v-flex d-flex xs12>
                   <v-text-field label="利害關係人" prepend-icon="announcement" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                     <v-flex d-flex xs12>
                   <v-text-field label="單位" prepend-icon="announcement" v-model="form.card.title" ></v-text-field>
                    </v-flex>
                     <v-flex d-flex xs12>
                   <v-text-field label="背景" prepend-icon="announcement" v-model="form.card.title"  ></v-text-field>
                    </v-flex>
                        </v-layout>
                      <v-layout row wrap v-if="listname == '資料/文件/連結'">
                      <v-flex d-flex xs12>
                   <v-text-field label="資料/文件/連結" prepend-icon="announcement" v-model="form.card.title" :counter="20" :rules="titleRules"></v-text-field>
                    </v-flex>
                      <v-flex d-flex xs12>
                   <v-text-field label="摘要" prepend-icon="people" v-model="form.card.title"></v-text-field>
                    </v-flex>
                    <v-flex d-flex xs12>
                   <v-text-field label="歸納" prepend-icon="people" v-model="form.card.title" ></v-text-field>
                    </v-flex>
                        </v-layout>
                      <v-layout row wrap>
                  </v-layout>
                </v-flex>

                <v-flex d-flex md12>
                  <v-layout row wrap>
                    <v-flex d-flex xs12>
                        <v-select
                          v-model="select"
                          :items="items"
                          label="關聯利害關係人"
                          prepend-icon="people"
                          chips
                          tags
                        ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                  <v-flex d-flex md12>
                  <v-layout row wrap>
                    <v-flex d-flex xs12>
                        <v-select
                          v-model="select"
                          :items="items"
                          label="佐證文件"
                          prepend-icon="picture_as_pdf"
                          chips
                          tags
                        ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-card-actions>
               <!--  <v-btn :disabled="!formIsValid" flat color="primary" type="submit" class="subheading">確認</v-btn> -->
               <v-btn flat color="primary" type="submit" class="subheading">確認</v-btn>
                <v-spacer></v-spacer>
        <v-btn flat class="subheading">清除</v-btn>
        <v-spacer></v-spacer>
         <v-btn flat @click.native="closeDialog"  class="subheading">關閉</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['dialog','listname'],
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
      select: [],
      items: [
        'Programming',
        'Design',
        'Vue',
        'Vuetify',
      ],
      form: Object.assign({}, defaultForm),
    }
  },
  methods: {
    closeDialog() {

      console.log('fuck')
    }
  }
}
</script>

<style>

</style>
