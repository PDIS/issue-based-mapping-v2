<template>
  <div class="drag-container">
    <ul class="drag-list">
      <li v-for="stage in stages" class="drag-column" :class="{['drag-column-' + stage.id]: true}" :key="stage.id">
        <span class="drag-column-header">
          <h2>{{ stage.name }}</h2>
        </span>
        <div class="drag-options"></div>
        <ul class="drag-inner-list" ref="list" :data-status="stage.id">
          <li class="drag-item" v-for="block in stage.blocks" :data-block-id="block.id" :key="block.id">
              <slot :name="block.id">
                  <strong>{{ block.name }}</strong>
                  
              </slot>
          </li>
        </ul>
      </li>
    </ul>
    <v-card-title primary-title style="height:5em">
          <div>
            <h3 class="headline mb-0"><v-icon>assignment</v-icon>{{board.title}}</h3>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height:10em">
            <div class="body-2"><v-icon>assignment</v-icon>提案名稱:{{board.desc.title}}</div>
            <div class="body-2">提案人:{{board.desc.person}}</div>
            <div class="body-2">日期:{{board.desc.date}}</div>
        </v-card-text>
  </div>
</template>

<script>
import dragula from 'dragula';
export default {
  data() {
    return {
      stages: [],
      blocks: [],
      board: {}
    }
  },
  computed: {
    localBlocks() {
      return this.blocks;
      },
    },

  methods: {
    getBlocks(id) {
      this.localBlocks.filter(block => {
        block.idList === id
      });
    },
  },

  updated : function() {
    console.log(this.$refs.list)
    dragula(this.$refs.list)
        .on('drag', (el) => {
          console.log(el)
          el.classList.add('is-moving');
        })
        .on('drop', (block, list) => {
          let index = 0;
          for (index = 0; index < list.children.length; index += 1) {
            if (list.children[index].classList.contains('is-moving')) break;
          }
          this.$emit('update-block', block.dataset.blockId, list.dataset.status, index);
        })
        .on('dragend', (el) => {
          el.classList.remove('is-moving');

          window.setTimeout(() => {
            el.classList.add('is-moved');
            window.setTimeout(() => {
              el.classList.remove('is-moved');
            }, 600);
          }, 100);
        });
  },
  created: function() {
    let that = this;
    this.board.id = '5ae1a0112d6448380e98e341'
    Trello.boards.get(this.board.id, function(res) {
      that.board.name = res.name
      if (res.desc != '') {
        that.board.desc = JSON.parse(res.desc)
      }
    })
    Trello.boards.get(this.board.id + '/lists',{cards: 'open'}, function(res) {
      res.map( l => {
        let stage = {}
        stage.id = l.id
        stage.name = l.name
        stage.blocks = l.cards
        switch (stage.name)
        {
          case '資料/文件/連結':
          stage.color = 'blue'
          break
          case '問題面向':
          stage.color = 'yellow'
          break
          case '問題細節':
          stage.color = 'yellow lighten-3'
          break
          case '解法':
          stage.color = 'green'
          break
          case '回應':
          stage.color = 'orange'
          break
          case '困難':
          stage.color = 'pink'
          break
          case '利害關係人':
          stage.color = 'blue darken-4'
          break
          default:
          stage.color = 'teal'
          break
        }
        that.stages.push(stage)
      })
      //console.log(that.stages)
    })
  }
}
</script>

<style lang="scss">
  @import '../assets/kanban.scss';
      $on-hold: #FB7D44;
    $in-progress: #2A92BF;
    $needs-review: #F4CE46;
    $approved: #00B961;

    * {
    	box-sizing: border-box;
    }

    body {
    	background: #33363D;
    	color: white;
    	font-family: 'Lato';
    	font-weight: 300;
    	line-height: 1.5;
    	-webkit-font-smoothing: antialiased;
    }

    .drag-column {
        &-on-hold {
            .drag-column-header,
            .is-moved,
            .drag-options {
                background: $on-hold;
            }
        }

        &-in-progress {
            .drag-column-header,
            .is-moved,
            .drag-options {
                background: $in-progress;
            }
        }

        &-needs-review {
            .drag-column-header,
            .is-moved,
            .drag-options{
                background: $needs-review;
            }
        }

        &-approved {
            .drag-column-header,
            .is-moved,
            .drag-options {
                background: $approved;
            }
        }
    }

    .section {
    	padding: 20px;
    	text-align: center;

    	a {
    		color: white;
    		text-decoration: none;
    		font-weight: 300;
    	}

    	h4 {
    		font-weight: 400;
    		a {
    			font-weight: 600;
    		}
    	}
    }
</style> 