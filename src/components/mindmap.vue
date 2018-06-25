<template>
  <v-stage :config="getstageconfig()">
    <v-layer>
      <v-group v-for="(list, y) in lists" :key="list.id">
        <v-group v-for="(card, x) in list.cards" :ref="card.id" :key="card.id" @dragmove="adjustPoint(card.id)" @dragend="add(card,list)" :config="getgroupconfig(card)">
          <v-rect :config="getrectconfig(card)"></v-rect>
          <v-text :config="gettextconfig(card)"></v-text>
        </v-group>
      </v-group>
      <v-arrow v-for="arrow in arrows" :key="arrow" ref="arrow" :config="arrowconfig[arrow]"></v-arrow>
    </v-layer>
  </v-stage>
</template>

<script>
export default {
  data() {
    return {
      lists: [],
      arrows: 0,
      arrowconfig: [],
    }
  },
  created: function() {
    this.getcards()
  },
  mounted: function() {
    let that = this
    setTimeout( () => {
      that.lists.map(l => {
        l.cards.map(c => {
          if (c.desc.related != undefined) {
            if (c.desc.related.length != 0) {
              c.desc.related.map( r => {
                that.arrows++
                that.getarrowconfig(c.id,r)
              })
            }
          }
        })
      })
    }, 1000)
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
      let stageheight = window.innerHeight - 64
      return {
        width: stagewidth,
        height: stageheight,
        draggable: true
      }
    },
    getgroupconfig: function(card) {
      return {
        x: card.desc.x,
        y: card.desc.y,
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
    getarrowconfig: function(c,r) {
      let startpoint = this.$refs[c][0].getStage()
      let endpoint = this.$refs[r][0].getStage()
      let startpointx = startpoint.getX() + startpoint.children[0].getWidth()/2
      let startpointy = startpoint.getY() + startpoint.children[0].getHeight()
      let endpointx = endpoint.getX() + endpoint.children[0].getWidth()/2
      let endpointy = endpoint.getY()
      this.arrowconfig[this.arrows] = {
        name: c + ',' + r,
        fill: 'black',
        points: [startpointx,startpointy,endpointx,endpointy],
        stroke: 'black',
        strokeWidth: 4,
      }
    },
    adjustPoint: function(id){
      let point = this.$refs[id][0].getStage()
      this.$refs.arrow.map(a => {
        let ids = a.getStage().getName().split(',')
        if (id == ids[0]) {
          let p = [point.getX() + point.children[0].getWidth()/2,point.getY() + point.children[0].getHeight(),a.getStage().getPoints()[2],a.getStage().getPoints()[3]]
          a.getStage().setPoints(p)
        } else if (id == ids[1]) {
          let p = [a.getStage().getPoints()[0],a.getStage().getPoints()[1],point.getX() + point.children[0].getWidth()/2,point.getY()]
          a.getStage().setPoints(p)
        }       
      })
    },
    add: function(card,list) {
      card.desc.x = this.$refs[card.id][0].getStage().getX()
      card.desc.y = this.$refs[card.id][0].getStage().getY()
      Trello.put('cards/' + card.id, {'idList': list.id,'desc': JSON.stringify(card.desc) } , function() {
      })
    }
  },
}
</script>

<style scoped>
body {
  overflow: hidden;
}

</style>
