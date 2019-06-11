<template>
  <div style="width: 100%; height: 100%">
    <v-container grid-list-md>
      <toolbar></toolbar>
    </v-container>
    <canvas id="canvas"></canvas>
    <form-card></form-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { createHelpers } from 'vuex-map-fields';
import card from '../components/forms/card'
import UploadButton from 'vuetify-upload-button';
import toolbar from '../components/toolbar'

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
    'upload-btn': UploadButton,
    toolbar,
  },
  data() {
    return {
      canvas: new fabric.Canvas('canvas')
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
            card.attachments = []
            /* card.desc.evidences.map( async (evidence) => {
              let attach = await Trello.cards.get(evidence.id,{fields: 'attachments',attachments: true})
              if (attach.attachments.length != 0) {
                attach.attachments.map( async (att) => {
                  let attachment = {}
                  attachment.name = att.name
                  attachment.url = att.url
                  card.attachments.push(attachment)
                })
              }
            }) */
          })
          this.lists.push(list)
        }
      }))
    },
    draw: function() {
      let that = this
      const REC_WIDTH = 155;
      const REC_HEIGHT = 155;
      const TRI_WIDTH = 15;
      const TRI_HEIGHT = 15;
      this.canvas.dispose()
      this.canvas = new fabric.Canvas('canvas')
      this.canvas.setHeight(window.innerHeight);
      this.canvas.setWidth(window.innerWidth);
      this.lists.map( list => {
        if (list.name != '利害關係人' && list.name != '佐證文件' && list.name != '專有名詞字典') {
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
              fill: card.categorycolor ,
              left: -79,
              top: -45 - (card.desc.stakeholders.length + card.desc.evidences.length) / 2 * 10,
            });
            
            element.push(rect)
            element.push(text)
            element.push(category)
            element.push(divider)
            let offsetX = 0
            let offsetY = 0
            let lastTagLength = 0
            card.desc.stakeholders.map( async s => {
              let data = await fetch("https://improxy.pdis.nat.gov.tw/getcard/" + s.id)
              let res = await data.json()
              let tagLength = res.name.length
              if (tagLength + lastTagLength > 10) {
                offsetY++
              }
              lastTagLength = tagLength
/*               if (tagsCounter % 2 == 0) {
                offsetX = 80
              } else {
                offsetX = 0
                offsetY++
              } */
              let stakeholder = new fabric.Textbox( res.name, {
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
            card.desc.evidences.map( async e => {
              let data = await fetch("https://improxy.pdis.nat.gov.tw/getcard/" + e.id)
              let res = await data.json()
              let tagLength = res.name.length
              if (tagLength + lastTagLength > 10) {
                offsetY++
              }
              lastTagLength = tagLength
              /* if (tagsCounter % 2 == 0) {
                offsetX = 80
              } else {
                offsetX = 0
                offsetY++
              } */
              let evidence = new fabric.Textbox( res.name, {
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
              name: card.name,
              left: card.desc.x,
              top: card.desc.y,
              hasControls: false,
              hasRotatingPoint: false,
              borderColor: 'gray',
              card: card,
            });
            group.on('moved', e => {
              card.desc.x = e.target.left
              card.desc.y = e.target.top
              /* Trello.put('cards/' + card.id, {'idList': list.id,'desc': JSON.stringify(card.desc) } , () => {
              }) */
              fetch("https://improxy.pdis.nat.gov.tw/editcard/", {
                method: "PUT",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(card)
              })
            })
            group.on('mousedblclick', e => {
              that.editcard(card)
            })
            that.canvas.add(group)
          })
        }
      })
      fabric.Canvas.prototype.getItemByName = function(name) {
        let object = null,
            objects = this.getObjects();
        for (let i = 0, len = this.size(); i < len; i++) {
          if (objects[i].name && objects[i].name === name) {
            object = objects[i];
            break;
          }
        }
        return object;
      };
      this.lists.map( list => {
        if (list.name != '利害關係人' && list.name != '佐證文件' && list.name != '專有名詞字典') {
          list.cards.map( card => {
            let start = that.canvas.getItemByName(card.name)
            if (card.desc.related.length != 0) {
              card.desc.related.map( async r => {
                let data = await fetch("https://improxy.pdis.nat.gov.tw/getcard/" + r.id)
                let res = await data.json()
                let end = that.canvas.getItemByName(res.name)
                addChildLine(start, end)
              })
            }
            addButton(start)
          })
        }
      })
      function addButton(start) {
        let center = start.getCenterPoint()
        fabric.Image.fromURL('http://www.pngmart.com/files/8/Plus-Transparent-Images-PNG.png', function(myImg) {
          //i create an extra var for to change some image properties
          var img1 = myImg.set({
            name:'button', 
            left: center.x + REC_WIDTH / 2.3, 
            top: center.y ,
            width: 1000,
            height: 1000,
            fromObject: start,
            hoverCursor: "pointer"
            });
          img1.scaleToHeight(30);
          img1.scaleToWidth(30);
          img1.selectable = false,
          img1.on('mousedown', e => {
            that.newcard(start.card)
          })
          that.canvas.add(img1)
          start.addChild = start.addChild || {};
          start.addChild.button = start.addChild.button || [];
          start.addChild.button.push(img1);
        });
      }

      function calcArrowAngle(x1, y1, x2, y2) {
        let angle = 0, x, y;
        x = (x2 - x1);
        y = (y2 - y1);
        if (x === 0) {
          angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
        } else if (y === 0) {
          angle = (x > 0) ? 0 : Math.PI;
        } else {
          angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
        }
        return (angle * 180 / Math.PI + 90);
      }
      function addChildLine(start, end) {
        that.canvas.off('object:selected', addChildLine);
        // add the line
        var fromObject = start;
        var toObject = end;
        var from = fromObject.getCenterPoint();
        var to = toObject.getCenterPoint();
        var fromX = from.x;
        var fromY = from.y;
        var toX = to.x;
        var toY = to.y;

        // var disX = REC_WIDTH/2 + TRI_WIDTH/2;
        // var disY = REC_HEIGHT/2 + TRI_HEIGHT/2;

        //var distanceX, distanceY;

        //calibrateLine(fromX, fromY, toX, toY);

        var calibrateX = REC_WIDTH/2 + TRI_WIDTH/2;
        var calibrateY = REC_HEIGHT/2 + TRI_HEIGHT/2;

        var distanceX, distanceY;

        if (fromX < toX) {
            distanceX = toX - fromX;
        } else {
            distanceX = fromX - toX;
        }

        if (fromY < toY) {
            distanceY = toY - fromY;
        } else {
            distanceY = fromY - toY;
        }

        if (distanceX > distanceY) {

            if(fromX < toX) {
                toX -= calibrateX;
            } else {
                toX += calibrateX;
            }
        } else {
            if (fromY < toY) {
                toY -= calibrateY;
            } else {
                toY += calibrateY;
            }
        }

        var line = new fabric.Line([fromX, fromY, toX, toY], {
            fill: 'black',
            stroke: 'black',
            strokeWidth: 3,
            selectable: false,
            fromObject: fromObject,
            toObject: toObject,
        });

        // leftover code that we might need but probably not
        /*
        centerX = (from.x + to.x)/2;
        centerY = (from.y + to.y)/2;
        deltaX = line.left - centerX;
        deltaY = line.top - centerY;
        */

        line.triangle = new fabric.Triangle({
            left: line.x2,
            top: line.y2,
            angle: calcArrowAngle(line.x1, line.y1, line.x2, line.y2),
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            pointType: 'arrow_start',
            width: TRI_WIDTH,
            height: TRI_HEIGHT,
            fill: 'black',
            selectable: false,
        });

      // var Group = new fabric.Group([line, line.triangle]);
      // canvas.add(Group);

        that.canvas.add(line, line.triangle);

        // so that the line is behind the connected shapes
        line.sendToBack();

        // add a reference to the line to each object
        fromObject.addChild = fromObject.addChild || {};
        fromObject.addChild.lines = fromObject.addChild.lines || [];
        fromObject.addChild.lines.push(line);
        toObject.addChild = toObject.addChild || {};
        toObject.addChild.lines = toObject.addChild.lines || [];
        toObject.addChild.lines.push(line);
        
        // to remove line references when the line gets removed
        line.addChildRemove = function() {
            fromObject.addChild.lines.forEach(function(e, i, arr) {
                if (e === line)
                    arr.splice(i, 1);
            });
        };

        // undefined instead of delete since we are anyway going to do this many times
        that.canvas.addChild = undefined;
    }

    function addChildMoveLine(event) {
      that.canvas.on(event, function(options) {
        var object = options.target;
        // udpate lines (if any)
        for (let i = 0; i < object._objects.length; i++) {
          if (object._objects[i].addChild && object._objects[i].addChild.lines) {
            object._objects[i].addChild.lines.forEach( line => {
              if (line.fromObject.group != undefined && line.toObject.group != undefined) {
                line.fromObject.group._objects.map(obj1 => {
                  line.toObject.group._objects.map(obj2 => {
                    if (line.fromObject.id == obj1.id && line.toObject.id == obj2.id) {
                      var fcenter = line.fromObject.group.getCenterPoint(),
                          fx = fcenter.x + obj1.getCenterPoint().x,
                          fy = fcenter.y + obj1.getCenterPoint().y,
                          tcenter = line.toObject.group.getCenterPoint(),
                          tx = tcenter.x + obj2.getCenterPoint().x,
                          ty = tcenter.y + obj2.getCenterPoint().y,
                          xdis = REC_WIDTH/2 + TRI_WIDTH/2,
                          ydis = REC_HEIGHT/2 + TRI_HEIGHT/2,
                          horizontal = Math.abs(tx - line.x1) > Math.abs(ty - line.y1)
                      line.set({
                          'x1': fx,
                          'y1': fy,
                          'x2': tx + xdis * (horizontal ? (tx < line.x1 ? 1 : -1) :                       0),
                          'y2': ty + ydis * (horizontal ?                       0 : (ty < line.y1 ? 1 : -1)),
                      });
                      line.triangle.set({
                          'left': line.x2, 'top': line.y2,
                          'angle': calcArrowAngle(line.x1, line.y1, line.x2, line.y2)
                      });
                    }
                  })
                })
              } else if (line.fromObject.group == undefined) {
                line.toObject.group._objects.map(obj => {
                  if (line.toObject.id == obj.id) {
                    var fcenter = line.fromObject.getCenterPoint(),
                        fx = fcenter.x,
                        fy = fcenter.y,
                        tcenter = line.toObject.group.getCenterPoint(),
                        tx = tcenter.x + obj.getCenterPoint().x,
                        ty = tcenter.y + obj.getCenterPoint().y,
                        xdis = REC_WIDTH/2 + TRI_WIDTH/2,
                        ydis = REC_HEIGHT/2 + TRI_HEIGHT/2,
                        horizontal = Math.abs(tx - line.x1) > Math.abs(ty - line.y1)
                    line.set({
                        'x1': fx,
                        'y1': fy,
                        'x2': tx + xdis * (horizontal ? (tx < line.x1 ? 1 : -1) :                       0),
                        'y2': ty + ydis * (horizontal ?                       0 : (ty < line.y1 ? 1 : -1)),
                    });
                    line.triangle.set({
                        'left': line.x2, 'top': line.y2,
                        'angle': calcArrowAngle(line.x1, line.y1, line.x2, line.y2)
                    });
                  }
                })
              } else if (line.toObject.group == undefined) {
                line.fromObject.group._objects.map(obj => {
                  if (line.fromObject.id == obj.id) {
                    var fcenter = line.fromObject.group.getCenterPoint(),
                        fx = fcenter.x + obj.getCenterPoint().x,
                        fy = fcenter.y + obj.getCenterPoint().y,
                        tcenter = line.toObject.getCenterPoint(),
                        tx = tcenter.x,
                        ty = tcenter.y,
                        xdis = REC_WIDTH/2 + TRI_WIDTH/2,
                        ydis = REC_HEIGHT/2 + TRI_HEIGHT/2,
                        horizontal = Math.abs(tx - line.x1) > Math.abs(ty - line.y1)
                    line.set({
                        'x1': fx,
                        'y1': fy,
                        'x2': tx + xdis * (horizontal ? (tx < line.x1 ? 1 : -1) :                       0),
                        'y2': ty + ydis * (horizontal ?                       0 : (ty < line.y1 ? 1 : -1)),
                    });
                    line.triangle.set({
                        'left': line.x2, 'top': line.y2,
                        'angle': calcArrowAngle(line.x1, line.y1, line.x2, line.y2)
                    });
                  }
                })
              }
            });
          } else if (object.addChild && object.addChild.lines) {
            object.addChild.lines.forEach( line => {
              var fcenter = line.fromObject.getCenterPoint(),
                  fx = fcenter.x,
                  fy = fcenter.y,
                  tcenter = line.toObject.getCenterPoint(),
                  tx = tcenter.x,
                  ty = tcenter.y,
                  xdis = REC_WIDTH/2 + TRI_WIDTH/2,
                  ydis = REC_HEIGHT/2 + TRI_HEIGHT/2,
                  horizontal = Math.abs(tx - line.x1) > Math.abs(ty - line.y1)
              line.set({
                  'x1': fx,
                  'y1': fy,
                  'x2': tx + xdis * (horizontal ? (tx < line.x1 ? 1 : -1) :                       0),
                  'y2': ty + ydis * (horizontal ?                       0 : (ty < line.y1 ? 1 : -1)),
              });
              line.triangle.set({
                  'left': line.x2, 'top': line.y2,
                  'angle': calcArrowAngle(line.x1, line.y1, line.x2, line.y2)
              });
            });
          } 
          if (object._objects[i].addChild && object._objects[i].addChild.button) {
            object._objects[i].addChild.button.forEach( button => {
              button.fromObject.group._objects.map(obj => {
                if (button.fromObject.id == obj.id) {                    
                  var fcenter = button.fromObject.group.getCenterPoint()
                  button.set({ left: fcenter.x + obj.getCenterPoint().x + REC_WIDTH / 2.3, top: fcenter.y  + obj.getCenterPoint().y}) 
                }
              })
            });
          } else if (object.addChild && object.addChild.button) {
            object.addChild.button.forEach( button => {
              var fcenter = button.fromObject.getCenterPoint()
              button.set({ left: fcenter.x + REC_WIDTH / 2.3, top: fcenter.y})
            });
          }
        }
        that.canvas.renderAll();
      });
    }

      let moveHandler = async evt => {
        let movingObject = evt.target;
        let x = movingObject.left + movingObject.width / 2;
        let y = movingObject.top + movingObject.height / 2;
        for (let i = 0; i < movingObject._objects.length; i++) {
          if ( movingObject._objects[i].id != undefined) {
            let data = await fetch("https://improxy.pdis.nat.gov.tw/getcard/" + movingObject._objects[i].id)
            let res = await data.json()
            res.desc = JSON.parse(res.desc)
            res.desc.x = x + movingObject._objects[i].left
            res.desc.y = y + movingObject._objects[i].top
            fetch("https://improxy.pdis.nat.gov.tw/editcard/", {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(res)
            })
           /*  Trello.get('cards/' + movingObject._objects[i].id, res => {
              let desc = JSON.parse(res.desc)
              desc.x = x + movingObject._objects[i].left
              desc.y = y + movingObject._objects[i].top
              Trello.put('cards/' + movingObject._objects[i].id, {'desc': JSON.stringify(desc) } , () => {
              }) 
            }) */
          }
        }
      };
      ['object:moving'].forEach(addChildMoveLine);

      that.canvas.on('object:moved', moveHandler);
      that.canvas.on('mouse:wheel', function(opt) {
        let delta = opt.e.deltaY;
        let pointer = that.canvas.getPointer(opt.e);
        let zoom = that.canvas.getZoom();
        zoom = zoom - delta/2000;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        that.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      })
      that.canvas.on('mouse:down:before', function(opt) {
        let evt = opt.e;
        if (evt.button != 0) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      })
      that.canvas.on('mouse:move', function(opt) {
        if (this.isDragging) {
          let e = opt.e;
          this.viewportTransform[4] += e.clientX - this.lastPosX;
          this.viewportTransform[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
      that.canvas.on('mouse:up:before', function(opt) {
        this.isDragging = false;
        this.selection = true;
        let objects = this.getObjects();
        for (let i = 0; i < objects.length; i++){
          objects[i].setCoords();
        }
      });
      that.canvas.renderAll.bind(that.canvas)
    },
    newcard: function (start) {
      let that = this
      this.lists.map(list => {
        if (start.listname == '問題面向') {
          if (list.name == '問題細節') {
            that.selectedlist = list
          }
        } else if (start.listname == '問題細節') {
           if (list.name == '現有解法') {
            that.selectedlist = list
          }
        } else if (start.listname == '現有解法') {
           if (list.name == '政府回應') {
            that.selectedlist = list
          }
        } else if (start.listname == '政府回應') {
           if (list.name == '困難') {
            that.selectedlist = list
          }
        }
      })
      this.cardFrom = start
      this.opencard = true; 
      this.editable = false
      this.resetForm()
      if (this.selectedlist.name == '政府回應') {
        if (this.card.desc.responsetime == 'nowadays') {
          this.card.name = '[現在]'
        } else {
          this.card.name = '[未來]'
        }
      }
      this.getrelated(this.selectedlist)
    },
    getrelated: function(currentlist) {
      this.relatedlist = []
      this.lists.map(list => {
        if (currentlist.name == '問題面向') {
          if (list.name == '問題細節') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name,
                'desc': data.desc
              })
            })
          }
        } else if (currentlist.name == '問題細節') {
           if (list.name == '現有解法') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name,
                'desc': data.desc
              })
            })
          }
        } else if (currentlist.name == '現有解法') {
           if (list.name == '政府回應') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name,
                'desc': data.desc
              })
            })
          }
        } else if (currentlist.name == '政府回應') {
           if (list.name == '困難') {
            list.cards.map( data => {
              this.relatedlist.push({
                'id': data.id,
                'name': data.name,
                'desc': data.desc
              })
            })
          }
        }
      })
    },
    editcard: function(card) {
      let that = this
      this.lists.map(list => {
        if (card.listname === list.name) {
          that.selectedlist = list
        }
      })
      this.opencard = true
      this.card.id = card.id
      this.card.name = card.name
      this.card.desc.responsetime = card.desc.responsetime
      this.card.desc.data = card.desc.data
      this.card.desc.related = card.desc.related
      this.card.desc.explain = card.desc.explain
      this.card.desc.role = card.desc.role
      this.card.desc.department = card.desc.department
      this.card.desc.background = card.desc.background
      this.card.desc.stakeholders = card.desc.stakeholders
      this.card.desc.evidences = card.desc.evidences
      this.card.desc.attachment = card.desc.attachment 
      this.card.desc.x = card.desc.x
      this.card.desc.y = card.desc.y
      this.card.attachments = card.attachments
      this.editable = true
      this.getrelated(this.selectedlist)
    },
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
      relatedlist: 'relatedlist',
      deleteCard: 'deleteCard',
      deletedID: 'deletedID',
      attachsnackbar: 'attachsnackbar',
      cardFrom: 'cardFrom',
    }),
    ...mapListFields({
      lists: 'lists',
      stakeholders: 'stakeholders',
      evidences: 'evidences',
      stakeholderList: 'stakeholderList',
      evidenceList: 'evidenceList',
    })
  },
  watch: {
    lists: function() {
      let canvas = this.canvas
      canvas.clear()
      this.draw()
    }
  }
}
</script>

<style>
.canvas-container {
  position: fixed !important
}
</style>
