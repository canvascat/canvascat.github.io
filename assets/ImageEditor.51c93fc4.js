import{P as e,k as t,f as n,D as a,aB as s,aW as o,ag as l,ae as r,ad as u,E as i,N as c,ak as d,aF as v,r as m,a8 as p,a4 as f,aX as h,al as y,F as x,aj as w,aV as g,q as E,G as M,M as b}from"./index.db59da40.js";import{l as R,a as k,d as _,b as C,c as I,e as z}from"./mosaic.196d42c6.js";const L=10,S=10,[P,j]=[120,88],[B,O]=[P/4,j/4];var q=e({props:{mousePoint:{type:Object,required:!0},canvas:{type:Object,required:!0}},setup(e){const{mousePoint:l,canvas:r}=t(e),u=n(null),i=a((()=>{const e={};if(l.value){const{x:t,y:n}=l.value;e.left=`${t+L}px`,e.top=`${n+S}px`}return e}));return s(l,o((e=>{if(!e||!r.value||!u.value)return;u.value.getContext("2d").drawImage(r.value,e.x-B/2,e.y-O/2,B,O,0,0,P,j)}))),document.body.style,{canvasRef:u,style:i}}});const F=v("data-v-630c79f0");l("data-v-630c79f0");const V={class:"capture-info__view"},T={ref:"canvasRef",width:"120",height:"88"},N=c("svg",{viewBox:"0 0 120 88",xmlns:"http://www.w3.org/2000/svg",fill:"none"},[c("path",{d:"M 0 1 H 119 V87 H1 V1",stroke:"red","stroke-width":"2"}),c("path",{d:"M 0 44 H 119",stroke:"red","stroke-width":"2"}),c("path",{d:"M 60 0 V 88",stroke:"red","stroke-width":"2"})],-1),Z={class:"capture-info__p"};r();const $=F(((e,t)=>(u(),i("div",{class:"capture-info__wrap",style:e.style},[c("div",V,[c("canvas",T,null,512),N]),c("div",Z,[d(e.$slots,"default")])],4))));q.render=$,q.__scopeId="data-v-630c79f0";let D=null;function G(e=document.getElementsByTagName("head")[0]){let t=document.createElement("style");return t.media="screen",e.appendChild(t),t}function A(e,t,n=function(){return null!=D?D:D=G()}()){n&&t&&n.sheet.insertRule(e+"{"+t+"}",0)}const H=[{position:["top"],cursor:"ns-resize"},{position:["bottom"],cursor:"ns-resize"},{position:["left"],cursor:"ew-resize"},{position:["right"],cursor:"ew-resize"},{position:["top","left"],cursor:"nwse-resize"},{position:["bottom","right"],cursor:"nwse-resize"},{position:["top","right"],cursor:"nesw-resize"},{position:["bottom","left"],cursor:"nesw-resize"}];var W=e({name:"ImageEditor",components:{InfoBox:q},setup(){const e=n(null),t=n(null),l=m({x:0,y:0,h:0,w:0}),r=n(null);let u=null;const i=n(null),c=n("0, 0, 0");let d=R.cloneDeep(l);const v={x:{min:0,max:0},y:{min:0,max:0}};let y=[],x=null;const w=a((()=>r.value&&["CREATE","RESIZE"].includes(r.value))),g=a((()=>{const{x:e,y:t,h:n,w:a}=l,[s,o,r,u]=[e,t,n,a].map((e=>`${e}px`));return{left:s,top:o,height:r,width:u}})),E=a((()=>{var t;return null==(t=e.value)?void 0:t.getContext("2d")}));function M(){var n;if(!e.value)return;I(e.value,t.value.querySelector("img")),null==(n=t.value)||n.requestFullscreen();const{width:a,height:s}=e.value;v.x.max=a,v.y.max=s}function b(e){e.target.classList[document.fullscreenElement?"add":"remove"]("fullscreen")}function L(e){d=R.cloneDeep(l),e.stopImmediatePropagation();const{x:t,y:n}=e;u={x:t,y:n},i.value={x:t,y:n},document.addEventListener("mousemove",S),document.addEventListener("mouseup",P),document.onselectstart=()=>!1}function S(e){if(!u||!r.value)return;const{x:t,y:n}=u,{x:a,y:s}=e,[o,c]=[a-t,s-n];switch(i.value={x:a,y:s},r.value){case"CREATE":l.w=Math.abs(o),l.h=Math.abs(c),l.x=Math.min(t,a),l.y=Math.min(n,s);break;case"MOVE":{const{x:e,y:t}=d,{h:n,w:a}=l;l.x=Math.min(Math.max(e+o,v.x.min),v.x.max-a),l.y=Math.min(Math.max(t+c,v.y.min),v.y.max-n);break}case"RESIZE":{const{h:e,y:t,w:n,x:o}=d;y.includes("top")?(l.y=Math.min(s,t+e),l.h=Math.abs(t-s+e)):y.includes("bottom")&&(l.y=Math.min(s,t),l.h=Math.abs(s-t)),y.includes("left")?(l.x=Math.min(a,o+n),l.w=Math.abs(o-a+n)):y.includes("right")&&(l.x=Math.min(a,o),l.w=Math.abs(a-o))}}}function P(e){var t;u=null,document.onselectstart=null,r.value=null,null==(t=null==x?void 0:x.parentNode)||t.removeChild(x),document.removeEventListener("mousemove",S),document.removeEventListener("mouseup",P)}return s(i,o((e=>{if(!E.value||!e)return;const{data:t}=E.value.getImageData(e.x,e.y,1,1);c.value=t.slice(0,3).join(", ")}))),p((()=>{var e;null==(e=t.value)||e.addEventListener("fullscreenchange",b)})),f((()=>{var e;null==(e=t.value)||e.removeEventListener("fullscreenchange",b)})),{openFile:function(){k().then((t=>{const{width:n,height:a}=screen;_(e.value,t,{width:n,height:a}),M()}))},downloadImage:function(){C(e.value),h.info("文件已开始下载")},requestFullscreen:M,screenShot:function(){e.value&&z(e.value).then((()=>{var e;null==(e=t.value)||e.requestFullscreen()}),console.warn)},startCapture:function(e){const{x:t,y:n}=e;Object.assign(l,{x:t,y:n}),r.value="CREATE",A("*","cursor: crosshair !important;",x=G()),L(e)},startMove:function(e){r.value="MOVE",A("*","cursor: move !important;",x=G()),L(e)},startResize:function(e,{position:t,cursor:n}){r.value="RESIZE",y=t,1===t.length&&A("*",`cursor: ${n} !important;`,x=G()),L(e)},captureLayerStyle:g,mousePoint:i,RESIZE_POINTS:H,RGB:c,captureLayer:l,infoBoxVisible:w,canvasRef:e,wrapRef:t}}});const X=v("data-v-5f5decec");l("data-v-5f5decec");const J=b("选择图片"),K=b("下载图片"),Q=b("全屏"),U=b("截图"),Y=c("img",{src:"/assets/test.c4dae957.png",alt:"",style:{display:"none"}},null,-1),ee={ref:"canvasRef",width:"400",height:"400"};r();const te=X(((e,t)=>{const n=y("el-button"),a=y("el-tooltip"),s=y("el-form-item"),o=y("el-form"),l=y("info-box");return u(),i(x,null,[c(o,{inline:!0,size:"mini"},{default:X((()=>[c(s,null,{default:X((()=>[c(a,{content:"选择图片后会进入全屏操作"},{default:X((()=>[c(n,{type:"primary",onClick:e.openFile},{default:X((()=>[J])),_:1},8,["onClick"])])),_:1}),c(n,{type:"primary",onClick:e.downloadImage},{default:X((()=>[K])),_:1},8,["onClick"]),c(n,{type:"primary",onClick:e.requestFullscreen},{default:X((()=>[Q])),_:1},8,["onClick"]),c(n,{onClick:e.screenShot},{default:X((()=>[U])),_:1},8,["onClick"])])),_:1})])),_:1}),c("div",{class:"wrapper",ref:"wrapRef",onMousedownOnce:t[2]||(t[2]=(...t)=>e.startCapture&&e.startCapture(...t))},[Y,c("canvas",ee,null,512),c("div",{class:"capture-layer",style:e.captureLayerStyle,onMousedown:t[1]||(t[1]=(...t)=>e.startMove&&e.startMove(...t))},[(u(!0),i(x,null,w(e.RESIZE_POINTS,(t=>(u(),i("i",{onMousedown:g((n=>e.startResize(n,t)),["prevent"]),key:t.position.join(),style:t.position.reduce(((e,t)=>Object.assign(e,{[t]:"-3px"})),{cursor:t.cursor}),class:"resize-point"},null,44,["onMousedown"])))),128))],36),e.infoBoxVisible?(u(),i(l,{key:0,mousePoint:e.mousePoint,canvas:e.canvasRef},{default:X((()=>[c("p",null,E(e.captureLayer.w)+" x "+E(e.captureLayer.h),1),c("p",null,"RGB("+E(e.RGB)+")",1)])),_:1},8,["mousePoint","canvas"])):M("",!0)],544)],64)}));W.render=te,W.__scopeId="data-v-5f5decec";export default W;
