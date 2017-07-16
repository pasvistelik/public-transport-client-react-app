var serviceWorkerOption = {"assets":["/static/js/bundle.js","/static/css/style.css","/index.html","/asset-manifest.json"]};
        
        !function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="/",e(0)}([function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(3),i=r(o),s=n(2),a=r(s),u=n(6),l=r(u);console.log("Hello from SW...");var c="mosm-app-v1",f="mosm-tiles-v1",h=["/","/favicon.ico","/static/js/bundle.js","/static/css/style.css"];self.addEventListener("install",function(t){var e=caches.open(c).then(function(t){return console.log("install: opened cache"),t.addAll(h)}).then(function(){console.log("install: added all urls to cache")});t.waitUntil(e)}),self.addEventListener("activate",function(t){i.default.loadDataAndInitialize()});var p=[];self.addEventListener("message",function(t){var e=t.source;if("no-kill-sw"===t.data){if(p.includes(e.id))return;p.push(e.id),e.postMessage("no-kill-sw-accepted"),setInterval(function(){e.postMessage("no-kill-sw-accepted")},a.default.clientVsSwNoKillingMessageInterval)}else if("optimalWay"===t.data.requestType){console.log("SW: request for optimalWay."),i.default.loadDataAndInitialize();var n,r,o=t.data.params;try{var s=new l.default(i.default.getAllStations(),o.startOptimalRoutePoint,o.finalOptimalRoutePoint,o.startTime,o.transportTypes,o.goingSpeed,o.dopTimeMinutes);r=s.getOptimalWays()}catch(t){console.log(t),n=t}finally{e.postMessage({requestType:"optimalWayResult",result:r})}}}),self.addEventListener("fetch",function(t){var e=t.request.url;t.respondWith(caches.match(t.request).then(function(n){return n?n:(caches.open(f).then(function(t){return t.add(e)}),fetch(t.request))}))})},function(t,e){"use strict";function n(t,e){var n=6372795,r=.017453,o=t.lat*r,i=e.lat*r,s=t.lng*r,a=e.lng*r;return Math.acos(Math.sin(o)*Math.sin(i)+Math.cos(o)*Math.cos(i)*Math.cos(s-a))*n}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={apiPublicTransportServer:"https://ptp-97126.app.xervo.io/",apiGetStationsUrl:"https://publictransportproject.000webhostapp.com/new/json/stations.json",apiGetRoutesUrl:"https://publictransportproject.000webhostapp.com/new/json/routes.json",apiGetTimetablesUrl:"https://publictransportproject.000webhostapp.com/new/json/timetables.json",clientVsSwNoKillingMessageInterval:3e4}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function r(o,i){try{var s=e[o](i),a=s.value}catch(t){return void n(t)}return s.done?void t(a):Promise.resolve(a).then(function(t){r("next",t)},function(t){r("throw",t)})}return r("next")})}}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=function(){var t=i(regeneratorRuntime.mark(function t(){var e,n,r;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c.default.getAllStations();case 2:return S=t.sent,t.next=5,c.default.getAllRoutes();case 5:return T=t.sent,t.next=8,c.default.getAllTimetables();case 8:if(R=t.sent,b){t.next=27;break}if(null!=S){t.next=24;break}return console.log("Downloading stations from server..."),t.next=14,fetch(d.default.apiGetStationsUrl);case 14:return e=t.sent,t.next=17,e.text();case 17:S=t.sent,v=JSON.parse(S),void 0!==v&&null!=v&&c.default.pushAllStations(S),b=!0,console.log("Stations loaded from server."),t.next=27;break;case 24:v=JSON.parse(S),b=!0,console.log("Stations loaded from localStorage.");case 27:if(w){t.next=45;break}if(null!=T){t.next=42;break}return console.log("Downloading routes from server..."),t.next=32,fetch(d.default.apiGetRoutesUrl);case 32:return n=t.sent,t.next=35,n.text();case 35:T=t.sent,m=JSON.parse(T),void 0!==m&&null!=m&&c.default.pushAllRoutes(T),w=!0,console.log("Routes loaded from server."),t.next=45;break;case 42:m=JSON.parse(T),w=!0,console.log("Routes loaded from localStorage.");case 45:if(P){t.next=63;break}if(null!=R){t.next=60;break}return console.log("Downloading timetables from server..."),t.next=50,fetch(d.default.apiGetTimetablesUrl);case 50:return r=t.sent,t.next=53,r.text();case 53:R=t.sent,g=JSON.parse(R),void 0!==g&&null!=g&&c.default.pushAllTimetables(R),P=!0,console.log("Timetables loaded from server."),t.next=63;break;case 60:g=JSON.parse(R),P=!0,console.log("Timetables loaded from localStorage.");case 63:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),u=function(){var t=i(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(y){t.next=5;break}return y=!0,t.next=4,a();case 4:b&&w&&P&&(0,h.default)(v,m,g);case 5:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),l=n(4),c=r(l),f=n(11),h=r(f),p=n(2),d=r(p),v=null,m=null,g=null,y=!1,b=!1,w=!1,P=!1,S=null,T=null,R=null,x=function(){function t(){o(this,t)}return s(t,null,[{key:"getAllStations",value:function(){return v}},{key:"getAllRoutes",value:function(){return m}},{key:"getAllTimetables",value:function(){return g}},{key:"getAllStationsJSON",value:function(){return S}},{key:"getAllRoutesJSON",value:function(){return T}},{key:"getAllTimetablesJSON",value:function(){return R}},{key:"loadDataAndInitialize",value:function(){function t(){return e.apply(this,arguments)}var e=i(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u();case 2:case"end":return t.stop()}},t,this)}));return t}()},{key:"loadDataOnly",value:function(){function t(){return e.apply(this,arguments)}var e=i(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a();case 2:case"end":return t.stop()}},t,this)}));return t}()}]),t}();e.default=x},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function r(o,i){try{var s=e[o](i),a=s.value}catch(t){return void n(t)}return s.done?void t(a):Promise.resolve(a).then(function(t){r("next",t)},function(t){r("throw",t)})}return r("next")})}}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(){var t=r(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=new Promise(function(t,e){var n=indexedDB.open(u,1);n.onerror=function(t){e(t.target.error)},n.onsuccess=function(e){t(e.target.result)},n.onupgradeneeded=function(){var e=r(regeneratorRuntime.mark(function e(n){var r,o,s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.target.result,o=r.createObjectStore(l,{keyPath:"name"}),o.createIndex("json","json",{unique:!1}),e.next=5,i();case 5:s=e.sent,t(s);case 7:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()}),t.next=3,e;case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),s=function(){var t=r(regeneratorRuntime.mark(function t(e){var n;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=new Promise(function(){var t=r(regeneratorRuntime.mark(function t(n,r){var o,s,a,u;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i();case 2:o=t.sent,s=o.transaction([l],"readwrite"),a=s.objectStore(l),u=a.add({name:e.name,json:e.json}),u.onerror=function(t){r(t.target.error)},u.onsuccess=function(t){n(t.target.result)};case 8:case"end":return t.stop()}},t,this)}));return function(e,n){return t.apply(this,arguments)}}()),t.next=3,n;case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),a=function(){var t=r(regeneratorRuntime.mark(function t(e){var n;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=new Promise(function(){var t=r(regeneratorRuntime.mark(function t(n,r){var o,s,a,u;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i();case 2:o=t.sent,s=o.transaction([l]),a=s.objectStore(l),u=a.get(e),u.onsuccess=function(t){void 0!==t.target.result?n(t.target.result.json):r(t.target.error)},u.onerror=function(t){r(t.target.error)};case 8:case"end":return t.stop()}},t,this)}));return function(e,n){return t.apply(this,arguments)}}()),t.next=3,n;case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),u="public_transport2",l="json_data",c=function(){function t(){n(this,t)}return o(t,null,[{key:"getAllStations",value:function(){function t(){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,a("allStations");case 3:return t.abrupt("return",t.sent);case 6:return t.prev=6,t.t0=t.catch(0),t.abrupt("return",null);case 9:case"end":return t.stop()}},t,this,[[0,6]])}));return t}()},{key:"getAllRoutes",value:function(){function t(){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,a("allRoutes");case 3:return t.abrupt("return",t.sent);case 6:return t.prev=6,t.t0=t.catch(0),t.abrupt("return",null);case 9:case"end":return t.stop()}},t,this,[[0,6]])}));return t}()},{key:"getAllTimetables",value:function(){function t(){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,a("allTimetables");case 3:return t.abrupt("return",t.sent);case 6:return t.prev=6,t.t0=t.catch(0),t.abrupt("return",null);case 9:case"end":return t.stop()}},t,this,[[0,6]])}));return t}()},{key:"pushAllStations",value:function(){function t(t){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,s({name:"allStations",json:e});case 3:return t.abrupt("return",t.sent);case 6:return t.prev=6,t.t0=t.catch(0),t.abrupt("return",null);case 9:case"end":return t.stop()}},t,this,[[0,6]])}));return t}()},{key:"pushAllRoutes",value:function(){function t(t){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,s({name:"allRoutes",json:e});case 3:return t.abrupt("return",t.sent);case 6:return t.prev=6,t.t0=t.catch(0),t.abrupt("return",null);case 9:case"end":return t.stop()}},t,this,[[0,6]])}));return t}()},{key:"pushAllTimetables",value:function(){function t(t){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,s({name:"allTimetables",json:e});case 3:return t.abrupt("return",t.sent);case 6:return t.prev=6,t.t0=t.catch(0),t.abrupt("return",null);case 9:case"end":return t.stop()}},t,this,[[0,6]])}));return t}()}]),t}();e.default=c},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(){function t(e,r,o,i,s,a,u,l){n(this,t),null!=u?this.ignoringRoutes=u:this.ignoringRoutes=[],this.points=[],this.goingSpeed=s,this.time=o;var c=60*a;this.types=i,this.myIgnoringFragments=null,e.fillStartData(r,s,c,this.myIgnoringFragments),e.countShortWay(this.ignoringRoutes,this.myIgnoringFragments,o,i,s,c);var f=e.finalPoint;for(this.points.push(f.toString());null!=f.previousPoint;)if(f=f.previousPoint,this.points.push(f.toString()),null==f.previousPoint&&f.coords!==e.startPoint.coords)throw new Error("Где-то удалилась часть маршрута...");this.totalTimeSeconds=e.finalPoint.totalTimeSeconds,this.totalGoingTime=e.finalPoint.getTotalGoingTime(),this.totalTransportChangingCount=e.finalPoint.getTotalTransportChangingCount(),this.myPoints=e,this.isVisited=!1}return r(t,[{key:"setVisited",value:function(){this.isVisited=!0}}]),t}();e.default=o},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function a(t,e,n,r,o){for(var i=[],s=(0,v.default)(e,n),a=0,u=t.length,l=t[0];a<u;l=t[++a])null!=l&&s>(0,v.default)(e,l.coords)+r*(0,v.default)(l.coords,n)/o&&i.push(l);return i}Object.defineProperty(e,"__esModule",{value:!0});var u=n(5),l=r(u),c=n(7),f=r(c),h=n(9),p=r(h),d=n(1),v=r(d),m=40,g=function(t){function e(t,n,r,s,u,c,h){o(this,e);var d=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));d.getOptimalWays=function(){for(var t=[],e=0,n=this.length,r=this[0];e<n;r=this[++e])t.push(new f.default(r));return t},d.selectOptimalRouteWithMinimalMark=function(){for(var t=null,e=0,n=this.length,r=this[0];e<n;r=this[++e])if(!r.isVisited){for(t=r,r=this[++e];e<n;r=this[++e])!r.isVisited&&r.totalTimeSeconds<t.totalTimeSeconds&&(t=r);return t}return null};var v=new p.default(n,r),g=a(t,n,r,c,m);d.push(new l.default(v,g,s,u,c,h));for(var y=[],b=d[0];null!=b;b.setVisited(),b=d.selectOptimalRouteWithMinimalMark()){var w=.25;y=[];for(var P=b.myPoints.finalPoint;null!=P.previousPoint;P=P.previousPoint)null==P.fromWhichRoute||y.includes(P.fromWhichRoute)||y.push(P.fromWhichRoute);for(var S=0,T=y.length,R=y[0];S<T;R=y[++S])if(!b.ignoringRoutes.includes(R)){var x=[];x=x.concat(b.ignoringRoutes),x.push(R),v=new p.default(n,r);var k=new l.default(v,g,s,u,c,h,x);if(k.totalTimeSeconds<=d[0].totalTimeSeconds/w){for(var j=JSON.stringify(k.points),O=!1,_=0,M=d.length,W=d[0];_<M;W=d[++_])if(JSON.stringify(W.points)===j){O=!0;break}if(O)continue;d.push(k)}}}return d}return s(e,t),e}(Array);e.default=g},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=n(10),s=r(i),a=function t(e){o(this,t),this.totalTimeSeconds=e.totalTimeSeconds,this.totalGoingTimeSeconds=e.totalGoingTime,this.totalTransportChangingCount=e.totalTransportChangingCount,this.points=[];for(var n=e.myPoints.finalPoint;null!=n;n=n.previousPoint)this.points.push(new s.default(n.totalTimeSeconds,n.station,n.fromWhichRoute,n.coords));this.points.reverse()};e.default=a},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(){function t(e,r,o,i){n(this,t),void 0!==r.hashcode?(this.station=r,this.stationCode=r.hashcode,r.point=this,this.coords=r.coords):(this.coords=r,this.station=null,this.stationCode=null),this.totalTimeSeconds=e,this.fromWhichStation=o,this.fromWhichRoute=i,this.isVisited=!1,this.previousPoint=null}return r(t,[{key:"tryUpdate",value:function(t,e,n,r){return t<this.totalTimeSeconds&&(this.fromWhichRoute=r,this.previousPoint=e,this.totalTimeSeconds=t,this.fromWhichStation=n,!0)}},{key:"setVisited",value:function(){this.isVisited=!0}},{key:"toString",value:function(){var t,e;return t=null!=this.station?this.station.name:"null",e=null!=this.fromWhichRoute?this.fromWhichRoute.type+" "+this.fromWhichRoute.number+" "+this.fromWhichRoute.from+" - "+this.fromWhichRoute.to:"пешком","("+this.totalTimeSeconds+") "+t+" ("+e+")"}},{key:"getTotalGoingTime",value:function(){for(var t=0,e=this;null!=e.previousPoint;)null==e.fromWhichRoute&&(t+=e.totalTimeSeconds-e.previousPoint.totalTimeSeconds),e=e.previousPoint;return t}},{key:"getTotalTransportChangingCount",value:function(){for(var t=0,e=this;null!=e.previousPoint;)null!=e.fromWhichRoute&&null!=e.fromWhichRoute.hashcode&&e.fromWhichRoute!==e.previousPoint.fromWhichRoute&&t++,e=e.previousPoint;return t}}]),t}();e.default=o},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return Math.floor(t/(e/3.6))}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=n(8),u=r(a),l=n(1),c=r(l),f={table:1,periodic:2},h=function(){function t(e,n){o(this,t),this.collection=[],this.startPoint=new u.default(0,e,null,null),this.finalPoint=new u.default(216e7,n,null,null),this.currentSelectedPoint=null}return s(t,[{key:"findElement",value:function(t){if(null!=t.hashcode){if(null!=t.point)return t.point;var e=new u.default(216e7,t,null,null);return e.heuristicTimeToFinalPoint=(0,c.default)(e.coords,this.finalPoint.coords)/5,this.collection.push(e),e}for(var n=0,r=this.collection.length,o=this.collection[0];n<r;o=this.collection[++n])if(o.coords===t.coords&&o.stationCode===t.stationCode)return o;return null}},{key:"fillStartData",value:function(t,e,n,r){this.finalPoint.tryUpdate(i((0,c.default)(this.startPoint.coords,this.finalPoint.coords),e)+1800,this.startPoint,null,null);for(var o=this.finalPoint.coords,s=0,a=t.length,l=t[0];s<a;l=t[++s])if(null==r||!r.contains(l.hashcode,null,null)){var f=new u.default(216e7,l,null,null);f.heuristicTimeToFinalPoint=(0,c.default)(f.coords,o)/5,f.tryUpdate(i((0,c.default)(this.startPoint.coords,l.coords),e)+n,this.startPoint,null,null),this.collection.push(f)}}},{key:"getNextUnvisitedPoint",value:function(){return null!=this.currentSelectedPoint&&this.currentSelectedPoint.setVisited(),this.currentSelectedPoint=this.selectPointWithMinimalMark(),this.currentSelectedPoint}},{key:"selectPointWithMinimalMark",value:function(){for(var t=null,e=0,n=this.collection.length,r=this.collection[0];e<n;r=this.collection[++e])if(!r.isVisited){for(t=r,r=this.collection[++e];e<n;r=this.collection[++e])!r.isVisited&&r.totalTimeSeconds+r.heuristicTimeToFinalPoint<t.totalTimeSeconds+t.heuristicTimeToFinalPoint&&(t=r);return t}return null}},{key:"countShortWay",value:function(t,e,n,r,o,s){for(var a,u,l,h,p,d,v,m=this.getNextUnvisitedPoint();null!=m&&(u=m.totalTimeSeconds,!(u>this.finalPoint.totalTimeSeconds));m=this.getNextUnvisitedPoint()){if(a=m.station,l=a.hashcode,h=m.fromWhichRoute,null!=a){if(p=n+u,d=null,null==a.routes)continue;d=a.routes;for(var g,y=0,b=d.length,w=d[0];y<b;w=d[++y])if((null==t||!t.includes(w))&&r.includes(w.type)&&(g=w.getNextStation(a),null!=g)){var P=w.getTimetable(a);if(null!=e&&e.contains(g.hashcode,w.hashcode,l))continue;if(P.type===f.table){var S=p;null!=h&&h!==w&&(S+=s);var T=P.findTimeAfter(S),R=S+T,x=w.getTimetable(g),k=x.findTimeAfter(R),j=R-p+k+u;this.findElement(g).tryUpdate(j,m,a,w)}else if(P.type===f.periodic)throw new Error}}if(v=m.coords,null!=h){for(var O,_,M,W=0,C=this.collection.length,A=this.collection[0];W<C;A=this.collection[++W])if(!A.isVisited&&A!==m){if(null!=e&&e.contains(A.stationCode,null,l))continue;O=(0,c.default)(v,A.coords),_=i(O,o),M=u+_+s,A.tryUpdate(M,m,a,null)}if(null==e||!e.contains(null,null,l)){var N=u+i((0,c.default)(v,this.finalPoint.coords),o);this.finalPoint.tryUpdate(N,m,a,null)}}}for(var E=this.finalPoint.previousPoint;E!==this.startPoint;){null==E&&(console.log("err 1 in points.js"),console.log(this.finalPoint));var D=E.fromWhichRoute;if(null!=D){var U=E.previousPoint;if(U!==this.startPoint&&U.fromWhichRoute!==D){var V=D.getPreviousStation(U.station);if(null!=V){var J=V.point;if(null!=J&&J.isVisited){var G=D.getTimetable(V);null!=G&&J.totalTimeSeconds<=U.totalTimeSeconds&&(U.fromWhichRoute=D,U.previousPoint=J)}}}}E=E.previousPoint}}}]),t}();e.default=h},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function t(e,r,o,i){n(this,t),this.time=e,this.station=null==r?null:{hashcode:r.hashcode,name:r.name,routes:null,Coords:{lat:r.coords.lat,lng:r.coords.lng}},this.route=null==o?null:{vehicles:[],gpsTrack:null,hashcode:o.hashcode,number:o.number,type:o.type,from:o.from,to:o.to,owner:"",stations:null,timetables:null,stationsJSON:null},this.coords=i};e.default=r},function(t,e){"use strict";function n(t){for(var e=0;e<=1;e++)for(var n=0,r=this.stations[e].length;n<r;n++)if(this.stations[e][n]===t)return n+1!==r?this.stations[e][n+1]:null;return null}function r(t){for(var e=0;e<=1;e++)for(var n=0,r=this.stations[e].length;n<r;n++)if(this.stations[e][n]===t)return n!==r?this.stations[e][n-1]:null;return null}function o(t){for(var e=0;e<=1;e++)for(var n=0,r=this.stations[e].length;n<r;n++)if(this.stations[e][n]===t)return this.timetables[e][n];return null}function i(t){var e=new Date;e.setMinutes(0),e.setHours(0),e.setSeconds(t);for(var n=e.getDay(),r=0,o=this.table.length,i=this.table[0];r<o;i=this.table[++r])if(i.days.includes(n)){for(var s,a=0,u=i.times.length,l=i.times[0];a<u;l=i.times[++a])if(s=3600*l.hour+60*l.minute,s>=t)return s-t;if(0!==i.times.length)return 3600*i.times[0].hour+60*i.times[0].minute-t+86400;break}return 216e7}function s(t){var e=new Date;e.setMinutes(0),e.setHours(0),e.setSeconds(t);for(var n,r=e.getDay(),o=0,i=this.table.length,s=this.table[0],a=!1;o<i;s=this.table[++o])if(s.days.includes(r)){a=!1,n=null;for(var u=0,l=s.times.length,c=s.times[0];u<l&&3600*c.hour+60*c.minute<=t;c=s.times[++u])a=!0,n=c;if(a)return 3600*n.hour+60*n.minute-t;if(0!==s.times.length)return 3600*s.times[0].hour+60*s.times[0].minute-t-86400;break}return 0}function a(t,e,a){function u(t,e,n,r){null==t.routes&&(t.routes=[]),t.routes.includes(r)||t.routes.push(r),e.push(t);var o=a.find(function(e,n,o){return e.stationCode===t.hashcode&&e.routeCode===r.hashcode}),i=null==o?null:o;n.push(i)}console.log("Start initializing...");for(var l=Date.now(),c=[],f=[],h=0,p=t.length,d=t[0];h<p;d=t[++h])null!=d.routesCodes&&0!==d.routesCodes.length&&f.push(d);t=f;for(var v=0,m=e.length,g=e[0];v<m;g=e[++v])if(g.getNextStation=n,g.getPreviousStation=r,g.getTimetable=o,null!=g.stationsCodes&&0!==g.stationsCodes.length)try{g.stations=[[],[]],g.timetables=[[],[]];for(var y=0,b=[],w=[];y<=1;y++){var P=g.stationsCodes;if(null!=P[y]&&0!==P[y].length){for(var S=0,T=P[y].length,R=P[y][0];S<T;R=P[y][++S]){for(var x=!1,k=0,j=t.length,O=t[0];k<j;O=t[++k])if(null!=O&&O.hashcode===R){u(O,b,w,g),x=!0;break}if(!x)for(var _=0,M=t.length,W=t[0];_<M;W=t[++_])if(null!=W&&W.hashcode===R){u(W,b,w,g),c.includes(W)||c.push(W);break}}g.stations[y]=b,g.timetables[y]=w}}}catch(t){console.log(t);continue}console.log("Time = "+(Date.now()-l)+" ms.");for(var C=0,A=a.length,N=a[0];C<A;N=a[++C])N.findTimeAfter=i,N.findTimeBefore=s;console.log("Initialized. Time = "+(Date.now()-l)+" ms.")}Object.defineProperty(e,"__esModule",{value:!0}),e.default=a}]);
//# sourceMappingURL=sw.js.map