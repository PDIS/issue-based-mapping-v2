<template>
 <div>
    <input type="file" @change="onFileChange">
    <v-btn @click="upload()">上傳</v-btn>
 </div>
</template>

<script>
export default {
  data() {
    return {
      file: FormData,
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
    }
  },
  created: function() {
    this.getattachment()
  }
}
</script>

<style>

</style>
