<template>
  <div style="width: 100%; height: 100%">
    <canvas id="mindmap"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [],
    }
  },
  methods: {
    getcards: async function() {
      this.lists = []
      let id = this.$route.params.id
      let listarray = await Trello.boards.get(id + '/lists',{cards: 'open'})
      listarray.map( await (l => {
        if (l.name != '利害關係人' && l.name != '佐證文件' && l.name != '專有名詞字典') {
          let list = {}
          list.id = l.id
          list.name = l.name
          list.cards = l.cards
          switch (list.name)
          {
            case '問題面向':
            list.color = '#FFCD13'
            list.column = 1
            break
            case '問題細節':
            list.color = '#FFE276'
            list.column = 2
            break
            case '現有解法':
            list.color = '#91AD70'
            list.column = 3
            break
            case '政府回應':
            list.color = '#F08B8B'
            list.column = 4
            break
            case '困難':
            list.color = '#C85938'
            list.column = 5
            break
            case '利害關係人':
            list.color = '#0097A7'
            list.column = 6
            break
            case '佐證文件':
            list.color = '#CFD8DC'
            list.column = 7
            break
            default:
            list.color = 'teal'
            break
          }
          list.cards.map( async (card) => {
            let desc = JSON.parse(card.desc)
            card.desc = desc
            card.color = list.color
            card.column = list.column
            card.showexplain = false
            card.hover = false
            card.tagsfrom = []
            card.tagsto = []
            card.desc.stakeholders.map( async (personid) => {
              let person = await Trello.cards.get(personid)
              card.tagsfrom.push(person.name)
            })
            card.attachments = []
            card.desc.evidences.map( async (attachid) => {
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
    },
    draw: function() {
      let canvas = new fabric.Canvas('mindmap',{
        width: window.innerWidth,
        height: window.innerHeight - 64
      });
      this.lists.map( list => {
        list.cards.map( card => {
          let count = 0
          let newCardname = ''
          let fontSize = 18
          let rect = new fabric.Rect({
            width: 155,
            height: 170,
            fill: '#FBF0D3' ,
            /* stroke : 'black',
            strokeWidth : 1, */
            originX: 'center',
            originY: 'center',
          });
          if (card.name.length < 6) {
            newCardname = card.name
            fontSize = 28
          }
          else {
            for (let i = 1; i < card.name.length + 1 ; i++) {
              if (i % 6 == 0) {
                newCardname += card.name.substring(count , i) + ' ' 
                count = i
              } else if (i == card.name.length) {
                newCardname += card.name.substring(count , i) 
              }
            }
          }
          let text = new fabric.Textbox( newCardname, {
            textAlign: 'center',
            fontSize: fontSize,
            originX: 'center',
            originY: 0.3,
            fontFamily:  "Roboto, 'Noto Sans TC'" ,
            fixedWidth: 100
          });
          let category = new fabric.Textbox( list.name, {
            textAlign: 'left',
            fontSize: 14,
            left: -65,
            top: -65,
            backgroundColor: card.color,
            fontFamily:  "Roboto, 'Noto Sans TC'" ,
            fixedWidth: 100,
            maxLines: 2
          });
          let group = new fabric.Group([ rect, text, category ], {
            id: card.id,
            left: card.desc.x,
            top: card.desc.y,
            hasControls: false,
            borderColor: 'gray',
          });
          group.on('moved', e => {
            card.desc.x = e.target.left
            card.desc.y = e.target.top
            Trello.put('cards/' + card.id, {'idList': list.id,'desc': JSON.stringify(card.desc) } , () => {
            })
          })
          canvas.add(group)
        })
      })
      let moveHandler = evt => {
        let movingObject = evt.target;
        let x = movingObject.left + movingObject.width / 2;
        let y = movingObject.top + movingObject.height / 2;
        for (let i = 0; i < movingObject._objects.length; i++) {
          Trello.get('cards/' + movingObject._objects[i].id, res => {
            let desc = JSON.parse(res.desc)
            desc.x = x + movingObject._objects[i].left
            desc.y = y + movingObject._objects[i].top
            Trello.put('cards/' + movingObject._objects[i].id, {'desc': JSON.stringify(desc) } , () => {
            }) 
          })
        }
      };
      canvas.on('object:moved', moveHandler);
    },
  },
  mounted: function() {

  },
  created: function() {
    this.getcards().then( () => this.draw() )
  }
}
</script>

<style>

</style>
