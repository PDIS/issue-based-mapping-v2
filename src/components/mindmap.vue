<template>
<div>
   <v-btn
              absolute
              dark
              fab
              bottom
              right
              color="pink"
              style="bottom:1em"
            >
              <v-icon>add</v-icon>
            </v-btn>
  <v-stage :config="getstageconfig()">
    <v-layer>
      <v-group v-for="list in lists" :key="list.id">
        <v-group v-for="card in list.cards" :ref="card.id" :key="card.id" @dragmove="adjustPoint(card.id)" @dragend="changeposition(card,list)" :config="getgroupconfig(card)">
          <v-rect :config="getrectconfig(card)"></v-rect>
          <v-text :config="gettextconfig(card)"></v-text>
          <v-group v-for="(person,i) in card.tags" :key="person">
            <v-tag :config="gettagconfig(person,i)"></v-tag>
            <v-text :config="gettagtextconfig(person,i)"></v-text>
          </v-group>
          <v-group v-for="(attachment, j) in card.attachments" :key="attachment.name" @mouseup="viewattachment(attachment)" @mouseover="changecursor(true)" @mouseout="changecursor(false)">
            <v-tag :config="gettagconfig(attachment.name, j, card.tags)"></v-tag>
            <v-text :config="gettagtextconfig(attachment.name, j, card.tags)"></v-text>
          </v-group>
        </v-group>
      </v-group>
      <v-arrow v-for="arrow in arrows" :key="arrow" ref="arrow" :config="arrowconfig[arrow]"></v-arrow>
    </v-layer>
  </v-stage>
</div>
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
        if (l.name != '利害關係人' && l.name != '資料/文件/連結') {
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
            card.tags = []
            card.desc.people.map( async (personid) => {
              let person = await Trello.cards.get(personid)
              card.tags.push(person.name)
            })
            card.attachments = []
            card.desc.data.map( async (attachid) => {
              let attach = await Trello.cards.get(attachid,{fields: 'attachments',attachments: true})
              if (attach.attachments.length != 0) {
                attach.attachments.map( async (att) => {
                  let attachment = {}
                  attachment.name = att.name
                  attachment.url = att.url
                  card.attachments.push(attachment)
                })
              }
            })
          })
          this.lists.push(list)
        }
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
      let tags = card.desc.people.length + card.desc.data.length
      if (tags < 2) { tags = 2 }
      return {
        fill: card.color,
        width: 180,
        height: 130 + ((tags - 2) * 30),
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
        fontSize: 18, 
        width: 180, 
        padding: 15, 
        fontFamily: 'Noto Sans TC' ,
        lineHeight: 1.5,
      }
    },
    gettagconfig: function(text, i, tags) {
      let textlength = text.length
      let tagslength = 0
      let j = 0
      let k = 0
      let color = '#0097A7'
      if (tags != undefined) {
        tagslength = tags.length
        color = '#CFD8DC'
        if (tagslength + i > 1) {
          j = (tagslength + i) / 2
        }
        k = (tagslength + i) % 2
      }
      else {
        k = (tagslength + i) % 2
      }
      return {
        x: 20 + k * 85,
        y: 100 + j * 30,
        width: 70,
        height: 20,
        fill: color,
        pointerDirection: 'left',
        pointerWidth: 10,
        pointerHeight: 20,
        lineJoin: 'round',
      }
    },
    gettagtextconfig: function(text, i, tags) {
      let textlength = text.length
      let tagslength = 0
      let j = 0
      let k = 0
      if (tags != undefined) {
        tagslength = tags.length
        if (tagslength + i > 1) {
          j = (tagslength + i) / 2
        }
        k = (tagslength + i) % 2
      }
      else {
        k = (tagslength + i) % 2
      }
      return {
        x: 25 + k * 85,
        y: 103 + j * 30,
        width: textlength * 15,
        text: text,
        fontSize: 12,
        fontFamily: 'Noto Sans TC',
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
    changeposition: function(card,list) {
      card.desc.x = this.$refs[card.id][0].getStage().getX()
      card.desc.y = this.$refs[card.id][0].getStage().getY()
      Trello.put('cards/' + card.id, {'idList': list.id,'desc': JSON.stringify(card.desc) } , function() {
      })
    },
    viewattachment: function(attachment) {
      window.open(attachment.url);
    },
    changecursor: function(mouseover) {
      if (mouseover) {
        document.body.style.cursor = 'pointer';
      }
      else {
        document.body.style.cursor = 'default';
      }
    }
  },
}
</script>

<style scoped>
body {
  overflow: hidden;
}

</style>
