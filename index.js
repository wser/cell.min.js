!function($root){var Membrane={inject:function(e,t,n,o){var r,i=null;return o&&e?(r=Phenotype.$type(t,n),t.hasOwnProperty("$cell")&&(i=e).parentNode&&i.parentNode.replaceChild(r,i),i=r):t.$type&&("head"===t.$type||"body"===t.$type)&&$root.document.getElementsByTagName(t.$type)?i=$root.document.getElementsByTagName(t.$type)[0]:t.id&&$root.document.getElementById(t.id)&&(i=$root.document.getElementById(t.id)).nodeName.toLowerCase()!==(t.$type||"div")&&(r=Phenotype.$type(t,n),i.parentNode.replaceChild(r,i),i=r),i&&!i.Meta&&(i.Meta={}),i},add:function(e,t,n,o){o=Phenotype.$type(t,o);return null!=n&&e.childNodes&&e.childNodes[n]?e.insertBefore(o,e.childNodes[n]):e.appendChild(o),o},build:function(e,t,n,o,r){r=Membrane.inject(e,t,o,r);return r||Membrane.add(e,t,n,o)}},Genotype={set:function(e,t,n){-1===["$init"].indexOf(t)?e.Genotype[t]=Nucleus.bind(e,n):(n.snapshot=n,e.Genotype[t]=n)},update:function(e,t,n){Nucleus.queue(e,t,"w"),Genotype.set(e,t,n)},build:function(e,t,n){for(var o in e.Genotype={},e.Inheritance=n,t)Genotype.set(e,o,t[o])},infect:function(e){var t=e.$virus;if(!t)return e;t=Array.isArray(t)?t:[t];return delete e.$virus,t.reduce(function(e,t){e=t(e);if(null===e||"object"!=typeof e)throw new Error("$virus mutations must return an object");return e.$type=e.$type||"div",e},e)}},Gene={freeze:function(e){var n=[],e=JSON.stringify(e,function(e,t){if("function"==typeof t)return t.toString();if("object"==typeof t&&null!==t){if(-1!==n.indexOf(t))return"[Circular]";n.push(t)}return t}),n=null;return e},LCS:function(o,e){for(var t,n=o.length,r=e.length,i=[],u=[],c=[],p=0;p<n;p++)u.push(Gene.freeze(o[p]));for(t=0;t<r;t++)c.push(Gene.freeze(e[t]));for(p=0;p<=n;p++)i.push([0]);for(t=0;t<r;t++)i[0].push(0);for(p=0;p<n;p++)for(t=0;t<r;t++)i[p+1][t+1]=u[p]===c[t]?i[p][t]+1:Math.max(i[p+1][t],i[p][t+1]);return function e(t,n){return t*n==0?[]:u[t-1]===c[n-1]?e(t-1,n-1).concat([{item:o[t-1],_old:t-1,_new:n-1}]):i[t][n-1]>i[t-1][n]?e(t,n-1):e(t-1,n)}(n,r)},diff:function(e,t){var n=Gene.LCS(e,t),o=n.map(function(e){return e._old}),e=e.map(function(e,t){return{item:e,index:t}}).filter(function(e,t){return-1===o.indexOf(t)}),r=n.map(function(e){return e._new});return{"-":e,"+":t.map(function(e,t){return{item:e,index:t}}).filter(function(e,t){return-1===r.indexOf(t)})}}},Phenotype={build:function(e,t){for(var n in Phenotype.$init(e),t)null!==t[n]&&void 0!==t[n]&&Phenotype.set(e,n,t[n])},multiline:function(e){return/\/\*!?(?:@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//.exec(e.toString())[1]},get:function(e){return Object.getOwnPropertyDescriptor($root.HTMLElement.prototype,e)||Object.getOwnPropertyDescriptor($root.Element.prototype,e)},set:function(e,t,n){var o;if("$"===t[0])"$type"===t?(o=e.tagName?e.tagName.toLowerCase():"text",n.toLowerCase()!==o&&(o=Phenotype.$type({$type:"fragment"}).$build(e.Genotype,e.Inheritance,null,e.Meta.namespace),e.parentNode.replaceChild(o,e),e=o)):"$text"===t?("function"==typeof n&&(n=Phenotype.multiline(n)),e.textContent=n):"$html"===t?("function"==typeof n&&(n=Phenotype.multiline(n)),e.innerHTML=n):"$components"===t&&Phenotype.$components(e,n);else if("_"!==t[0])if("value"===t)e[t]=n;else if("style"===t&&"object"==typeof n){var r,i=Phenotype.get(t).get.call(e);for(r in n)i[r]=n[r]}else"number"==typeof n||"string"==typeof n||"boolean"==typeof n?e.setAttribute&&e.setAttribute(t,n):"function"!=typeof n||(t=Phenotype.get(t))&&t.set.call(e,n)},$type:function(e,t){var n,o={};return"svg"===e.$type?(n=$root.document.createElementNS("http://www.w3.org/2000/svg",e.$type),o.namespace=n.namespaceURI):t?(n=$root.document.createElementNS(t,e.$type),o.namespace=n.namespaceURI):n="fragment"===e.$type?$root.document.createDocumentFragment():"text"===e.$type?(e.$text&&"function"==typeof e.$text&&(e.$text=Phenotype.multiline(e.$text)),$root.document.createTextNode(e.$text)):$root.document.createElement(e.$type||"div"),n.Meta=o,n},$components:function(o,e){e=e||[];var t=[].map.call(o.childNodes,function(e){return e.Genotype}).filter(function(e){return e});if(0<t.length){t=Gene.diff(t,e);t["-"].forEach(function(e){o.childNodes[e.index].Kill=!0}),[].filter.call(o.childNodes,function(e){return e.Kill}).forEach(function(e){o.removeChild(e)}),t["+"].forEach(function(e){var t,n=o.Inheritance;for(t in o.Genotype)"_"===t[0]&&(n=n.concat([t]));o.$build(e.item,n,e.index,o.Meta.namespace),o.$components[e.index]=o.childNodes[e.index].Genotype})}else{var n,r=Phenotype.$type({$type:"fragment"}),i=o.Inheritance;for(n in o.Genotype)"_"===n[0]&&(i=i.concat([n]));for(;o.firstChild;)o.removeChild(o.firstChild);e.forEach(function(e){r.$build(e,i,null,o.Meta.namespace)}),o.appendChild(r),o.$components=[].map.call(o.childNodes,function(e){return e.Genotype})}},$init:function(e){Nucleus.tick.call($root,function(){e.Genotype&&e.Genotype.$init&&Nucleus.bind(e,e.Genotype.$init)()})},$update:function(e){if(e.parentNode&&!e.Meta.$updated&&e.$update){for(var t in e.Meta.$updated=!0,e.$update(),e.Dirty)Phenotype.set(e,t,e.Genotype[t]);e.Meta.$updated=!1,e.Dirty=null}}},Nucleus={tick:$root.requestAnimationFrame||$root.webkitRequestAnimationFrame||$root.mozRequestAnimationFrame||$root.msRequestAnimationFrame||function(e){return $root.setTimeout(e,1e3/60)},set:function(n,o){try{Object.defineProperty(n,o,{configurable:!0,get:function(){if("$"!==o[0]&&"_"!==o[0])return"value"===o?Object.getOwnPropertyDescriptor(Object.getPrototypeOf(n),o).get.call(n):"style"!==o&&o in n.Genotype?n.Genotype[o]:Phenotype.get(o).get.call(n);if(o in n.Genotype)return Nucleus.queue(n,o,"r"),n.Genotype[o];if("_"!==o[0])return null;for(var e=n;e=e.parentNode;)if(e&&e.Genotype&&o in e.Genotype)return Nucleus.queue(e,o,"r"),e.Genotype[o]},set:function(e){var t=n;if(!(o in n.Genotype)&&"_"===o[0])for(;(t=t.parentNode)&&!(t&&t.Genotype&&o in t.Genotype););if(Genotype.update(t,o,e),"$"!==o[0]&&"_"!==o[0]){if("value"===o)return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(n),o).set.call(n,e);"style"===o&&"object"==typeof e?Phenotype.get(o).set.call(n,e):"number"==typeof e||"string"==typeof e||"boolean"==typeof e?n.setAttribute(o,e):"function"==typeof e&&Phenotype.get(o).set.call(n,e)}}})}catch(e){}},build:function(t){for(var e in["$type","$text","$html","$components"].forEach(function(e){e in t.Genotype||Nucleus.set(t,e)}),t.Inheritance&&t.Inheritance.forEach(function(e){Nucleus.set(t,e)}),t.Genotype)Nucleus.set(t,e)},_queue:[],bind:function(t,e){if("function"!=typeof e)return e;function n(){return Nucleus.tick.call($root,function(){Nucleus._queue.forEach(function(e){var t,n=!1;for(t in e.Dirty)Gene.freeze(e.Genotype[t])!==e.Dirty[t]&&(Phenotype.set(e,t,e.Genotype[t]),"_"===t[0]&&(n=!0));n&&"$update"in e.Genotype&&"function"==typeof e.Genotype.$update?Phenotype.$update(e):e.Dirty=null});var e=Nucleus._queue.indexOf(t);-1!==e&&Nucleus._queue.splice(e,1)}),e.apply(t,arguments)}return n.snapshot=e,n},queue:function(e,t,n){var o=e.Genotype[t];"r"===n&&"object"!=typeof o&&!Array.isArray(o)||(-1===Nucleus._queue.indexOf(e)&&Nucleus._queue.push(e),e.Dirty||(e.Dirty={}),t in e.Dirty||(e.Dirty[t]=Gene.freeze(e.Genotype[t])))}},God={detect:function(t){return void 0===t&&(t=this),Object.keys(t).filter(function(e){try{return/webkitStorageInfo|webkitIndexedDB/.test(e)||t[e]instanceof $root.Element?!1:t[e]&&Object.prototype.hasOwnProperty.call(t[e],"$cell")}catch(e){return!1}}).map(function(e){return t[e]})},plan:function($context){void 0===$context?$context=$root:$root=$context,$context.DocumentFragment.prototype.$build=$context.Element.prototype.$build=function(e,t,n,o,r){e=Genotype.infect(e),r=Membrane.build(this,e,n,o,r);return Genotype.build(r,e,t||[],n),Nucleus.build(r),Phenotype.build(r,r.Genotype),r},$context.DocumentFragment.prototype.$cell=$context.Element.prototype.$cell=function(e,t){return this.$build(e,[],null,t&&t.namespace||null,!0)},$context.DocumentFragment.prototype.$snapshot=$context.Element.prototype.$snapshot=function(){var json=JSON.stringify(this.Genotype,function(e,t){return"function"==typeof t&&t.snapshot?"("+t.snapshot.toString()+")":t});return JSON.parse(json,function(k,v){return"string"==typeof v&&0<=v.indexOf("function")?eval(v):v})},$root.NodeList&&!$root.NodeList.prototype.forEach&&($root.NodeList.prototype.forEach=Array.prototype.forEach)},create:function(t){return God.detect(t).map(function(e){return t.document.body.$build(e,[])})}},x;"undefined"!=typeof exports?(x={Phenotype:Phenotype,Genotype:Genotype,Nucleus:Nucleus,Gene:Gene,Membrane:Membrane,God:God,plan:God.plan.bind(God),create:God.create.bind(God)},"undefined"!=typeof module&&module.exports&&(exports=module.exports=x),exports=x):(God.plan(this),this.addEventListener&&this.addEventListener("load",function(){God.create(this)}))}(this);
