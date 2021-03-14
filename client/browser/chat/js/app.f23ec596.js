(function(t){function e(e){for(var s,h,r=e[0],a=e[1],l=e[2],u=0,c=[];u<r.length;u++)h=r[u],Object.prototype.hasOwnProperty.call(n,h)&&n[h]&&c.push(n[h][0]),n[h]=0;for(s in a)Object.prototype.hasOwnProperty.call(a,s)&&(t[s]=a[s]);p&&p(e);while(c.length)c.shift()();return o.push.apply(o,l||[]),i()}function i(){for(var t,e=0;e<o.length;e++){for(var i=o[e],s=!0,r=1;r<i.length;r++){var a=i[r];0!==n[a]&&(s=!1)}s&&(o.splice(e--,1),t=h(h.s=i[0]))}return t}var s={},n={app:0},o=[];function h(e){if(s[e])return s[e].exports;var i=s[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,h),i.l=!0,i.exports}h.m=t,h.c=s,h.d=function(t,e,i){h.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},h.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},h.t=function(t,e){if(1&e&&(t=h(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(h.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)h.d(i,s,function(e){return t[e]}.bind(null,s));return i},h.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return h.d(e,"a",e),e},h.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},h.p="";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],a=r.push.bind(r);r.push=e,r=r.slice();for(var l=0;l<r.length;l++)e(r[l]);var p=a;o.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},"56d7":function(t,e,i){"use strict";i.r(e);i("e260"),i("e6cf"),i("cca6"),i("a79d");var s=i("2b0e"),n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:t.isChatLoaded,expression:"isChatLoaded"}],staticClass:"charContent",attrs:{id:"app"}},[i("transition",{attrs:{name:"fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.showChatBox,expression:"showChatBox"}],attrs:{id:"chatBox"}},t._l(t.messageArray,(function(e,s){return i("div",{key:e.message,staticClass:"chatLine",attrs:{id:"chatLine"}},[t.isAdminMode?i("div",[i("h3",{class:t.getTextColor(s),attrs:{id:"chatText:"+s}},[t._v(t._s(e.id)+" "+t._s(e.date)+" "),i("span",{domProps:{innerHTML:t._s(e.message)}},[t._v(t._s(e.message))])])]):i("div",[i("h3",{class:t.getTextColor(s),attrs:{id:"chatText:"+s}},[t._v(t._s(e.date)+" "),i("span",{domProps:{innerHTML:t._s(e.message)}},[t._v(t._s(e.message))])])])])})),0)]),i("transition",{attrs:{name:"fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.showChatInput,expression:"showChatInput"}],ref:"input",staticClass:"chatInput"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.inputText,expression:"inputText"}],staticClass:"inputText",attrs:{type:"text",id:"inputTextID"},domProps:{value:t.inputText},on:{input:function(e){e.target.composing||(t.inputText=e.target.value)}}})])]),i("transition",{attrs:{name:"fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.showChatHelper,expression:"showChatHelper"}],staticClass:"chatHelperContainer",attrs:{id:"helperScroll"}},t._l(t.filterHelpMsg,(function(e,s){return i("div",{key:e.cmd,staticClass:"chatHelperText",attrs:{id:"help_row:"+s}},[i("h3",{staticClass:"helpText"},[t._v(t._s(e.cmd))]),i("h3",{staticClass:"helpText"},[t._v(t._s(e.args))]),i("br"),i("h3",{staticClass:"helpText"},[t._v(t._s(e.description))]),i("br")])})),0)])],1)},o=[],h=(i("4de4"),i("c975"),i("d81d"),i("fb6a"),i("ac1f"),i("466d"),i("1276"),{name:"chatBox",methods:{getTextColor:function(t){var e=this;setTimeout((function(){var i="rgba("+e.messageArray[t].r+","+e.messageArray[t].g+","+e.messageArray[t].b+","+e.messageArray[t].a+")";document.getElementById("chatText:"+t).style.opacity=1,document.getElementById("chatText:"+t).style.display="block",document.getElementById("chatText:"+t).style.color=i,document.getElementById("chatText:"+t).style.width="100%"}),0)},buttonClick:function(){this.showChatInput=!this.showChatInput,this.showChatHelper=!this.showChatHelper},checkScrollView:function(){var t;this.showChatBox&&(t=document.getElementById("chatBox"));var e=t.scrollHeight-t.clientHeight;t.scrollTop=e},keyPressed:function(t){var e,i;if(this.showChatBox&&(e=document.getElementById("chatBox")),this.showChatHelper&&(i=document.getElementById("helperScroll")),"Enter"===t&&this.inputText.length>=0){this.registedCmd.map((function(t){return t.cmd})).indexOf(this.inputCmd);if(void 0===this.inputText||0===this.inputText.length)return this.setInputState(!1),void alt.emit("chat:hideChat");if("/"===this.inputText.charAt(0)&&!/\s/.test(this.inputText)&&this.showChatHelper&&null!==this.helpOption)return this.inputText=this.registedCmd[this.helpOption].cmd,void(this.helpOption=null);if("/"===this.inputText.charAt(0)&&this.inputText.length>0){var s=this.inputText.indexOf(" "),n=this.inputText.slice(s);alt.emit("chat:sendcommand",this.inputCmd,n)}else this.showChatHelper||alt.emit("chat:sendmessage",this.inputText);this.historyChat.push(this.inputText),this.currentHistoryPosition=this.historyChat.length,this.showChatBox=!0,this.checkScrollView(),this.setInputState(!1),alt.emit("chat:hideChat"),this.historyChat.length>20&&this.historyChat.shift()}else"ArrowUp"===t?this.inputText&&(this.showChatHelper?(null==this.helpOption&&(this.helpOption=0),document.getElementById("help_row:"+this.helpOption).style.backgroundColor="transparent",document.getElementById("help_row:"+this.helpOption).style.borderRadius="0px",this.helpOption>0&&(this.helpOption-=1),i.scrollTop-=40,document.getElementById("help_row:"+this.helpOption).style.width="80%",document.getElementById("help_row:"+this.helpOption).style.backgroundColor="#32b85f9f",document.getElementById("help_row:"+this.helpOption).style.borderRadius="15px",document.getElementById("help_row:"+this.helpOption).style.transition=".4s"):(this.currentHistoryPosition=this.currentHistoryPosition+1,this.inputText=this.historyChat[this.currentHistoryPosition],this.currentHistoryPosition>this.historyChat.length&&(this.currentHistoryPosition=this.historyChat.length))):"ArrowDown"===t?void 0!==this.inputText&&(this.showChatHelper?(null==this.helpOption&&(this.helpOption=0),document.getElementById("help_row:"+this.helpOption).style.backgroundColor="transparent",document.getElementById("help_row:"+this.helpOption).style.borderRadius="0px",this.helpOption<this.filterHelpMsg.length-1&&(this.helpOption+=1),i.scrollTop+=40,document.getElementById("help_row:"+this.helpOption).style.width="80%",document.getElementById("help_row:"+this.helpOption).style.backgroundColor="#32b85f9f",document.getElementById("help_row:"+this.helpOption).style.borderRadius="15px",document.getElementById("help_row:"+this.helpOption).style.transition="1s"):(this.currentHistoryPosition=this.currentHistoryPosition-1,this.inputText=this.historyChat[this.currentHistoryPosition],this.currentHistoryPosition<0&&(this.currentHistoryPosition=0))):"PageUp"===t?this.showChatBox&&(e.scrollTop-=40):"PageDown"===t&&this.showChatBox&&(e.scrollTop+=40);this.helpOption<=0&&(this.helpOption=0)},loadChat:function(t,e){this.currentPermission=t,this.registedCmd=e,this.isChatLoaded=!0,this.isMounted=!0},setInputState:function(t){var e=this;this.inputText="",this.showChatInput=t,t||(this.showChatHelper=!1),setTimeout((function(){t&&(e.showChatBox=!0,document.getElementById("inputTextID").focus())}),10)},displayMessage:function(t){this.messageArray.push(t)},toggleAdmin:function(t){this.isAdminMode=t},setPermission:function(t,e){this.currentPermission=t,this.registedCmd=e},disapearDelay:function(t){var e=this;t.length;this.showChatBox=!0,this.messageTimeout&&clearTimeout(this.messageTimeout),this.messageTimeout=setTimeout((function(){e.showChatBox=!1,clearTimeout(e.messageTimeout)}),1e4)}},data:function(){return{currentHistoryPosition:0,isAdminMode:!1,isMounted:!1,showChatInput:!1,showChatBox:!1,showChatHelper:!1,currentPermission:0,historyChat:[],messageArray:[],registedCmd:[],helperMsgs:[],inputText:"",inputCmd:"",helpOption:null,messageTimeout:null,isChatLoaded:!1}},watch:{showChatInput:function(t){t&&(this.showChatBox=!0)},messageArray:function(t,e){t&&this.disapearDelay(e)}},computed:{filterHelpMsg:function(){var t=this;return this.registedCmd.filter((function(e){if(0!==t.inputText.length&&(t.helpOption=null,"/"===t.inputText.charAt(0)?(t.inputCmd=t.inputText.split(" ")[0],t.inputCmd===t.inputText?t.showChatHelper=!0:t.showChatHelper=!1):t.showChatHelper&&(t.showChatHelper=!1),t.helperMsgs=e,t.currentPermission>=e.level))return e.cmd.match(t.inputCmd)}))}},mounted:function(){"alt"in window&&(setTimeout((function(){alt.emit("chat:ready")}),200),alt.on("chat:loadChat",this.loadChat),alt.on("chat:input_state",this.setInputState),alt.on("chat:keyPress",this.keyPressed),alt.on("chat:sendProximity",this.displayMessage),alt.on("chat:setPermission",this.setPermission),alt.on("chat:toggleAdmin",this.toggleAdmin))}}),r=h,a=(i("815d"),i("2877")),l=Object(a["a"])(r,n,o,!1,null,"6fcd8c4e",null),p=l.exports;s["a"].config.productionTip=!1,new s["a"]({render:function(t){return t(p)}}).$mount("#app")},"5b58":function(t,e,i){},"815d":function(t,e,i){"use strict";var s=i("5b58"),n=i.n(s);n.a}});
//# sourceMappingURL=app.f23ec596.js.map