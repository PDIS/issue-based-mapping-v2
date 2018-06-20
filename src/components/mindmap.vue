<template>
<v-stage :config="stageconfig">
  <v-layer>
    <v-group v-for="(c,i) in lists[0].cards" :key="c.id" :ref="id" @dragmove="adjustPoint()" :config="{
        x: 100 + i*150,
        y: 100,
        draggable: true
      }">
    <v-rect :config="{
        fill: '#fbc02d',
        width: 120,
        height: 70,
        shadowColor: 'black',
        shadowOffset: {
          x: 5,
          y: 5
        },
        shadowOpacity: 0.6
      }"></v-rect>
        <v-text :config="{ text: c.name, fontSize: 15, width: 120, padding: 15, fontFamily: 'Roboto,sans-serif' }"></v-text>
    </v-group>
        <v-group ref="rect1" @dragmove="adjustPoint()" :config="{
        x: 500,
        y: 300,
        draggable: true
      }">
    <v-rect :config="{
        fill: '#ff7043',
        width: 200,
        height: 100,
        shadowColor: 'black',
        shadowOffset: {
          x: 5,
          y: 5
        },
        shadowOpacity: 0.6
      }"></v-rect>
        <v-text :config="{ text: '動物保護檢查員有需要可以請警察陪同', fontSize: 15, width: 200, padding: 30, fontFamily: 'Roboto,sans-serif' }"></v-text>
    </v-group>
    <v-arrow ref="arrow" :config="arrowconfig">

    </v-arrow>
  </v-layer>
</v-stage>
</template>

<script>
export default {
  data() {
    return {
      lists: [],
      stageconfig: {},
      groupconfig: {},
      rectconfig: {},
      arrowconfig: {},
    }
  },
  created: function() {
    this.getstageconfig()
    this.getcards()
  },
  mounted: function() {
    this.arrowconfig = {fill: 'black',
        points: [this.$refs.rect.getStage().getX() + this.$refs.rect.getStage().children[0].getWidth()/2,this.$refs.rect.getStage().getY() + this.$refs.rect.getStage().children[0].getHeight(), this.$refs.rect1.getStage().getX() + this.$refs.rect1.getStage().children[0].getWidth()/2, this.$refs.rect1.getStage().getY()],
        stroke: 'black',
        strokeWidth: 4,
        draggable: true}
  },
  methods: {
    getcards: function() {
      let that = this;
      let id = this.$route.params.id
      this.lists = []
      Trello.boards.get(id + '/lists',{cards: 'open'}, function(res) {
        res.map( l => {
          let list = {}
          list.id = l.id
          list.name = l.name
          list.cards = l.cards
          switch (list.name)
          {
            case '問題面向':
            list.color = 'yellow darken-2'
            break
            case '問題細節':
            list.color = 'amber lighten-3'
            break
            case '解法':
            list.color = 'light-green darken-2'
            break
            case '回應':
            list.color = 'deep-orange lighten-1'
            break
            case '困難':
            list.color = 'red accent-1'
            break
            case '利害關係人':
            list.color = 'cyan darken-2'
            break
            case '資料/文件/連結':
            list.color = 'blue-grey lighten-4'
            break
            default:
            list.color = 'teal'
            break
          }
          list.cards.map(card => {
            if (card.desc != '') {
              let desc = JSON.parse(card.desc)
              card.desc = desc
            }
            card.color = list.color
            card.hover = false
          })
          that.lists.push(list)
        })
      })
    },
    getstageconfig: function() {
      let stagewidth = 2000
      let stageheight = 1000
      this.stageconfig = {
        width: stagewidth,
        height: stageheight
      }
    },
    adjustPoint: function(e){
      let p=[this.$refs.rect.getStage().getX() + this.$refs.rect.getStage().children[0].getWidth()/2, this.$refs.rect.getStage().getY() + this.$refs.rect.getStage().children[0].getHeight(), this.$refs.rect1.getStage().getX() + this.$refs.rect1.getStage().children[0].getWidth()/2, this.$refs.rect1.getStage().getY()];
      this.$refs.arrow.getStage().setPoints(p);
    }
  }
}
</script>

<style>
body {
  overflow: auto
}
</style>
