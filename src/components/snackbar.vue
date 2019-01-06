<template>
  <v-snackbar v-model="snackbar.state" top :color="snackbar.color">
    <span>{{ snackbar.text }}成功!</span>
    <v-btn flat @click.native="getsnackbar(close)">關閉</v-btn>
  </v-snackbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      close: {
        state: false,
        color: '',
        text: '',
      }
    }
  },
  methods: {
    ...mapActions(['getsnackbar']),
  },
  computed: {
    ...mapGetters ({
      snackbar: 'snackbar',
    }),
  }
}
</script>

<style>

</style>
