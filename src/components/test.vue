<template>
 <div>
    <input type="file" @change="onFileChange">
    <v-btn @click="upload()">上傳</v-btn>
    <div v-for="list in lists" :key="list.id">
      <div v-for="card in list.cards" :key="card.id">
         <v-container>
            <v-layout row wrap>
              <v-flex d-flex xs12>
                <div v-if="typeof(card.attachments) !== 'undefined'">
                    {{card.attachments.name}}        
                </div>
              </v-flex>
            </v-layout>
         </v-container>
      </div>
    </div>
 </div>
</template>

<script>
export default {
  data() {
    return {
      file: FormData,
      lists: []
    }
  },
  methods: {
    onFileChange: function(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      //this.createImage(files[0]);
      this.files = files[0]
      var formData = new FormData();
      formData.append('key','fb8dab318e1888679f571104d8b36ac7')
      formData.append('token',localStorage.trello_token)
      formData.append("file", files[0])
      formData.append("name", "這是一個測試檔案");
      this.file = formData
      /* console.log(formData)  
      // formData.append("mimeType", "image/png"); // Optionally, set mimeType if needed.
      var request = new XMLHttpRequest();
      request.responseType = "json";
      request.onreadystatechange = function() {
        // When we have a response back from the server we want to share it!
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response
        if (request.readyState === 4) {
          console.log(`Successfully uploaded at: ${request.response.date}`);
        }
      }
      request.open("POST", `https://api.trello.com/1/cards/5b30629995b4855bd26155a7/attachments/`);
      request.send(formData); */
    },
    upload: function() {
      var request = new XMLHttpRequest();
      request.responseType = "json";
      request.onreadystatechange = function() {
        // When we have a response back from the server we want to share it!
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response
        if (request.readyState === 4) {
          console.log(`Successfully uploaded at: ${request.response.date}`);
        }
      }
      request.open("POST", `https://api.trello.com/1/cards/5b30629995b4855bd26155a7/attachments/`);
      request.send(this.file);

    },
    getattachment: function() {
      Trello.cards.get('5b30629995b4855bd26155a7',{fields: 'all',attachments: true},function(res) {
        console.log(res)
      })
    },
    async fuck() {
      let a = await Trello.boards.get('5ae1a06add97661f233209a5' + '/lists',{cards: 'open'})
      for (let i = 0; i < a.length; i++) {
        let list = {}
        list.id = a[i].id
        for (let j = 0; j < a[i].cards.length; j++) {
          let b = await Trello.cards.get(a[i].cards[j].id,{fields: 'attachments',attachments: true})
          if (b.attachments.length != 0) {
            for (let k = 0; k < b.attachments.length;k++) {
              let attachment = {}
              attachment.name = b.attachments[k].name
              attachment.url = b.attachments[k].url
              a[i].cards[j].attachments = await attachment
            }
            /* attachments.map( a => {
              let attachment = {}
              attachment.name = a.name
              attachment.url = a.url
              card.attach.push(attachment)
            }) */
          }
                        console.log(typeof(a[i].cards[j].attachments))
        }
        list.cards = await a[i].cards
        this.lists.push(list)
      }
      /* a.map( l => {
        let list = {}
        list.cards = l.cards
        list.cards.map( card => {
          let attachments = await Trello.cards.get(card.id,{fields: 'attachments',attachments: true})
          if (attachments.length != 0) {
            attachments.map( a => {
              let attachment = {}
              attachment.name = a.name
              attachment.url = a.url
              card.attach.push(attachment)
            })
          }
        })
        this.lists.push(list)
      }) */
    }
  },
  created: async function() {
    let a = await this.fuck()
    //console.log(this.lists)
  }
}
</script>

<style>

</style>
