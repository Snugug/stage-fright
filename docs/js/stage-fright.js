function nodeMap(a,b){return Array.prototype.map.call(a,b)}function idleRun(a){if('requestIdleCallback'in window)window.requestIdleCallback(a);else{const b=Date.now();return setTimeout(()=>{a({didTimeout:!1,timeRemaining:()=>{return Math.max(0,50-(Date.now()-b))}})},1)}}function getActiveSlide(){const a=location.hash.split('/');return a.shift(),{section:parseInt(a[0]),slide:parseInt(a[1]),fragment:parseInt(a[2])}}const Matrix=class{constructor(){const a=document.currentScript.src.split('?'),b=a[0];let c={};1<a.length&&(c=buildOptions(a[1])),document.location.search&&(c=buildOptions(document.location.search.substr(1))),this._script=b,this._options=c,this._notes=!1,this._raw={stage:document.querySelector('._stage'),groups:document.querySelectorAll('._stage--group'),slides:document.querySelectorAll('._stage--slide')},this._slides=nodeMap(this._raw.groups,d=>{const g=d.querySelectorAll('._stage--slide');return nodeMap(g,h=>{const j=h.querySelectorAll('.fragment');return 0===j.length?h:[h].concat(nodeMap(j,k=>k))})})}get slides(){return this._slides}get stage(){return this._raw.stage}get script(){return this._script}get options(){return this._options}get notes(){return this._notes}set notes(a){return this._notes=a,a}};function buildOptions(a,b){let c=b||{};if(a){const d=`{"${decodeURI(a).replace(/&/g,'","').replace(/=/g,'":"')}"}`,g=JSON.parse(d,(h,j)=>{if(parseFloat(j).toString()===j)return parseFloat(j);try{return JSON.parse(j)}catch(k){return j}return j});c=Object.assign(g,c)}return c}const init=function(){const a=getActiveSlide();(isNaN(a.section)||isNaN(a.slide))&&history.pushState(null,null,`#/${0}/${0}`)},translate=function(a,b,c){const d=document.querySelector('._stage');let g=a,h=b;if(!(a&&b)&&0!==a&&0!==b){const k=getActiveSlide();a||(g=k.section),b||(h=k.slide)}const j=document.querySelector(`[data-slide="${h}"][data-section="${g}"]`).querySelectorAll('.fragment');for(let k=0;k<c;k++)j[k].setAttribute('data-active',!0);d.style.transform=`translateX(${-100*g}vw) translateY(${-100*h}vh)`},nav=class{static next(a){const b=getActiveSlide();let c=b.section,d=b.slide,g=b.fragment;return next(c,d,g,a)}static previous(a){const b=getActiveSlide();let c=b.section,d=b.slide,g=b.fragment;return previous(c,d,g,a)}static left(a){const b=getActiveSlide();let c=b.section,d=b.slide,g=b.fragment;return left(c,d,g,a)}static right(a){const b=getActiveSlide();let c=b.section,d=b.slide,g=b.fragment;return right(c,d,g,a)}static move(a,b,c){return translate(a,b,c)}};function move(a){let b=`#/${a.section}/${a.slide}`;const c=document.querySelector(`[data-slide="${a.slide}"][data-section="${a.section}"]`).querySelectorAll('.fragment[data-active]').length;return isNaN(a.fragment)?(updateProgress(a.section,a.slide),translate(a.section,a.slide),0!==c&&(updateProgress(a.section,a.slide,c),b+=`/${c}`)):(updateProgress(a.section,a.slide,a.fragment),b+=`/${a.fragment}`),history.pushState(null,null,b),sendNotes(a.section,a.slide,a.matrix),{section:a.section,slide:a.slide,fragment:a.fragment}}function right(a,b,c,d){let g=a,h=b;return sendMessage(d.notes,{move:'right'}),g=nextSection(g,d),h>lastSlide(g,d)&&(h=0),move({section:g,slide:h,matrix:d})}function left(a,b,c,d){let g=a,h=b;return sendMessage(d.notes,{move:'left'}),g=previousSection(g),h>lastSlide(g,d)&&(h=0),move({section:g,slide:h,matrix:d})}function previous(a,b,c,d){let g=a,h=b;if(sendMessage(d.notes,{move:'previous'}),Array.isArray(d.slides[g][h])){let j=d.slides[g][h][0].querySelectorAll('.fragment[data-active]');if(j){const k=j.length-1;if(0<=k)return j[k].removeAttribute('data-active'),move({section:g,slide:h,fragments:k,matrix:d})}}return h-=1,0>h&&(g=previousSection(g),h=0===g?0:lastSlide(g,d)),move({section:g,slide:h,matrix:d})}function next(a,b,c,d){let g=a,h=b,j=c;const k=d.slides.length;if(sendMessage(d.notes,{move:'next'}),Array.isArray(d.slides[g][h])){let l=d.slides[g][h][0].querySelector('.fragment:not([data-active])');if(l){const m=d.slides[g][h][0].querySelectorAll('.fragment[data-active]').length+1;return l.setAttribute('data-active',!0),move({section:g,slide:h,fragments:m,matrix:d})}}if(h+=1,j=void 0,h>lastSlide(g,d)){g=nextSection(g,d);let l=lastSlide(g,d);g===k-1&&h>l?h=l:g<=k-1&&(h=0)}return move({section:g,slide:h,fragment:j,matrix:d})}function previousSection(a){let b=a;return b-=1,0>b&&(b=0),b}function nextSection(a,b){let c=a;const d=b.slides.length;return c+=1,c>=d&&(c=d-1),c}function lastSlide(a,b){const c=b.slides[a].length;return c-1}function openNotes(a){const b={go:getActiveSlide()},c=window.location;console.log(c);const d=window.open(`${c.origin}${c.pathname}?notes=true`,'Stage Fright - Notes','width=1100,height=700');return setTimeout(()=>{sendMessage(d,b),sendNotes(b.go.section,b.go.slide,a)},1e3),d}function body(){const a=window.location,b=`
<style>
  body {
    margin: 0;
    padding: 0;
    display: flex;
    overflow: hidden;
    font-size: 100%;
  }

  * {
    box-sizing: border-box;
  }

  .clock,
  .timer {
    flex: 1;
    font-family: sans-serif;
    font-size: 2em;
  }
  .timer {
    text-align: left;
  }
  .clock {
    text-align: right;
  }


  [data-mute] {
    opacity: .5;
  }

  .slide {
    position: relative;
  }

  .slide--current {
    width: calc(60vw - 1em);
    height: calc(100vh - 1em);
    padding: .25em;
  }

  .slide--upcoming {
    width: calc(40vw - 1em);
    height: calc(40vh - 1em);
  }

  .slide--frame {
    // border: 1px solid black;
  }

  .slide--label {
    text-transform: uppercase;
    position: absolute;
    color: white;
    background: black;
    opacity: .5;
    width: 100%;
    padding: .25rem;
    font-size: .5em;
  }

  .current {
    width: 60vw;
    padding: .5em;
  }

  .speaker-notes {
    width: 40vw;
    padding: .5em;
  }

  .controls {
    font-size: .8em;
  }

  .controls--time {
    display: flex;
    flex-wrap: wrap;
  }

  .controls--label {
    font-family: sans-serif;
    opacity: .5;
    text-transform: lowercase;
    margin: 0;
    flex-shrink: 0;
    width: 100%;
    font-size: .75em;
  }

  .controls--reset {
    color: transparent;
    font-size: 1px;
  }

  .slide-notes {
    font-family: sans-serif;
    margin-top: 1rem;
  }

  .slide-notes--label {
    font-size: 1px;
    color: transparent;
  }

</style>
<div class="current">
    <div class="slide">
      <div class="slide--holder">
        <iframe src="${a.origin}${a.pathname}?progress=false&responsive=true&listen=true${a.hash}" frameborder="0" class="slide--current" height="1024" width="1280"></iframe>
      </div>
    </div>
  </div>
  <div class="speaker-notes">
    <div class="slide">
      <span class="slide--label">Upcoming:</span>
      <div class="slide--holder">
        <iframe src="${a.origin}${a.pathname}?progress=false&responsive=true&listen=true${a.hash}" frameborder="0" class="slide--upcoming" height="1024" width="1280"></iframe>
      </div>
    </div>
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
    </div>
    <div class="slide-notes">
      <h4 class="slide-notes--label">Notes</h4>
      <div class="slide-notes--content"></div>
    </div>
  </div>
`;return document.body.innerHTML=b,b}function sendNotes(a,b,c){let d=document.querySelector(`[data-slide="${b}"][data-section="${a}"] ._stage--notes`);return d=d?d.innerHTML:'<p></p>',sendMessage(c.notes,{notes:d}),d}function timing(){function a(){const k=new Date,l=k.getTime()-j.getTime(),m=Math.floor(l/3600000),n=Math.floor(l/60000%60),o=Math.floor(l/1e3%60);c.textContent=k.toLocaleTimeString('en-US',{hour12:!0,hour:'2-digit',minute:'2-digit'}),d.textContent=b(m),g.textContent=`:${b(n)}`,h.textContent=`:${b(o)}`,0>=m?d.setAttribute('data-mute',!0):d.removeAttribute('data-mute'),0>=n?g.setAttribute('data-mute',!0):g.removeAttribute('data-mute')}function b(k){const l=`00${parseInt(k)}`;return l.substring(l.length-2)}const c=document.querySelector('.clock--value'),d=document.querySelector('.timer--hours'),g=document.querySelector('.timer--minutes'),h=document.querySelector('.timer--seconds'),j=new Date;a(),setInterval(a,1e3)}function sendMessage(a,b){const c=window.location;a&&a.postMessage(b,c.origin)}function slideMessage(a){window.addEventListener('message',b=>{const c=b.origin||event.originalEvent.origin;return c===window.location.origin?b.data.move?nav[b.data.move](a):void 0:void 0},!1)}function notesMessage(){const a=document.querySelector('.slide--current'),b=document.querySelector('.slide--upcoming'),c=document.querySelector('.slide-notes--content');window.addEventListener('message',d=>{const g=d.origin||event.originalEvent.origin;if(g===window.location.origin){if(d.data.move&&(sendMessage(a.contentWindow,{move:d.data.move}),sendMessage(b.contentWindow,{move:d.data.move})),d.data.go){let h=`#/${d.data.go.section}/${d.data.go.slide}`;d.data.go.fragment&&(h+=`/${d.data.go.fragment}`),a.src+=h,b.src+=h,sendMessage(b.contentWindow,{move:'next'})}d.data.notes&&(c.innerHTML=d.data.notes)}},!1)}const progress=function(a){idleRun(()=>{const b=document.createElement('nav');b.classList.add('progress');const c=getActiveSlide();let d=0;a.slides.forEach(g=>{const h=document.createElement('div');h.setAttribute('data-section',d),h.classList.add('progress--section');let j=0;g.forEach(k=>{const l=document.createElement('a');l.href=`#/${d}/${j}`,l.classList.add('progress--slide'),l.setAttribute('data-slide',j),l.setAttribute('data-section',d),l.setAttribute('tabindex','-1'),l.textContent=`Section ${d}, Slide ${j}`,Array.isArray(k)&&(l.style.opacity=.5,l.setAttribute('data-fragments',k.length-1)),c.section===d&&c.slide===j&&l.setAttribute('data-active','true'),h.appendChild(l),Array.isArray(k)?(k[0].setAttribute('data-slide',j),k[0].setAttribute('data-section',d),c.section===d&&c.slide===j&&k[0].setAttribute('data-active',!0)):(k.setAttribute('data-slide',j),k.setAttribute('data-section',d),c.section===d&&c.slide===j&&k.setAttribute('data-active',!0)),j++}),b.appendChild(h),d++}),!1!==a.options.progress&&document.body.appendChild(b),translate(c.section,c.slide,c.fragment),updateProgress(c.section,c.slide,c.fragment)}),window.addEventListener('hashchange',()=>{const b=getActiveSlide();updateProgress(b.section,b.slide,b.fragment),translate(b.section,b.slide,b.fragment),sendMessage(a.notes,{go:b})})};function updateProgress(a,b,c){const d=document.querySelectorAll('[data-active]:not(.fragment)'),g=document.querySelectorAll(`[data-section="${a}"][data-slide="${b}"`),h=document.querySelector('.progress--slide[data-active]');if(h)if(c){const j=parseInt(h.getAttribute('data-fragments'));c===j?(h.style.transitionProperty='none',h.style.opacity=1):(h.style.transitionProperty='none',h.style.opacity=.5)}else h.style.transitionProperty='all',nodeMap(d,j=>{j.removeAttribute('data-active')}),nodeMap(g,j=>{j.setAttribute('data-active','true')})}const keys=function(a){document.addEventListener('keydown',b=>{return a.stage.hasAttribute('data-overlay')?void 0:37===b.keyCode?nav.left(a):39===b.keyCode?nav.right(a):38===b.keyCode||33===b.keyCode?nav.previous(a):40===b.keyCode||34===b.keyCode||32===b.keyCode?nav.next(a):83===b.keyCode?(a.notes=openNotes(a),a):void 0})},overview=function(a){let b=!1;const c=a._raw.slides;document.addEventListener('keydown',d=>{if(27===d.keyCode){function g(q){const r=q.target.closest('[data-section][data-slide]');let t=r.getAttribute('data-section'),u=r.getAttribute('data-slide');h(c),a.stage.removeAttribute('data-overlay'),history.pushState(null,null,`#/${t}/${u}`),updateProgress(t,u),translate(t,u),b=!1}function h(q){nodeMap(q,r=>{r.removeEventListener('click',g)})}if(b=!b,!1==b)return a.stage.removeAttribute('data-overlay'),h(c),void translate();const j=window.innerWidth,k=window.innerHeight,l=a.stage.scrollWidth,m=a.stage.scrollHeight,n=j/l,o=k/m;if(n<=o)a.stage.style.transform=`scale(${j/(l+64/n)})`,a.stage.style.transformOrigin=`32px ${m*n/2-32}px`;else{let q=hwidth/(l+64/o);a.stage.style.transform=`scale(${q})`,a.stage.style.transformOrigin=`${l*o/2-32}px 32px`}a.stage.setAttribute('data-overlay','true'),nodeMap(c,q=>{q.addEventListener('click',g)})}})},stageFright=function(){const a=new Matrix;a.options.notes?(body(),timing(),notesMessage()):(init(),progress(a),keys(a),overview(a)),a.options.listen&&slideMessage(a),document.body.classList.add('stage-fright'),a.options.responsive&&(document.body.style.fontSize='1.5vw')};stageFright();
//# sourceMappingURL=stage-fright.js.map
