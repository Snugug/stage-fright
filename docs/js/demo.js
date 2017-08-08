function nodeMap(a,b){return Array.prototype.map.call(a,b)}function idleRun(a){if('requestIdleCallback'in window)window.requestIdleCallback(a);else{const b=Date.now();return setTimeout(()=>{a({didTimeout:!1,timeRemaining:()=>{return Math.max(0,50-(Date.now()-b))}})},1)}}function getActiveSlide(){const a=location.hash.split('/');return a.shift(),{section:parseInt(a[0]),slide:parseInt(a[1]),fragment:parseInt(a[2])}}var Matrix=class{constructor(){const a=document.currentScript.src.split('?'),b=a[0];let c={};1<a.length&&(c=buildOptions(a[1])),document.location.search&&(c=buildOptions(document.location.search.substr(1))),this._script=b,this._options=c,this._notes=!1,this._raw={stage:document.querySelector('._stage'),groups:document.querySelectorAll('._stage--group'),slides:document.querySelectorAll('._stage--slide')},this._slides=nodeMap(this._raw.groups,d=>{const g=d.querySelectorAll('._stage--slide');return nodeMap(g,h=>{const l=h.querySelectorAll('.fragment');return 0===l.length?h:[h].concat(nodeMap(l,m=>m))})})}get slides(){return this._slides}get stage(){return this._raw.stage}get script(){return this._script}get options(){return this._options}get notes(){return this._notes}set notes(a){return this._notes=a,a}};function buildOptions(a,b){let c=b||{};if(a){const d=`{"${decodeURI(a).replace(/&/g,'","').replace(/=/g,'":"')}"}`,g=JSON.parse(d,(h,l)=>{if(parseFloat(l).toString()===l)return parseFloat(l);try{return JSON.parse(l)}catch(m){return l}return l});c=Object.assign(g,c)}return c}var init=function(){const a=getActiveSlide();(isNaN(a.section)||isNaN(a.slide))&&history.pushState(null,null,`#/${0}/${0}`)},translate=function(a,b,c){const d=document.querySelector('._stage');let g=a,h=b;if(!(a&&b)&&0!==a&&0!==b){const n=getActiveSlide();a||(g=n.section),b||(h=n.slide)}const m=document.querySelector(`[data-slide="${h}"][data-section="${g}"]`).querySelectorAll('.fragment');for(let n=0;n<c;n++)m[n].setAttribute('data-active',!0);d.style.transform=`translateX(${-100*g}vw) translateY(${-100*h}vh)`},nav=class{static next(a){const c=getActiveSlide();let d=c.section,g=c.slide,h=c.fragment;return next(d,g,h,a)}static previous(a){const c=getActiveSlide();let d=c.section,g=c.slide,h=c.fragment;return previous(d,g,h,a)}static left(a){const c=getActiveSlide();let d=c.section,g=c.slide,h=c.fragment;return left(d,g,h,a)}static right(a){const c=getActiveSlide();let d=c.section,g=c.slide,h=c.fragment;return right(d,g,h,a)}static move(a,b,c){return translate(a,b,c)}};function move(a){let b=`#/${a.section}/${a.slide}`;const c=document.querySelector(`[data-slide="${a.slide}"][data-section="${a.section}"]`).querySelectorAll('.fragment[data-active]').length;isNaN(a.fragment)?(updateProgress(a.section,a.slide),translate(a.section,a.slide),0!==c&&(updateProgress(a.section,a.slide,c),a.fragment=c,b+=`/${c}`)):(updateProgress(a.section,a.slide,a.fragment),0!==a.fragment&&(b+=`/${a.fragment}`));const d=a.matrix.slides[a.section][a.slide].length-1;return Number.isInteger(d)&&isNaN(a.fragment)&&(a.fragment=0),history.pushState(null,null,b),sendMessage(a.matrix.notes,{position:{section:a.section+1,slide:a.slide+1,fragment:a.fragment,fragmentTotal:d,sectionTotal:a.matrix.slides.length,slideTotal:a.matrix.slides[a.section].length}}),sendNotes(a.section,a.slide,a.matrix),{section:a.section,slide:a.slide,fragment:a.fragment}}function right(a,b,c,d){let g=a,h=b;return sendMessage(d.notes,{move:'right'}),g=nextSection(g,d),h>lastSlide(g,d)&&(h=0),move({section:g,slide:h,matrix:d})}function left(a,b,c,d){let g=a,h=b;return sendMessage(d.notes,{move:'left'}),g=previousSection(g),h>lastSlide(g,d)&&(h=0),move({section:g,slide:h,matrix:d})}function previous(a,b,c,d){let g=a,h=b;if(sendMessage(d.notes,{move:'previous'}),Array.isArray(d.slides[g][h])){let m=d.slides[g][h][0].querySelectorAll('.fragment[data-active]');if(m){const n=m.length-1;if(0<=n)return m[n].removeAttribute('data-active'),move({section:g,slide:h,fragment:n,matrix:d})}}return h-=1,0>h&&(g=previousSection(g),h=0===g?0:lastSlide(g,d)),move({section:g,slide:h,matrix:d})}function next(a,b,c,d){let g=a,h=b,l=c;const m=d.slides.length;if(sendMessage(d.notes,{move:'next'}),Array.isArray(d.slides[g][h])){let n=d.slides[g][h][0].querySelector('.fragment:not([data-active])');if(n){const q=d.slides[g][h][0].querySelectorAll('.fragment[data-active]').length+1;return n.setAttribute('data-active',!0),move({section:g,slide:h,fragment:q,matrix:d})}}if(h+=1,l=void 0,h>lastSlide(g,d)){g=nextSection(g,d);let n=lastSlide(g,d);g===m-1&&h>n?h=n:g<=m-1&&(h=0)}return move({section:g,slide:h,fragment:l,matrix:d})}function previousSection(a){let b=a;return b-=1,0>b&&(b=0),b}function nextSection(a,b){let c=a;const d=b.slides.length;return c+=1,c>=d&&(c=d-1),c}function lastSlide(a,b){const d=b.slides[a].length;return d-1}function openNotes(a){const b={go:getActiveSlide()},c=a.slides[b.go.section][b.go.slide].length-1;let d=b.go.fragment;Number.isInteger(c)&&isNaN(b.go.fragment)&&(d=0);const g={position:{section:b.go.section+1,slide:b.go.slide+1,fragment:d,fragmentTotal:c,sectionTotal:a.slides.length,slideTotal:a.slides[b.go.section].length}},h=window.location;slideMessage(a);const l=window.open(`${h.origin}${h.pathname}?notes=true`,'Stage Fright - Notes','width=1100,height=700');return setTimeout(()=>{sendMessage(l,b),sendMessage(l,g),sendNotes(b.go.section,b.go.slide,a)},1e3),l}function body(){const a=window.location,b=`
<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
<div class="_speaker-notes">
  <!-- Slide Preview -->
  <!-- Current Slide -->
  <div class="_speaker-notes--current">
    <iframe class="_speaker-notes--current-slide" src="${a.origin}${a.pathname}?progress=false&responsive=true&listen=true${a.hash}" frameborder="0" height="1024" width="1280"></iframe>
  </div>

  <!-- Upcoming Slide Slide -->
  <div class="_speaker-notes--upcoming">
    <span class="_speaker-notes--label">Upcoming:</span>
    <iframe class="_speaker-notes--upcoming-slide" src="${a.origin}${a.pathname}?progress=false&responsive=true&listen=true${a.hash}" frameborder="0" height="1024" width="1280"></iframe>
  </div>

  <!-- Controls -->
  <div class="_speaker-notes--controls">
    <div class="controls">
      <div class="controls--time">
        <h4 class="controls--label">Time <span class="controls--reset">Click to Reset</span></h4>
        <div class="timer">
          <span class="timer--hours">00</span><span class="timer--minutes">:00</span><span class="timer--seconds">:00</span>
        </div>
        <div class="clock">
          <span class="clock--value">0:00 AM</span>
        </div>
        <div class="controls--clear"></div>
      </div>
      <div class="controls--position">
        <p class="controls--fragment">Fragment <span class="controls--fragment-current"></span>/<span class="controls--fragment-total"></span></p>

        <p class="controls--slide">Slide <span class="controls--slide-current"></span>/<span class="controls--slide-total"></span></p>

        <p class="controls--section">Section <span class="controls--section-current"></span>/<span class="controls--section-total"></span></p>

      </div>
    </div>
  </div>

  <article class="_speaker-notes--notes">
    <div class="slide-notes">
      <h4 class="slide-notes--label">Notes</h4>
      <div class="slide-notes--content"></div>
    </div>
  </article>

</div>
`;return document.body.innerHTML=b,b}function sendNotes(a,b,c){let d=document.querySelector(`[data-slide="${b}"][data-section="${a}"] ._stage--notes`);return d=d?d.innerHTML:'<p></p>',sendMessage(c.notes,{notes:d}),d}function timing(){function a(){const q=new Date,r=q.getTime()-m.getTime(),t=Math.floor(r/3600000),u=Math.floor(r/60000%60),w=Math.floor(r/1e3%60);c.textContent=q.toLocaleTimeString('en-US',{hour12:!1,hour:'2-digit',minute:'2-digit'}),d.textContent=b(t),g.textContent=`:${b(u)}`,h.textContent=`:${b(w)}`,0>=t?d.setAttribute('data-mute',!0):d.removeAttribute('data-mute'),0>=u?g.setAttribute('data-mute',!0):g.removeAttribute('data-mute')}function b(q){const r=`00${parseInt(q)}`;return r.substring(r.length-2)}const c=document.querySelector('.clock--value'),d=document.querySelector('.timer--hours'),g=document.querySelector('.timer--minutes'),h=document.querySelector('.timer--seconds'),l=document.querySelector('.controls--time');let m=new Date;a();let n=setInterval(a,1e3);l.addEventListener('click',()=>{m=new Date,clearInterval(n),d.textContent=b(0),g.textContent=`:${b(0)}`,h.textContent=`:${b(0)}`,n=setInterval(a,1e3)})}function sendMessage(a,b){const c=window.location;a&&a.postMessage(b,c.origin)}function slideMessage(a){window.addEventListener('message',b=>{const c=b.origin||event.originalEvent.origin;return c===window.location.origin?b.data.move?nav[b.data.move](a):void 0:void 0},!1)}function notesMessage(){const a=document.querySelector('._speaker-notes--current-slide'),b=document.querySelector('._speaker-notes--upcoming-slide'),c=document.querySelector('.controls--fragment'),d=document.querySelector('.controls--fragment-current'),g=document.querySelector('.controls--fragment-total'),h=document.querySelector('.controls--slide-current'),l=document.querySelector('.controls--slide-total'),m=document.querySelector('.controls--section-current'),n=document.querySelector('.controls--section-total'),q=document.querySelector('.slide-notes--content'),r=window.opener;sendMessage(r,'Speaker Notes Opened'),document.addEventListener('keydown',t=>{(38===t.keyCode||33===t.keyCode)&&sendMessage(r,{move:'previous'}),(40===t.keyCode||34===t.keyCode||32===t.keyCode)&&sendMessage(r,{move:'next'})}),window.addEventListener('message',t=>{const u=t.origin||event.originalEvent.origin;if(u===window.location.origin){if(t.data.position)if(h.textContent=t.data.position.slide,l.textContent=t.data.position.slideTotal,m.textContent=t.data.position.section,n.textContent=t.data.position.sectionTotal,Number.isInteger(t.data.position.fragmentTotal)){c.setAttribute('data-active',!0);t.data.position.fragment;d.textContent=t.data.position.fragment,g.textContent=t.data.position.fragmentTotal}else c.removeAttribute('data-active'),d.textContent=1,g.textContent=1;if(t.data.move&&(sendMessage(a.contentWindow,{move:t.data.move}),sendMessage(b.contentWindow,{move:t.data.move})),t.data.go){console.log(t.data.go);let w=`#/${t.data.go.section}/${t.data.go.slide}`;t.data.go.fragment&&(w+=`/${t.data.go.fragment}`),a.src+=w,b.src+=w,sendMessage(b.contentWindow,{move:'next'})}t.data.notes&&(q.innerHTML=t.data.notes)}},!1)}var progress=function(a){idleRun(()=>{const b=document.createElement('nav');b.classList.add('progress');const c=getActiveSlide();let d=0;a.slides.forEach(g=>{const h=document.createElement('div');h.setAttribute('data-section',d),h.classList.add('progress--section');let l=0;g.forEach(m=>{const n=document.createElement('a');n.href=`#/${d}/${l}`,n.classList.add('progress--slide'),n.setAttribute('data-slide',l),n.setAttribute('data-section',d),n.setAttribute('tabindex','-1'),n.textContent=`Section ${d}, Slide ${l}`,Array.isArray(m)&&(n.style.opacity=.5,n.setAttribute('data-fragments',m.length-1)),c.section===d&&c.slide===l&&n.setAttribute('data-active','true'),h.appendChild(n),Array.isArray(m)?(m[0].setAttribute('data-slide',l),m[0].setAttribute('data-section',d),c.section===d&&c.slide===l&&m[0].setAttribute('data-active',!0)):(m.setAttribute('data-slide',l),m.setAttribute('data-section',d),c.section===d&&c.slide===l&&m.setAttribute('data-active',!0)),l++}),b.appendChild(h),d++}),!1!==a.options.progress&&document.body.appendChild(b),translate(c.section,c.slide,c.fragment),updateProgress(c.section,c.slide,c.fragment)}),window.addEventListener('hashchange',()=>{const c=getActiveSlide();updateProgress(c.section,c.slide,c.fragment),translate(c.section,c.slide,c.fragment),sendMessage(a.notes,{go:c})})};function updateProgress(a,b,c){const d=document.querySelectorAll('[data-active]:not(.fragment)'),g=document.querySelectorAll(`[data-section="${a}"][data-slide="${b}"`),h=document.querySelector('.progress--slide[data-active]');if(h)if(c){const l=parseInt(h.getAttribute('data-fragments'));c===l?(h.style.transitionProperty='none',h.style.opacity=1):(h.style.transitionProperty='none',h.style.opacity=.5)}else h.style.transitionProperty='all',nodeMap(d,l=>{l.removeAttribute('data-active')}),nodeMap(g,l=>{l.setAttribute('data-active','true')})}var keys=function(a){document.addEventListener('keydown',b=>{return a.stage.hasAttribute('data-overlay')?void 0:37===b.keyCode?nav.left(a):39===b.keyCode?nav.right(a):38===b.keyCode||33===b.keyCode?nav.previous(a):40===b.keyCode||34===b.keyCode||32===b.keyCode?nav.next(a):83===b.keyCode?(a.notes=openNotes(a),a):void 0})},overview=function(a){let b=!1;const c=a._raw.slides;document.addEventListener('keydown',d=>{if(27===d.keyCode){function g(u){const w=u.target.closest('[data-section][data-slide]');let x=w.getAttribute('data-section'),y=w.getAttribute('data-slide');h(c),a.stage.removeAttribute('data-overlay'),history.pushState(null,null,`#/${x}/${y}`),updateProgress(x,y),translate(x,y),b=!1}function h(u){nodeMap(u,w=>{w.removeEventListener('click',g)})}if(b=!b,!1==b)return a.stage.removeAttribute('data-overlay'),h(c),void translate();const l=window.innerWidth,m=window.innerHeight,n=a.stage.scrollWidth,q=a.stage.scrollHeight,r=l/n,t=m/q;if(r<=t){a.stage.style.transform=`scale(${l/(n+64/r)})`,a.stage.style.transformOrigin=`32px ${q*r/2-32}px`}else{let w=hwidth/(n+64/t);a.stage.style.transform=`scale(${w})`,a.stage.style.transformOrigin=`${n*t/2-32}px 32px`}a.stage.setAttribute('data-overlay','true'),nodeMap(c,u=>{u.addEventListener('click',g)})}})},stageFright=function(){const a=new Matrix;a.options.notes?(body(),timing(),notesMessage()):(init(),progress(a),keys(a),overview(a)),a.options.listen&&slideMessage(a),document.body.classList.add('stage-fright'),a.options.responsive&&(document.body.style.fontSize='1.5vw')};stageFright();var _self='undefined'==typeof window?'undefined'!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{}:window,Prism$1=function(){var a=/\blang(?:uage)?-(\w+)\b/i,b=0,c=_self.Prism={util:{encode:function(h){return h instanceof d?new d(h.type,c.util.encode(h.content),h.alias):'Array'===c.util.type(h)?h.map(c.util.encode):h.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\u00a0/g,' ')},type:function(h){return Object.prototype.toString.call(h).match(/\[object (\w+)\]/)[1]},objId:function(h){return h.__id||Object.defineProperty(h,'__id',{value:++b}),h.__id},clone:function(h){var l=c.util.type(h);switch(l){case'Object':var m={};for(var n in h)h.hasOwnProperty(n)&&(m[n]=c.util.clone(h[n]));return m;case'Array':return h.map&&h.map(function(q){return c.util.clone(q)});}return h}},languages:{extend:function(h,l){var m=c.util.clone(c.languages[h]);for(var n in l)m[n]=l[n];return m},insertBefore:function(h,l,m,n){n=n||c.languages;var q=n[h];if(2==arguments.length){for(var r in m=arguments[1],m)m.hasOwnProperty(r)&&(q[r]=m[r]);return q}var t={};for(var u in q)if(q.hasOwnProperty(u)){if(u==l)for(var r in m)m.hasOwnProperty(r)&&(t[r]=m[r]);t[u]=q[u]}return c.languages.DFS(c.languages,function(w,x){x===n[h]&&w!=h&&(this[w]=t)}),n[h]=t},DFS:function(h,l,m,n){for(var q in n=n||{},h)h.hasOwnProperty(q)&&(l.call(h,q,h[q],m||q),'Object'!==c.util.type(h[q])||n[c.util.objId(h[q])]?'Array'===c.util.type(h[q])&&!n[c.util.objId(h[q])]&&(n[c.util.objId(h[q])]=!0,c.languages.DFS(h[q],l,q,n)):(n[c.util.objId(h[q])]=!0,c.languages.DFS(h[q],l,null,n)))}},plugins:{},highlightAll:function(h,l){var m={callback:l,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};c.hooks.run('before-highlightall',m);for(var r,n=m.elements||document.querySelectorAll(m.selector),q=0;r=n[q++];)c.highlightElement(r,!0===h,m.callback)},highlightElement:function(h,l,m){for(var n,q,r=h;r&&!a.test(r.className);)r=r.parentNode;r&&(n=(r.className.match(a)||[,''])[1].toLowerCase(),q=c.languages[n]),h.className=h.className.replace(a,'').replace(/\s+/g,' ')+' language-'+n,r=h.parentNode,/pre/i.test(r.nodeName)&&(r.className=r.className.replace(a,'').replace(/\s+/g,' ')+' language-'+n);var t=h.textContent,u={element:h,language:n,grammar:q,code:t};if(c.hooks.run('before-sanity-check',u),!u.code||!u.grammar)return u.code&&(u.element.textContent=u.code),void c.hooks.run('complete',u);if(c.hooks.run('before-highlight',u),l&&_self.Worker){var w=new Worker(c.filename);w.onmessage=function(x){u.highlightedCode=x.data,c.hooks.run('before-insert',u),u.element.innerHTML=u.highlightedCode,m&&m.call(u.element),c.hooks.run('after-highlight',u),c.hooks.run('complete',u)},w.postMessage(JSON.stringify({language:u.language,code:u.code,immediateClose:!0}))}else u.highlightedCode=c.highlight(u.code,u.grammar,u.language),c.hooks.run('before-insert',u),u.element.innerHTML=u.highlightedCode,m&&m.call(h),c.hooks.run('after-highlight',u),c.hooks.run('complete',u)},highlight:function(h,l,m){var n=c.tokenize(h,l);return d.stringify(c.util.encode(n),m)},tokenize:function(h,l){var n=c.Token,q=[h],r=l.rest;if(r){for(var t in r)l[t]=r[t];delete l.rest}tokenloop:for(var t in l)if(l.hasOwnProperty(t)&&l[t]){var u=l[t];u='Array'===c.util.type(u)?u:[u];for(var w=0;w<u.length;++w){var x=u[w],y=x.inside,z=!!x.lookbehind,A=!!x.greedy,B=0,C=x.alias;if(A&&!x.pattern.global){var D=x.pattern.toString().match(/[imuy]*$/)[0];x.pattern=RegExp(x.pattern.source,D+'g')}x=x.pattern||x;for(var G,E=0,F=0;E<q.length;F+=q[E].length,++E){if(G=q[E],q.length>h.length)break tokenloop;if(!(G instanceof n)){x.lastIndex=0;var H=x.exec(G),I=1;if(!H&&A&&E!=q.length-1){if(x.lastIndex=F,H=x.exec(h),!H)break;for(var J=H.index+(z?H[1].length:0),K=H.index+H[0].length,L=E,M=F,N=q.length;L<N&&M<K;++L)M+=q[L].length,J>=M&&(++E,F=M);if(q[E]instanceof n||q[L-1].greedy)continue;I=L-E,G=h.slice(F,M),H.index-=F}if(H){z&&(B=H[1].length);var J=H.index+B,H=H[0].slice(B),K=J+H.length,O=G.slice(0,J),P=G.slice(K),Q=[E,I];O&&Q.push(O);var R=new n(t,y?c.tokenize(H,y):H,C,H,A);Q.push(R),P&&Q.push(P),Array.prototype.splice.apply(q,Q)}}}}}return q},hooks:{all:{},add:function(h,l){var m=c.hooks.all;m[h]=m[h]||[],m[h].push(l)},run:function(h,l){var m=c.hooks.all[h];if(m&&m.length)for(var q,n=0;q=m[n++];)q(l)}}},d=c.Token=function(h,l,m,n,q){this.type=h,this.content=l,this.alias=m,this.length=0|(n||'').length,this.greedy=!!q};if(d.stringify=function(h,l,m){if('string'==typeof h)return h;if('Array'===c.util.type(h))return h.map(function(t){return d.stringify(t,l,h)}).join('');var n={type:h.type,content:d.stringify(h.content,l,m),tag:'span',classes:['token',h.type],attributes:{},language:l,parent:m};if('comment'==n.type&&(n.attributes.spellcheck='true'),h.alias){var q='Array'===c.util.type(h.alias)?h.alias:[h.alias];Array.prototype.push.apply(n.classes,q)}c.hooks.run('wrap',n);var r=Object.keys(n.attributes).map(function(t){return t+'="'+(n.attributes[t]||'').replace(/"/g,'&quot;')+'"'}).join(' ');return'<'+n.tag+' class="'+n.classes.join(' ')+'"'+(r?' '+r:'')+'>'+n.content+'</'+n.tag+'>'},!_self.document)return _self.addEventListener?(_self.addEventListener('message',function(h){var l=JSON.parse(h.data),m=l.language,n=l.code,q=l.immediateClose;_self.postMessage(c.highlight(n,c.languages[m],m)),q&&_self.close()},!1),_self.Prism):_self.Prism;var g=document.currentScript||[].slice.call(document.getElementsByTagName('script')).pop();return g&&(c.filename=g.src,document.addEventListener&&!g.hasAttribute('data-manual')&&('loading'===document.readyState?document.addEventListener('DOMContentLoaded',c.highlightAll):window.requestAnimationFrame?window.requestAnimationFrame(c.highlightAll):window.setTimeout(c.highlightAll,16))),_self.Prism}();'undefined'!=typeof module&&module.exports&&(module.exports=Prism$1),'undefined'!=typeof global&&(global.Prism=Prism$1),Prism$1.languages.markup={comment:/<!--[\w\W]*?-->/,prolog:/<\?[\w\W]+?\?>/,doctype:/<!DOCTYPE[\w\W]+?>/i,cdata:/<!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,inside:{tag:{pattern:/^<\/?[^\s>\/]+/i,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,inside:{punctuation:/[=>"']/}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:/&#?[\da-z]{1,8};/i},Prism$1.hooks.add('wrap',function(a){'entity'===a.type&&(a.attributes.title=a.content.replace(/&amp;/,'&'))}),Prism$1.languages.xml=Prism$1.languages.markup,Prism$1.languages.html=Prism$1.languages.markup,Prism$1.languages.mathml=Prism$1.languages.markup,Prism$1.languages.svg=Prism$1.languages.markup,Prism$1.languages.css={comment:/\/\*[\w\W]*?\*\//,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:/url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,selector:/[^\{\}\s][^\{\};]*?(?=\s*\{)/,string:{pattern:/("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,greedy:!0},property:/(\b|\B)[\w-]+(?=\s*:)/i,important:/\B!important\b/i,function:/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:]/},Prism$1.languages.css.atrule.inside.rest=Prism$1.util.clone(Prism$1.languages.css),Prism$1.languages.markup&&(Prism$1.languages.insertBefore('markup','tag',{style:{pattern:/(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,lookbehind:!0,inside:Prism$1.languages.css,alias:'language-css'}}),Prism$1.languages.insertBefore('inside','attr-value',{"style-attr":{pattern:/\s*style=("|').*?\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:Prism$1.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:Prism$1.languages.css}},alias:'language-css'}},Prism$1.languages.markup.tag)),Prism$1.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0}],string:{pattern:/(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,boolean:/\b(true|false)\b/,function:/[a-z0-9_]+(?=\()/i,number:/\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/},Prism$1.languages.javascript=Prism$1.languages.extend('clike',{keyword:/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,number:/\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,function:/[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/}),Prism$1.languages.insertBefore('javascript','keyword',{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,lookbehind:!0,greedy:!0}}),Prism$1.languages.insertBefore('javascript','string',{"template-string":{pattern:/`(?:\\\\|\\?[^\\])*?`/,greedy:!0,inside:{interpolation:{pattern:/\$\{[^}]+\}/,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:'punctuation'},rest:Prism$1.languages.javascript}},string:/[\s\S]+/}}}),Prism$1.languages.markup&&Prism$1.languages.insertBefore('markup','tag',{script:{pattern:/(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,lookbehind:!0,inside:Prism$1.languages.javascript,alias:'language-javascript'}}),Prism$1.languages.js=Prism$1.languages.javascript,function(){'undefined'!=typeof self&&self.Prism&&self.document&&document.querySelector&&(self.Prism.fileHighlight=function(){var a={js:'javascript',py:'python',rb:'ruby',ps1:'powershell',psm1:'powershell',sh:'bash',bat:'batch',h:'c',tex:'latex'};Array.prototype.forEach&&Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(b){for(var d,c=b.getAttribute('data-src'),g=b,h=/\blang(?:uage)?-(?!\*)(\w+)\b/i;g&&!h.test(g.className);)g=g.parentNode;if(g&&(d=(b.className.match(h)||[,''])[1]),!d){var l=(c.match(/\.(\w+)$/)||[,''])[1];d=a[l]||l}var m=document.createElement('code');m.className='language-'+d,b.textContent='',m.textContent='Loading\u2026',b.appendChild(m);var n=new XMLHttpRequest;n.open('GET',c,!0),n.onreadystatechange=function(){4==n.readyState&&(400>n.status&&n.responseText?(m.textContent=n.responseText,Prism$1.highlightElement(m)):400<=n.status?m.textContent='\u2716 Error '+n.status+' while fetching file: '+n.statusText:m.textContent='\u2716 Error: File does not exist or is empty')},n.send(null)})},document.addEventListener('DOMContentLoaded',self.Prism.fileHighlight))}(),function(a){var b={variable:[{pattern:/\$?\(\([\w\W]+?\)\)/,inside:{variable:[{pattern:/(^\$\(\([\w\W]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,operator:/--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\([^)]+\)|`[^`]+`/,inside:{variable:/^\$\(|^`|\)$|`$/}},/\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i]};a.languages.bash={shebang:{pattern:/^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,alias:'important'},comment:{pattern:/(^|[^"{\\])#.*/,lookbehind:!0},string:[{pattern:/((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,lookbehind:!0,greedy:!0,inside:b},{pattern:/(["'])(?:\\\\|\\?[^\\])*?\1/g,greedy:!0,inside:b}],variable:b.variable,function:{pattern:/(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,lookbehind:!0},keyword:{pattern:/(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,lookbehind:!0},boolean:{pattern:/(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,lookbehind:!0},operator:/&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];]/};var c=b.variable[1].inside;c['function']=a.languages.bash['function'],c.keyword=a.languages.bash.keyword,c.boolean=a.languages.bash.boolean,c.operator=a.languages.bash.operator,c.punctuation=a.languages.bash.punctuation}(Prism),Prism.languages.javascript=Prism.languages.extend('clike',{keyword:/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,number:/\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,function:/[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/}),Prism.languages.insertBefore('javascript','keyword',{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,lookbehind:!0,greedy:!0}}),Prism.languages.insertBefore('javascript','string',{"template-string":{pattern:/`(?:\\\\|\\?[^\\])*?`/,greedy:!0,inside:{interpolation:{pattern:/\$\{[^}]+\}/,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:'punctuation'},rest:Prism.languages.javascript}},string:/[\s\S]+/}}}),Prism.languages.markup&&Prism.languages.insertBefore('markup','tag',{script:{pattern:/(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,lookbehind:!0,inside:Prism.languages.javascript,alias:'language-javascript'}}),Prism.languages.js=Prism.languages.javascript,Prism.languages.scss=Prism.languages.extend('css',{comment:{pattern:/(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,lookbehind:!0},atrule:{pattern:/@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,inside:{rule:/@[\w-]+/}},url:/(?:[-a-z]+-)*url(?=\()/i,selector:{pattern:/(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,inside:{parent:{pattern:/&/,alias:'important'},placeholder:/%[-_\w]+/,variable:/\$[-_\w]+|#\{\$[-_\w]+\}/}}}),Prism.languages.insertBefore('scss','atrule',{keyword:[/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,{pattern:/( +)(?:from|through)(?= )/,lookbehind:!0}]}),Prism.languages.scss.property={pattern:/(?:[\w-]|\$[-_\w]+|#\{\$[-_\w]+\})+(?=\s*:)/i,inside:{variable:/\$[-_\w]+|#\{\$[-_\w]+\}/}},Prism.languages.insertBefore('scss','important',{variable:/\$[-_\w]+|#\{\$[-_\w]+\}/}),Prism.languages.insertBefore('scss','function',{placeholder:{pattern:/%[-_\w]+/,alias:'selector'},statement:{pattern:/\B!(?:default|optional)\b/i,alias:'keyword'},boolean:/\b(?:true|false)\b/,null:/\bnull\b/,operator:{pattern:/(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,lookbehind:!0}}),Prism.languages.scss.atrule.inside.rest=Prism.util.clone(Prism.languages.scss);
//# sourceMappingURL=demo.js.map