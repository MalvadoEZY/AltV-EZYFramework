(function(t){function e(e){for(var i,s,c=e[0],r=e[1],l=e[2],f=0,d=[];f<c.length;f++)s=c[f],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&d.push(o[s][0]),o[s]=0;for(i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i]);u&&u(e);while(d.length)d.shift()();return a.push.apply(a,l||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],i=!0,c=1;c<n.length;c++){var r=n[c];0!==o[r]&&(i=!1)}i&&(a.splice(e--,1),t=s(s.s=n[0]))}return t}var i={},o={app:0},a=[];function s(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=i,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)s.d(n,i,function(e){return t[e]}.bind(null,i));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],r=c.push.bind(c);c.push=e,c=c.slice();for(var l=0;l<c.length;l++)e(c[l]);var u=r;a.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";n("85ec")},"0607":function(t,e,n){t.exports=n.p+"img/warning.cbedc34c.svg"},"0bdc":function(t,e,n){},"209c":function(t,e,n){t.exports=n.p+"img/close.abfda85e.svg"},"2f34":function(t,e,n){},4725:function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var i=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.pageLoaded?n("div",{attrs:{id:"app"}},[n("h1",{staticClass:"watermarker",on:{mouseover:t.enablesound}},[t._v(t._s(t.locale.SERVERNAME))]),t.speedometerState?n("speedometer",{attrs:{data:t.speedometerOBJ}}):t._e(),n("notification",{attrs:{notification:t.notificationOBJ}}),t.phoneState?n("phone"):t._e()],1):t._e()},a=[],s={SERVERNAME:"NONAME"},c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"speedometer_container"}},[n("h1",{staticClass:"speed"},[t._v(t._s(Math.floor(3.6*t.data.speed)))]),n("h1",{staticClass:"speed_label"},[t._v("km/h")]),n("h1",{staticClass:"distanceTraveled"},[t._v(t._s(t.data.distanceTraveled)+"km")]),n("h1",{staticClass:"fuel"},[t._v(t._s(t.data.fuel)+"L")])])},r=[],l={props:{data:Object}},u=l,f=(n("bbc6"),n("2877")),d=Object(f["a"])(u,c,r,!1,null,"79d37f34",null),p=d.exports,h=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"notification_container"}},[i("transition-group",{attrs:{name:"bounce",tag:"div"}},t._l(t.listOfNotifications,(function(e){return i("div",{key:e.id,staticClass:"notification_body",class:t.classObject},[i("div",{staticClass:"imgContainer"},[0===e.type?i("img",{attrs:{src:n("62e9")}}):t._e(),1===e.type?i("img",{attrs:{src:n("209c")}}):t._e(),2===e.type?i("img",{attrs:{src:n("0607")}}):t._e(),3===e.type?i("img",{attrs:{src:n("8b5a")}}):t._e()]),i("div",{staticClass:"contentContainer"},[i("h3",{staticClass:"content"},[t._v(t._s(e.message))])])])})),0)],1)},m=[],b=(n("1e5c"),{computed:{classObject:function(){return{success:0===this.notification.type,error:1===this.notification.type,warning:2===this.notification.type,info:3===this.notification.type}}},data:function(){return{notification:{},listOfNotifications:[]}},methods:{newNotification:function(t){var e=Math.random(1,2),n={type:t.type,message:t.text,time:t.time};n.id=e,this.notification=n}},watch:{notification:function(t){var e=this;this.listOfNotifications.push(t),setTimeout((function(){for(var n=0;n<e.listOfNotifications.length;n++)e.listOfNotifications[n].id===t.id&&e.$delete(e.listOfNotifications,n)}),1e3*t.time)}},mounted:function(){"alt"in window&&alt.on("base:notification",this.newNotification)}}),v=b,g=(n("9525"),Object(f["a"])(v,h,m,!1,null,"a08a6114",null)),_=g.exports,y=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},O=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"phone_container"}},[i("img",{staticClass:"phone_case",attrs:{src:n("d2cc")}}),i("img",{staticClass:"phone_background",attrs:{src:n("89ac")}}),i("section",{staticClass:"header"},[i("div",{staticClass:"headerInformation"},[i("h3",{staticClass:"label"},[t._v("0KB/s")]),i("h3",{staticClass:"right_label"},[t._v("100%")])]),i("div",{staticClass:"clockDate"},[i("h3",{staticClass:"label"},[t._v("15:20")]),i("h3",{staticClass:"sub-label"},[t._v("Qui, 12 de Novembro")])])]),i("section",{staticClass:"app_container"},[i("div",{staticClass:"footer"})])])}],w={},C=w,S=(n("5d6c"),Object(f["a"])(C,y,O,!1,null,"5778f926",null)),x=S.exports,j={name:"App",components:{speedometer:p,notification:_,phone:x},data:function(){return{locale:s,pageLoaded:!0,speedometerState:!1,phoneState:!1,notificationOBJ:{},speedometerOBJ:{speed:0,distanceTraveled:278,fuel:0}}},methods:{newSpeedometerData:function(t){this.speedometerOBJ=t},startWebview:function(){this.pageLoaded=!0},toggleSpeedMeter:function(t){this.speedometerState=t},enablesound:function(){var t=new AudioContext;t.loadSound("./assets/audio/success.ogg","success"),console.log("SOUND"),t.playSound("success")}},mounted:function(){"alt"in window&&(setTimeout((function(){alt.emit("base:ready")}),50),alt.on("base:toggleSpeedMeter",this.toggleSpeedMeter),alt.on("base:start",this.startWebview),alt.on("base:speedometerData",this.newSpeedometerData))}},N=j,E=(n("034f"),Object(f["a"])(N,o,a,!1,null,null,null)),M=E.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(M)}}).$mount("#app")},"5d6c":function(t,e,n){"use strict";n("2f34")},"62e9":function(t,e,n){t.exports=n.p+"img/check.8b4d6e74.svg"},"85ec":function(t,e,n){},"89ac":function(t,e,n){t.exports=n.p+"img/background.e0c4ddc1.jpg"},"8b5a":function(t,e,n){t.exports=n.p+"img/info.b351904d.svg"},9525:function(t,e,n){"use strict";n("4725")},bbc6:function(t,e,n){"use strict";n("0bdc")},d2cc:function(t,e,n){t.exports=n.p+"img/phone.4058ed0e.png"}});
//# sourceMappingURL=app.dba04fa6.js.map