webpackJsonp([1],{"1W45":function(t,e){},"1mbS":function(t,e){},"4uaM":function(t,e){},"6wH5":function(t,e){},"7zck":function(t,e){},IKP7:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("7+uW"),n={data:function(){return{clipped:!1,drawer:!0,fixed:!1,items:[],miniVariant:!1,right:!0,rightDrawer:!1,title:"議題分析表",me:{name:"",avatar:""},message:{avatar:"https://avatars0.githubusercontent.com/u/9064066?v=4&s=460",name:"John Leider",title:"Welcome to Vuetify.js!",excerpt:"Thank you for joining our community..."}}},methods:{login:function(){Trello.authorize({name:"議題分析表",expiration:"never",scope:{read:!0,write:!0}})},menu:function(){console.log(this.items)},getsuccessed:function(t){console.log(t)}},created:function(){var t=this;Trello.organizations.get("ibm249/boards",{filter:"all"},function(t){var e=this;this.items=[],t.map(function(t){var a={icon:"bubble_chart"};a.title=t.name,e.items.push(a)})});Trello.members.get("me",function(e){t.me.name=e.username,t.me.avatar=e.avatarUrl+"/50.png"},this.login())}},l={render:function(){var t=this.$createElement;return(this._self._c||t)("div")},staticRenderFns:[]};var s={render:function(){var t=this.$createElement,e=this._self._c||t;return e("v-footer",{attrs:{fixed:!1,app:""}},[e("span",[this._v("© 2018")])])},staticRenderFns:[]};var o={data:function(){return{clipped:!1,drawer:!0,fixed:!1,items:[{icon:"bubble_chart",title:"Inspire"}],miniVariant:!1,right:!0,rightDrawer:!1,title:"Vuetify.js"}},name:"App",components:{vueheader:a("VU/8")(n,l,!1,function(t){a("QYmA")},null,null).exports,vuefooter:a("VU/8")({},s,!1,function(t){a("6wH5")},null,null).exports}},i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("v-app",{staticStyle:{"background-color":"white"}},[e("vueheader"),this._v(" "),e("v-content",[e("router-view")],1)],1)},staticRenderFns:[]};var c=a("VU/8")(o,i,!1,function(t){a("fJh9")},null,null).exports,d=a("/ocq"),v=a("mvHQ"),u=a.n(v),f={data:function(){return{title:"Preliminary report",email:"",rules:{required:function(t){return!!t||"Required."},email:function(t){return/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t)||"Invalid e-mail."}},boardname:"",desc:{title:"",person:"",date:null},date:null,picker:!1}},methods:{submit:function(){var t=this;Trello.post("boards",{name:this.boardname,idOrganization:"5ad56d6d96cb269a7a2aaa0a",idBoardSource:"5ab49c39f2917ad1cff1a3de",prefs_permissionLevel:"org",keepFromSource:"none"},function(e){Trello.put("boards/"+e.id,{desc:u()(t.desc)})})}}},m={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:"","justify-center":""}},[a("v-flex",{attrs:{xs12:"",sm6:""}},[a("v-card",[a("v-toolbar",{attrs:{color:"teal"}},[a("v-btn",{attrs:{icon:""}},[a("v-icon",{attrs:{color:"white"}},[t._v("arrow_back")])],1),t._v(" "),a("v-spacer"),t._v(" "),a("v-btn",{attrs:{icon:""}},[a("v-icon",{attrs:{color:"white"}},[t._v("more_vert")])],1)],1),t._v(" "),a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("v-text-field",{attrs:{label:"看版名稱","prepend-icon":"assignment"},model:{value:t.boardname,callback:function(e){t.boardname=e},expression:"boardname"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-text-field",{attrs:{label:"議題名稱","prepend-icon":"announcement"},model:{value:t.desc.title,callback:function(e){t.$set(t.desc,"title",e)},expression:"desc.title"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-text-field",{attrs:{label:"提案人","prepend-icon":"person"},model:{value:t.desc.person,callback:function(e){t.$set(t.desc,"person",e)},expression:"desc.person"}}),t._v(" "),a("v-menu",{ref:"date",attrs:{lazy:"","close-on-content-click":!1,transition:"scale-transition","offset-y":"","full-width":"","nudge-right":40,"min-width":"290px","return-value":t.date},on:{"update:returnValue":function(e){t.date=e}},model:{value:t.picker,callback:function(e){t.picker=e},expression:"picker"}},[a("v-text-field",{attrs:{slot:"activator",label:"提案日期","prepend-icon":"event"},slot:"activator",model:{value:t.desc.date,callback:function(e){t.$set(t.desc,"date",e)},expression:"desc.date"}}),t._v(" "),a("v-date-picker",{attrs:{locale:"zh-tw"},on:{input:function(e){t.$refs.date.save(t.date)}},model:{value:t.desc.date,callback:function(e){t.$set(t.desc,"date",e)},expression:"desc.date"}})],1)],1)],1)],1),t._v(" "),a("v-divider",{staticClass:"mt-5"}),t._v(" "),a("v-btn",{attrs:{color:"primary",flat:""},on:{click:t.submit}},[t._v("Submit")])],1)],1)],1)],1)},staticRenderFns:[]};var p=a("VU/8")(f,m,!1,function(t){a("zPXi")},"data-v-7e1e5821",null).exports,b={data:function(){return{boards:[],search:"",dialog:!1,selectedid:""}},methods:{getboards:function(){var t=this;Trello.organizations.get("ibm249/boards",{filter:"open"},function(e){e.map(function(e){var a={};a.id=e.id,a.title=e.name,""!=e.desc&&(a.desc=JSON.parse(e.desc)),t.boards.push(a)})})},closeboard:function(t){Trello.put("boards/"+t,{closed:!0},function(t){window.location.reload(!0)})}},created:function(){this.getboards()},watch:{search:function(){console.log(this.search)}},computed:{filteredList:function(){var t=this;return this.boards.filter(function(e){return e.title.toLowerCase().includes(t.search.toLowerCase())})}}},x={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("div",{staticClass:"white"},[a("div",{staticClass:"text-xs-left"},[a("v-btn",{attrs:{color:"grey lighten-1",outline:"",small:"",fab:"",btn:""}},[a("v-icon",[t._v("reorder")])],1),t._v(" "),a("v-btn",{attrs:{color:"grey lighten-1",outline:"",small:"",fab:"",btn:""}},[a("v-icon",[t._v("work")])],1),t._v(" "),a("v-btn",{attrs:{color:"grey lighten-1",outline:"",small:"",fab:"",btn:""}},[a("v-icon",[t._v("pan_tool")])],1)],1),t._v(" "),a("div",{staticClass:"text-xs-center"},[a("h1",[t._v(" 議題分析表 ")]),t._v(" "),a("div",{staticClass:"pb-4"},[t._v("分析議題的好幫手")])])]),t._v(" "),a("v-text-field",{staticClass:"mt-4 mb-2",attrs:{"prepend-icon":"search",label:"搜尋議題",value:"Input text"},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:"","text-xs-right":""}},[a("span",{staticClass:"group pa-2"},[a("v-btn",{attrs:{outline:"",btn:""}},[a("v-icon",[t._v("subject")])],1),t._v(" "),a("v-btn",{attrs:{outline:"",btn:""}},[a("v-icon",[t._v("apps")])],1)],1)])],1),t._v(" "),a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"",sm6:"",md4:"",lg3:"","text-xs-center":""}},[a("v-card",{attrs:{height:"20em",hover:"",color:"yellow"}},[a("v-container",{attrs:{"fill-height":""}},[a("v-layout",{attrs:{"align-center":"","justify-center":""}},[a("v-card-text",[a("v-btn",{attrs:{fab:"",dark:"",large:"",color:"indigo darken-4",to:{name:"newboard"}}},[a("v-icon",{attrs:{dark:""}},[t._v("add")])],1)],1)],1)],1)],1)],1),t._v(" "),t._l(t.filteredList,function(e){return a("v-flex",{key:e.id,attrs:{xs12:"",sm6:"",md4:"",lg3:""}},[a("v-card",{attrs:{color:"white",to:{name:"board",params:{id:e.id}},hover:"",height:"20em"}},[a("v-list",{staticStyle:{"background-color":"white"},attrs:{subheader:""}},[a("v-subheader",{staticClass:"light-blue accent-1",staticStyle:{color:"black"}},[t._v("# "),a("div",{staticClass:"ml-2"},[t._v(t._s(e.title))]),t._v(" "),a("v-spacer"),t._v(" "),a("v-chip",{attrs:{color:"pink lighten-1","text-color":"white"}},[t._v("\n    教育部\n  ")])],1),t._v(" "),a("v-divider"),t._v(" "),a("br"),t._v(" "),a("v-list-tile",[a("v-list-tile-avatar",[a("v-icon",{attrs:{color:"grey lighten-1"}},[t._v("announcement")])],1),t._v(" "),a("v-list-tile-content",[a("v-list-tile-sub-title",[t._v("提案名稱")]),t._v(" "),a("v-list-tile-title",{domProps:{innerHTML:t._s(e.desc.title)}})],1)],1),t._v(" "),a("v-list-tile",[a("v-list-tile-avatar",[a("v-icon",{attrs:{color:"grey lighten-1"}},[t._v("face")])],1),t._v(" "),a("v-list-tile-content",[a("v-list-tile-sub-title",[t._v("提案人")]),t._v(" "),a("v-list-tile-title",{domProps:{innerHTML:t._s(e.desc.person)}})],1)],1),t._v(" "),a("v-list-tile",[a("v-list-tile-avatar",[a("v-icon",{attrs:{color:"grey lighten-1"}},[t._v("event")])],1),t._v(" "),a("v-list-tile-content",[a("v-list-tile-sub-title",[t._v("提案日期")]),t._v(" "),a("v-list-tile-title",{domProps:{innerHTML:t._s(e.desc.date)}})],1)],1)],1),t._v(" "),a("v-divider"),t._v(" "),a("v-card-actions",{staticStyle:{"background-color":"white"}},[a("v-btn",{attrs:{round:"",outline:"",flat:"",color:"blue darken-3",to:{name:"board",params:{id:e.id}}}},[t._v("進入議題")]),t._v(" "),a("v-spacer"),t._v(" "),a("v-btn",{attrs:{icon:"",flat:"",color:"grey",to:{name:"editboard",params:{id:e.id}}}},[a("v-icon",[t._v("edit")])],1),t._v(" "),a("v-btn",{attrs:{icon:"",flat:"",color:"grey",to:{name:"index"},"active-class":""},nativeOn:{click:function(a){a.stopPropagation(),t.dialog=!0,t.selectedid=e.id}}},[a("v-icon",[t._v("delete")])],1)],1)],1)],1)})],2),t._v(" "),a("v-dialog",{attrs:{"max-width":"290"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[t._v("確定刪除?")]),t._v(" "),a("v-card-text"),t._v(" "),a("v-card-actions",[a("v-btn",{attrs:{color:"blue",flat:"flat"},nativeOn:{click:function(e){t.dialog=!1,t.closeboard(t.selectedid)}}},[t._v("確定")]),t._v(" "),a("v-btn",{attrs:{color:"black",flat:"flat",to:{name:"index"},"active-class":""},nativeOn:{click:function(e){t.dialog=!1}}},[t._v("取消")])],1)],1)],1)],1)},staticRenderFns:[]};var _=a("VU/8")(b,x,!1,function(t){a("1W45")},null,null).exports,h=a("woOf"),g=a.n(h),k=a("u2KI"),w=a.n(k),y={data:function(){var t=w()({id:"",boardname:"",desc:{title:"",person:"",date:null}});return{date:null,picker:!1,valid:!1,nameRules:[function(t){return!!t||"此欄位為必填!"},function(t){return t.length<=20||"此欄位不可超過20個字!"}],requiredRules:[function(t){return!!t||"此欄位為必填!"}],snackbar:!1,form:g()({},t)}},methods:{submit:function(){var t=this;void 0!=this.$route.params.id?Trello.put("boards/"+this.id,{name:this.form.boardname},function(e){Trello.put("boards/"+e.id,{desc:u()(t.form.desc)},function(){t.$router.push("/")})}):Trello.post("boards",{name:this.form.boardname,idOrganization:"5ad56d6d96cb269a7a2aaa0a",idBoardSource:"5ab49c39f2917ad1cff1a3de",prefs_permissionLevel:"org",keepFromSource:"none"},function(e){Trello.put("boards/"+e.id,{desc:u()(t.form.desc)},function(){this.snackbar=!0,t.$router.push("/")})})},resetForm:function(){this.form=g()({},this.defaultForm),this.$refs.form.reset()}},computed:{formIsValid:function(){return this.form.boardname&&this.form.desc.title&&this.form.desc.person&&this.form.desc.date}},created:function(){var t=this;void 0!=this.$route.params.id&&(this.id=this.$route.params.id,Trello.boards.get(this.id,function(e){t.form.boardname=e.name,""!=e.desc&&(t.form.desc=JSON.parse(e.desc))}))}},$={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:"","justify-center":""}},[a("v-flex",{attrs:{xs12:"",sm6:""}},[a("v-card",[a("v-snackbar",{attrs:{absolute:"",top:"",right:"",color:"success"},model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[a("span",[t._v("新增成功!")]),t._v(" "),a("v-icon",{attrs:{dark:""}},[t._v("check_circle")])],1),t._v(" "),a("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.submit(e)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-container",[a("v-text-field",{attrs:{label:"看版名稱","prepend-icon":"assignment",counter:20,rules:t.nameRules},model:{value:t.form.boardname,callback:function(e){t.$set(t.form,"boardname",e)},expression:"form.boardname"}}),t._v(" "),a("v-text-field",{attrs:{label:"議題名稱","prepend-icon":"announcement",rules:t.requiredRules},model:{value:t.form.desc.title,callback:function(e){t.$set(t.form.desc,"title",e)},expression:"form.desc.title"}}),t._v(" "),a("v-text-field",{attrs:{label:"提案人","prepend-icon":"person",rules:t.requiredRules},model:{value:t.form.desc.person,callback:function(e){t.$set(t.form.desc,"person",e)},expression:"form.desc.person"}}),t._v(" "),a("v-menu",{ref:"date",attrs:{lazy:"","close-on-content-click":!1,transition:"scale-transition","offset-y":"","full-width":"","nudge-right":40,"min-width":"290px","return-value":t.date},on:{"update:returnValue":function(e){t.date=e}},model:{value:t.picker,callback:function(e){t.picker=e},expression:"picker"}},[a("v-text-field",{attrs:{slot:"activator",label:"提案日期","prepend-icon":"event",rules:t.requiredRules,readonly:""},slot:"activator",model:{value:t.form.desc.date,callback:function(e){t.$set(t.form.desc,"date",e)},expression:"form.desc.date"}}),t._v(" "),a("v-date-picker",{attrs:{locale:"zh-tw"},on:{input:function(e){t.$refs.date.save(t.date)}},model:{value:t.form.desc.date,callback:function(e){t.$set(t.form.desc,"date",e)},expression:"form.desc.date"}})],1)],1),t._v(" "),a("v-divider"),t._v(" "),a("v-card-actions",[a("v-btn",{staticClass:"subheading",attrs:{disabled:!t.formIsValid,flat:"",color:"primary",type:"submit"}},[t._v("確認")]),t._v(" "),a("v-spacer"),t._v(" "),a("v-btn",{staticClass:"subheading",attrs:{flat:""},on:{click:t.resetForm}},[t._v("清除")])],1)],1)],1)],1)],1)],1)},staticRenderFns:[]};var R=a("VU/8")(y,$,!1,function(t){a("4uaM")},"data-v-71debd74",null).exports,C=a("BO1k"),T=a.n(C),V=a("DAYN"),z=a.n(V),S={props:["dialog","listname"],data:function(){var t=w()({card:{title:"",desc:{title:"",person:"",date:null}}});return{snackbar:!1,valid:!1,titleRules:[function(t){return!!t||"此欄位為必填!"},function(t){return t.length<=20||"此欄位不可超過20個字!"}],select:[],items:["Programming","Design","Vue","Vuetify"],form:g()({},t)}},methods:{closeDialog:function(){console.log("fuck")}}},F={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:"","justify-center":""}},[a("v-dialog",{attrs:{persistent:"","max-width":"50em"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.submit(e)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",md6:""}},[a("v-card",{attrs:{color:"orange",dark:""}},[a("v-card-text")],1)],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",md6:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-card",{attrs:{color:"white"}},[a("v-card-text")],1)],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-card",{attrs:{color:"white"}},[a("v-card-text")],1)],1)],1)],1),t._v(" "),a("v-divider"),t._v(" "),a("v-flex",{attrs:{"d-flex":"",md12:""}},["問題面向"==t.listname?a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"問題面向","prepend-icon":"announcement",counter:20,rules:t.titleRules},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1)],1):t._e(),t._v(" "),"問題細節"==t.listname?a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"問題細節","prepend-icon":"announcement",counter:20,rules:t.titleRules},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"補充說明","prepend-icon":"people"},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1)],1):t._e(),t._v(" "),"解法"==t.listname?a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"解法","prepend-icon":"announcement",counter:20,rules:t.titleRules},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1)],1):t._e(),t._v(" "),"回應"==t.listname?a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"回應","prepend-icon":"announcement",counter:20,rules:t.titleRules},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"補充說明","prepend-icon":"people"},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1)],1):t._e(),t._v(" "),"困雖"==t.listname?a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"困雖","prepend-icon":"announcement",counter:20,rules:t.titleRules},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"補充說明","prepend-icon":"people"},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1)],1):t._e(),t._v(" "),"利害關係人"==t.listname?a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"利害關係人","prepend-icon":"announcement",counter:20,rules:t.titleRules},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"單位","prepend-icon":"announcement"},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"背景","prepend-icon":"announcement"},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1)],1):t._e(),t._v(" "),"資料/文件/連結"==t.listname?a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"資料/文件/連結","prepend-icon":"announcement",counter:20,rules:t.titleRules},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"摘要","prepend-icon":"people"},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-text-field",{attrs:{label:"歸納","prepend-icon":"people"},model:{value:t.form.card.title,callback:function(e){t.$set(t.form.card,"title",e)},expression:"form.card.title"}})],1)],1):t._e(),t._v(" "),a("v-layout",{attrs:{row:"",wrap:""}})],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",md12:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-select",{attrs:{items:t.items,label:"關聯利害關係人","prepend-icon":"people",chips:"",tags:""},model:{value:t.select,callback:function(e){t.select=e},expression:"select"}})],1)],1)],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",md12:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-select",{attrs:{items:t.items,label:"佐證文件","prepend-icon":"picture_as_pdf",chips:"",tags:""},model:{value:t.select,callback:function(e){t.select=e},expression:"select"}})],1)],1)],1)],1)],1)],1),t._v(" "),a("v-card-actions",[a("v-btn",{staticClass:"subheading",attrs:{flat:"",color:"primary",type:"submit"}},[t._v("確認")]),t._v(" "),a("v-spacer"),t._v(" "),a("v-btn",{staticClass:"subheading",attrs:{flat:""}},[t._v("清除")]),t._v(" "),a("v-spacer"),t._v(" "),a("v-btn",{staticClass:"subheading",attrs:{flat:""},nativeOn:{click:function(e){return t.closeDialog(e)}}},[t._v("關閉")])],1)],1)],1)],1)],1)},staticRenderFns:[]};var O=a("VU/8")(S,F,!1,function(t){a("wGtX")},null,null).exports,P={components:{draggable:z.a,newcard:O},data:function(){return{board:{},lists:[],cards:[],dialog:!1,listname:""}},methods:{getcards:function(t){var e=[],a=!0,r=!1,n=void 0;try{for(var l,s=T()(this.cards);!(a=(l=s.next()).done);a=!0){var o=l.value;o.idList==t&&e.push(o)}}catch(t){r=!0,n=t}finally{try{!a&&s.return&&s.return()}finally{if(r)throw n}}return e},newcard:function(t){console.log(t)}},created:function(){var t=this;this.board.id=this.$route.params.id,Trello.boards.get(this.board.id,function(e){t.board.name=e.name,""!=e.desc&&(t.board.desc=JSON.parse(e.desc))}),Trello.boards.get(this.board.id+"/lists",{cards:"open"},function(e){e.map(function(e){var a={};switch(a.id=e.id,a.name=e.name,a.cards=e.cards,a.name){case"資料/文件/連結":a.color="blue accent-1";break;case"問題面向":a.color="yellow lighten-1";break;case"問題細節":a.color="yellow lighten-3";break;case"解法":a.color="light green accent-3";break;case"回應":a.color="orange";break;case"困難":a.color="pink";break;case"利害關係人":a.color="indigo";break;default:a.color="teal"}t.lists.push(a)})})}},j={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:""}},t._l(t.lists,function(e,r){return a("v-flex",{key:e.id,attrs:{xs12:"",md4:"",lg3:""}},[a("v-toolbar",{attrs:{"text-center":""}},[a("v-toolbar-title",{staticClass:"subheading"},[t._v(t._s(e.name))]),t._v(" "),a("v-spacer")],1),t._v(" "),a("v-card",[a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("draggable",{staticStyle:{"min-height":"1em"},attrs:{options:{group:"cards",animation:200}},on:{start:function(e){t.drag=!0},end:function(e){t.drag=!1},add:t.newcard},model:{value:e.cards,callback:function(a){t.$set(e,"cards",a)},expression:"list.cards"}},t._l(e.cards,function(r){return a("v-card",{key:r.id,staticClass:"ma-2",attrs:{color:e.color,hover:"",id:r.id}},[a("v-card-title",{attrs:{"primary-title":""}},[a("div",{staticClass:"body-2"},[t._v(t._s(r.name))])])],1)}))],1),t._v(" "),a("v-footer",[a("v-btn",{staticClass:"subheading",staticStyle:{margin:"0",width:"100%"},attrs:{color:"black",dark:""},nativeOn:{click:function(a){a.stopPropagation(),t.dialog=!0,t.listname=e.name}}},[t._v("新增卡片\n            "),a("v-icon",{attrs:{dark:"",right:""}},[t._v("add")])],1)],1)],1)],1)})),t._v(" "),a("newcard",{attrs:{dialog:t.dialog,listname:t.listname}})],1)},staticRenderFns:[]};var E=a("VU/8")(P,j,!1,function(t){a("1mbS")},null,null).exports,L={data:function(){return{id:"",boardname:"",desc:{title:"",person:"",date:null},date:null,picker:!1}},methods:{submit:function(){var t=this;Trello.put("boards/"+this.id,{name:this.boardname},function(e){Trello.put("boards/"+e.id,{desc:u()(t.desc)},function(){t.$router.push("/")})})}},created:function(){var t=this;this.id=this.$route.params.id,Trello.boards.get(this.id,function(e){t.boardname=e.name,""!=e.desc&&(t.desc=JSON.parse(e.desc))})}},U={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:"","justify-center":""}},[a("v-flex",{attrs:{xs12:"",sm6:""}},[a("v-card",[a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("v-text-field",{attrs:{label:"看版名稱","prepend-icon":"assignment"},model:{value:t.boardname,callback:function(e){t.boardname=e},expression:"boardname"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-text-field",{attrs:{label:"議題名稱","prepend-icon":"announcement"},model:{value:t.desc.title,callback:function(e){t.$set(t.desc,"title",e)},expression:"desc.title"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-text-field",{attrs:{label:"提案人","prepend-icon":"person"},model:{value:t.desc.person,callback:function(e){t.$set(t.desc,"person",e)},expression:"desc.person"}}),t._v(" "),a("v-menu",{ref:"date",attrs:{lazy:"","close-on-content-click":!1,transition:"scale-transition","offset-y":"","full-width":"","nudge-right":40,"min-width":"290px","return-value":t.date},on:{"update:returnValue":function(e){t.date=e}},model:{value:t.picker,callback:function(e){t.picker=e},expression:"picker"}},[a("v-text-field",{attrs:{slot:"activator",label:"提案日期","prepend-icon":"event"},slot:"activator",model:{value:t.desc.date,callback:function(e){t.$set(t.desc,"date",e)},expression:"desc.date"}}),t._v(" "),a("v-date-picker",{attrs:{locale:"zh-tw"},on:{input:function(e){t.$refs.date.save(t.date)}},model:{value:t.desc.date,callback:function(e){t.$set(t.desc,"date",e)},expression:"desc.date"}})],1)],1)],1)],1),t._v(" "),a("v-divider",{staticClass:"mt-5"}),t._v(" "),a("v-btn",{attrs:{color:"primary",flat:""},on:{click:t.submit}},[t._v("修改")])],1)],1)],1)],1)},staticRenderFns:[]};a("VU/8")(L,U,!1,function(t){a("IKP7")},"data-v-b2defe42",null).exports;var H={data:function(){var t=w()({card:{title:"",desc:{title:"",person:"",date:null}}});return{snackbar:!1,valid:!1,titleRules:[function(t){return!!t||"此欄位為必填!"},function(t){return t.length<=20||"此欄位不可超過20個字!"}],form:g()({},t)}}},D={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:"","justify-center":""}},[a("v-flex",{attrs:{xs12:"",sm6:""}},[a("v-card",[a("v-snackbar",{attrs:{absolute:"",top:"",right:"",color:"success"},model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[a("span",[t._v("新增成功!")]),t._v(" "),a("v-icon",{attrs:{dark:""}},[t._v("check_circle")])],1),t._v(" "),a("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.submit(e)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",md4:""}},[a("v-card",{attrs:{color:"orange",dark:""}},[a("v-card-text",[t._v("\n                   fefefefefef\n                 ")])],1)],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",md3:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-card",{attrs:{color:"blue"}},[a("v-card-text",[t._v("\n                   fefefefefef\n                 ")])],1)],1),t._v(" "),a("v-flex",{attrs:{"d-flex":"",xs12:""}},[a("v-card",{attrs:{color:"blue"}},[a("v-card-text",[t._v("\n                   fefefefefef\n                 ")])],1)],1)],1)],1)],1)],1)],1)],1)],1)],1)],1)},staticRenderFns:[]};var A=a("VU/8")(H,D,!1,function(t){a("whkQ")},null,null).exports;r.a.use(d.a);var I=new d.a({routes:[{path:"/",name:"index",component:_},{path:"/newboard",name:"newboard",component:R},{path:"/board/:id",name:"board",component:E},{path:"/editboard/:id",name:"editboard",component:R},{path:"/newcard",name:"newcard",component:O},{path:"/HelloWorld",name:"HelloWorld",component:p},{path:"/test",name:"test",component:A}]}),J=a("3EgV"),q=a.n(J);a("7zck");r.a.use(q.a),r.a.config.productionTip=!1,new r.a({el:"#app",router:I,components:{App:c},template:"<App/>"})},QYmA:function(t,e){},fJh9:function(t,e){},wGtX:function(t,e){},whkQ:function(t,e){},zPXi:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.daf1aa205659b877f7a0.js.map