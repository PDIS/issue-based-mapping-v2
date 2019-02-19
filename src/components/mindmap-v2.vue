<template>
  <div style="width: 100%; height: 100%">
    <v-container grid-list-md>
      <v-layout row>
        <v-flex xs9>
          <v-card flat class="mt-1">
            <v-card-text>
              <div class="headline"># {{board.name}} 
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex md12>
          <v-tabs v-model="tab" left class="mt-2">
            <v-tabs-slider color="indigo"></v-tabs-slider>
            <v-tab href="#tab-2" style="font-size: 1.2rem" :to="{name:'board', params:{id:board.id}}">
              議題分析表
            </v-tab>
            <v-tab href="#tab-1" style="font-size: 1.2rem">
              心智圖
            </v-tab>
          </v-tabs>
        </v-flex>
        <!-- <v-flex md12>
          <v-btn-toggle v-model="mouseMode">
            <v-btn flat>
              <v-icon>pan_tool</v-icon>
            </v-btn>
            <v-btn flat>
              <v-icon>select_all</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-flex> -->
      </v-layout>
    </v-container>
    <canvas id="mindmap"></canvas>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';
import card from './forms/card'
import UploadButton from 'vuetify-upload-button';

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
  components: {
    'form-card': card,
    'upload-btn': UploadButton
  },
  data() {
    return {
      lists: [],
      tab: 'tab-1',
      mouseMode: 0
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
        height: window.innerHeight
      });
      this.lists.map( list => {
        list.cards.map( card => {
          let count = 0
          let newCardname = ''
          let fontSize = 16
          let element = []
          let height = (card.desc.stakeholders.length + card.desc.evidences.length) / 2 * 20 + 170
          let rect = new fabric.Rect({
            width: 155,
            height: height,
            fill: 'white' ,
            stroke : 'rgba(0,0,0,0.6)',
            strokeWidth : 0.25,
            originX: 'center',
            originY: 'center',
          });
          let shadow = {
            color: 'rgba(0,0,0,0.6)',
            blur: 20,    
            offsetX: 5,
            offsetY: 5,
            opacity: 0.1,
            fillShadow: true, 
            strokeShadow: true 
          }
          rect.setShadow(shadow);
          for (let i = 1; i < card.name.length + 1 ; i++) {
            if (i % 8 == 0) {
              newCardname += card.name.substring(count , i) + ' ' 
              count = i
            } else if (i == card.name.length) {
              newCardname += card.name.substring(count , i) 
            }
          }
          let text = new fabric.Textbox( newCardname, {
            textAlign: 'justify-left',
            fill:'rgba(0,0,0,100)',
            fontSize: fontSize,
            originX: 0.5,
            originY: 0.4,
            fontFamily:  "Roboto, 'Noto Sans TC'" ,
            fixedWidth: 155
          });
          let category = new fabric.Textbox( list.name, {
            textAlign: 'left',
            fontSize: 18,
            left: -65,
            top: -75 - (card.desc.stakeholders.length + card.desc.evidences.length) / 2 * 10,
            fontFamily:  "Roboto, 'Noto Sans TC'" ,
            fixedWidth: 100,
            maxLines: 2
          });
          let divider = new fabric.Rect({
            width: 155,
            height: 5,
            fill: card.color ,
            left: -79,
            top: -45 - (card.desc.stakeholders.length + card.desc.evidences.length) / 2 * 10,
          });
          element.push(rect)
          element.push(text)
          element.push(category)
          element.push(divider)
          let tagsCounter = 1
          let offsetX = 0
          let offsetY = 0
          card.desc.stakeholders.map( s => {
            if (tagsCounter % 2 == 0) {
              offsetX = 80
            } else {
              offsetX = 0
              offsetY++
            }
            let stakeholder = new fabric.Textbox( s.name, {
              textAlign: 'left',
              fontSize: 14,
              left: -65 + offsetX,
              top: 45 + offsetY * 20,
              backgroundColor: '#D2B4DE',
              fontFamily:  "Roboto, 'Noto Sans TC'" ,
            });
            element.push(stakeholder)
            tagsCounter++
          })
          card.desc.evidences.map( e => {
            if (tagsCounter % 2 == 0) {
              offsetX = 80
            } else {
              offsetX = 0
              offsetY++
            }
            let evidence = new fabric.Textbox( e.name, {
              textAlign: 'left',
              fontSize: 14,
              left: -65 + offsetX,
              top: 45 + offsetY * 20,
              backgroundColor: '#CFD8DC',
              fontFamily:  "Roboto, 'Noto Sans TC'" ,
            });
            element.push(evidence)
            tagsCounter++
          })
          let group = new fabric.Group(element, {
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
      canvas.on('mouse:wheel', function(opt) {
        let delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom = zoom - delta/2000;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      })
      canvas.on('mouse:down:before', function(opt) {
        var evt = opt.e;
        if (evt.button != 0) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      })
      canvas.on('mouse:move', function(opt) {
        if (this.isDragging) {
          var e = opt.e;
          this.viewportTransform[4] += e.clientX - this.lastPosX;
          this.viewportTransform[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
      canvas.on('mouse:up:before', function(opt) {
        this.isDragging = false;
        this.selection = true;
      });
    },
  },
  mounted: function() {

  },
  created: function() {
    this.getcards().then( () => this.draw() )
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
    ...mapBoardFields({
      board: 'board',
    }),
  }
}
</script>

<style>
.canvas-container {
  position: fixed !important
}
</style>
