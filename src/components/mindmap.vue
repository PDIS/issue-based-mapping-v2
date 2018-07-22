<template>
  <v-stage :config="getstageconfig()">
    <v-layer>
      <v-group v-for="list in lists" :key="list.id">
        <v-group v-for="card in list.cards" :ref="card.id" :key="card.id" @dragmove="adjustPoint(card.id)" @dragend="changeposition(card,list)" :config="getgroupconfig(card)">
          <v-rect :config="getrectconfig(card)"></v-rect>
          <v-text :config="gettextconfig(card)"></v-text>
          <v-group v-for="person in card.desc.people" :key="person">
            <v-group v-for="label in labeltextconfig" :key="label.id">
              <v-tag :config="getlabelconfig()"></v-tag>
              <v-text :config="labeltextconfig[0]"></v-text>
            </v-group>
          </v-group>
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
      labeltextconfig: []
    }
  },
  created: function() {
    this.getcards()
    /* this.getlabeltextconfig() */
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
    getcards: async function() {
      this.lists = []
      let id = this.$route.params.id
      let listarray = await Trello.boards.get(id + '/lists',{cards: 'open'})
      listarray.map( await (l => {
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
        list.cards.map( async (card) => {
          let desc = JSON.parse(card.desc)
          card.desc = desc
          card.color = list.color
          card.hover = false
          let attach = await Trello.cards.get(card.id,{fields: 'attachments',attachments: true})
          if (attach.attachments.length != 0) {
            attach.attachments.map( async (att) => {
              let attachment = {}
              attachment.name = att.name
              attachment.url = att.url
              card.attachments = await att
            })
          }
        })
        this.lists.push(list)
      }))
      /* let that = this
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
      }) */
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
        width: 150,
        height: 100,
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
        width: 150, 
        padding: 15, 
        fontFamily: 'Roboto,sans-serif' 
      }
    },
    getlabelconfig: function() {
      return {
        x: 15,
        y: 70,
        width: 50,
        height: 20,
        fill: 'pink',
      }
    },
   /*  getlabeltextconfig: function(person) {
      Trello.cards.get(person, function(res) {
        return  {
          'x': 15,
          'y': 70,
          'text': res.name,

        } 
      })
    }, */
   /*  getlabeltextconfig: function() {
      let id = this.$route.params.id
      Trello.boards.get(id + '/lists',{cards: 'open'}, function(res) {
        res.map( l => {
          if (l.name == '利害關係人') {
            for (let i = 0; i < l.cards.length; i++ ) {
              this.labeltextconfig[i] = {
                x: 15,
                y: 70,
                text: l.cards[i].name,
                id: l.cards[i].id
              }
            }
          }
        })
      })
    }, */
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
    changeposition: function(card,list) {
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
