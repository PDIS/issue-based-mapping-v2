<template>
  <v-container grid-list-md>
    <v-layout row>
      <v-flex xs12>
        <template>
          <v-data-table
            :headers="headers"
            :items="lists[0].cards"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.name }}</td>
            </template>
          </v-data-table>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';

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

export default {
  data() {
    return {
      headers: [
        { text: '問題面向', value: 'name' },
        { text: '問題細節', value: 'name' },
        { text: '現有解法', value: 'name' },
        { text: '政府回應', value: 'name' },
        { text: '困難', value: 'name' },
      ],
    }
  },
  methods: {

  },
  created: function() {
    this.$store.dispatch('getlists', this.$route.params.id)
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
    ...mapBoardFields({
      board: 'board',
    }),
    ...mapCardFields({
      card: 'card',
      opencard: 'opencard',
      selectedlist: 'selectedlist',
      editable: 'editable',
      titlestyle: 'titlestyle',
      titlecolor: 'titlecolor',
      relatedlist: 'relatedlist'
    }),
    ...mapListFields({
      lists: 'lists',
      stakeholders: 'stakeholders',
      evidences: 'evidences',
    }),
  }
}
</script>

<style>

</style>
