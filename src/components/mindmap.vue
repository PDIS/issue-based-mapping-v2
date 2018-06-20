<template>
  <v-stage :config="getstageconfig()">
    <v-layer>
      <v-group v-for="(list, y) in lists" :key="list.id" :ref="list.id">
        <v-group v-for="(card, x) in list.cards" :key="card.id" :ref="card.id" @dragmove="adjustPoint()" :config="getgroupconfig(x,y)">
          <v-rect :config="getrectconfig(card)"></v-rect>
          <v-text :config="gettextconfig(card)"></v-text>
        </v-group>
      </v-group>
      <!-- <v-group ref="rect1" @dragmove="adjustPoint()" :config="{
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

      </v-arrow> -->
    </v-layer>
  </v-stage>
</template>

<script>
export default {
  data() {
    return {
      lists: [],
      groupconfig: {},
      arrowconfig: {},
    }
  },
  created: function() {
    this.getcards()
  },
  mounted: function() {
    /* this.arrowconfig = {fill: 'black',
        points: [this.$refs.rect.getStage().getX() + this.$refs.rect.getStage().children[0].getWidth()/2,this.$refs.rect.getStage().getY() + this.$refs.rect.getStage().children[0].getHeight(), this.$refs.rect1.getStage().getX() + this.$refs.rect1.getStage().children[0].getWidth()/2, this.$refs.rect1.getStage().getY()],
        stroke: 'black',
        strokeWidth: 4,
        draggable: true} */
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
            list.color = '#FBC02D'
            break
            case '問題細節':
            list.color = '#FFE082'
            break
            case '解法':
            list.color = '#689F38'
            break
            case '回應':
            list.color = '#F4511E'
            break
            case '困難':
            list.color = '#FF8A80'
            break
            case '利害關係人':
            list.color = '#0097A7'
            break
            case '資料/文件/連結':
            list.color = '#CFD8DC'
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
      let stagewidth = window.innerWidth
      let stageheight = window.innerHeight
      return {
        width: stagewidth,
        height: stageheight,
        draggable: true
      }
    },
    getgroupconfig: function(x,y) {
      return {
        x: 100 + x*150,
        y: 100 + y*150,
        draggable: true
      }
    },
    getrectconfig: function(card) {
      return {
        fill: card.color,
        width: 120,
        height: 70,
        shadowColor: 'black',
        shadowOffset: {
          x: 5,
          y: 5
        },
          shadowOpacity: 0.6
      }
    },
    gettextconfig: function(card) {
      return { 
        text: card.name, 
        fontSize: 15, 
        width: 120, 
        padding: 15, 
        fontFamily: 'Roboto,sans-serif' 
      }
    },
    adjustPoint: function(e){
      /* let p=[this.$refs.rect.getStage().getX() + this.$refs.rect.getStage().children[0].getWidth()/2, this.$refs.rect.getStage().getY() + this.$refs.rect.getStage().children[0].getHeight(), this.$refs.rect1.getStage().getX() + this.$refs.rect1.getStage().children[0].getWidth()/2, this.$refs.rect1.getStage().getY()];
      this.$refs.arrow.getStage().setPoints(p); */
    }
  }
}
</script>

<style scoped>
body {
  overflow: hidden;
}

</style>
