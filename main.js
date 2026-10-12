// The Hill concept (next). Facts: hudsonvalleyweddings.net. No availability data is published,
// so an in-season date is always "Lisa confirms", never "open" or "booked".
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G=window.gsap,ST=window.ScrollTrigger,motion=!RM&&!!G&&!!ST;
  if(!motion)document.documentElement.classList.remove('motion');
  if(motion)G.registerPlugin(ST);

  /* ---------- date checker ---------- */
  var f=document.getElementById('checker');
  var out=f.querySelector('[data-results]'),send=f.querySelector('[data-send]');
  var gout=f.querySelector('[data-gout]'),gnote=f.querySelector('[data-gnote]');
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function parse(v){var p=v.split('-');return new Date(Date.UTC(+p[0],p[1]-1,+p[2]));}
  function label(d){return DAYS[d.getUTCDay()]+', '+MON[d.getUTCMonth()]+' '+d.getUTCDate()+', '+d.getUTCFullYear();}
  function check(v){
    var d=parse(v);if(isNaN(d))return null;var m=d.getUTCMonth(),y=d.getUTCFullYear(),dow=d.getUTCDay();
    if(y!==2027)return {cls:'closed',t:label(d)+': this checker covers 2027 only. Call to confirm other years.'};
    if(m<4||m>9)return {cls:'closed',t:label(d)+': outside the May–October season The Hill publishes.'};
    var wk=(dow===0||dow>=5)?' A weekend date.':' A weekday. Ask whether weekdays are offered.';
    return {cls:'later',t:label(d)+': in season.'+wk+' Availability not published. Lisa confirms.'};
  }
  function guestText(g){return g<75?'Fewer than 75 guests. The Hill’s stated range is 75–300, so call to confirm smaller weddings.':g>300?'More than 300 guests. The Hill’s stated range is 75–300, so call to confirm.':g+' guests fits the barn’s listed 75–300.';}
  var ready=false;
  function update(){
    var rows=[],lines=[];
    ['d1','d2','d3'].forEach(function(n,i){
      var v=f.elements[n].value,card=f.querySelector('[data-card="'+n+'"]');card.classList.remove('is-in','is-out');
      if(!v)return;var r=check(v);if(!r)return;
      card.classList.add(r.cls==='later'?'is-in':'is-out');
      var nm=i?'Alternate '+i:'First choice';
      rows.push('<li><span class="dot dot--'+r.cls+'" aria-hidden="true"></span><span><b>'+nm+':</b> '+r.t+'</span></li>');
      var flag=r.cls==='closed'?(/2027 only/.test(r.t)?' (outside 2027, which this request covers)':' (outside the May–October season)'):'';
      lines.push('- '+nm+': '+label(parse(v))+flag);
    });
    var g=parseInt(f.elements.guests.value,10);
    gout.textContent=g>=400?'400+':g;gnote.textContent=guestText(g);
    rows.push('<li><span class="dot dot--'+((g>300||g<75)?'later':'open')+'" aria-hidden="true"></span><span><b>Guests:</b> '+guestText(g)+'</span></li>');
    var html=rows.join('');
    if(html!==out.innerHTML){out.innerHTML=html;
      if(ready&&motion)G.fromTo(out.children,{opacity:0,y:12},{opacity:1,y:0,duration:.5,ease:'power2.out',stagger:.06,clearProps:'transform'});
      if(ready&&sun&&f.querySelector('.is-in'))sun.goToAndPlay(0,true);}
    var nmv=f.elements.name.value.trim(),ph=f.elements.phone.value.trim(),sign='Thank you,';
    if(nmv)sign+='\nName: '+nmv;if(ph)sign+='\nPhone: '+ph;
    var body='Hi Lisa,\n\nWe’re looking at The Hill for our 2027 wedding. Our dates:\n'+(lines.join('\n')||'- (dates)')+'\n- Guests: about '+g+'\n\nAre any of these open? We’d also love to schedule a tour.\n\n'+sign+'\n';
    send.href='mailto:lisacoon231@gmail.com?subject='+encodeURIComponent('2027 date request')+'&body='+encodeURIComponent(body);
  }

  /* ---------- Lottie sun accent (self-hosted lottie-web) ---------- */
  var sun=null,el=document.querySelector('[data-sun]');
  if(window.lottie&&el){sun=lottie.loadAnimation({container:el,renderer:'svg',loop:!RM,autoplay:!RM,path:'img/sun.json'});
    if(RM)sun.addEventListener('DOMLoaded',function(){sun.goToAndStop(45,true);});}

  f.addEventListener('input',update);f.addEventListener('change',update);update();ready=true;
  window.__hill={check:check,motion:function(){return motion;}};

  /* ---------- mobile bar: shows after hero, hides while the checker is on screen ---------- */
  var bar=document.querySelector('[data-mbar]'),hero=document.querySelector('.hero'),date=document.getElementById('date');
  var heroIn=true,dateIn=false;
  function setBar(){bar.classList.toggle('is-on',!heroIn&&!dateIn);}
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){heroIn=e[0].isIntersecting;setBar();},{threshold:0.15}).observe(hero);
    new IntersectionObserver(function(e){dateIn=e[0].isIntersecting;setBar();},{threshold:0}).observe(date);
  }else bar.classList.add('is-on');

  if(!motion)return;

  /* ---------- hero entrance + depth ---------- */
  G.from('[data-rise]',{opacity:0,y:30,duration:1.1,ease:'power3.out',stagger:.12,delay:.1});
  G.fromTo('[data-hero-media] img',{scale:1.12},{scale:1,duration:2.4,ease:'power2.out'});
  G.to('[data-hero-media]',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  if(matchMedia('(pointer:fine)').matches){
    var mx=G.quickTo('[data-hero-media]','x',{duration:1.2,ease:'power3'}),my=G.quickTo('[data-hero-media] picture','y',{duration:1.2,ease:'power3'});
    hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();mx((e.clientX/r.width-.5)*-18);my((e.clientY/r.height-.5)*-12);});
  }
  motes(document.querySelector('[data-motes]'),hero);

  /* ---------- the wedding day: pinned, scrubbed crossfade sequence ---------- */
  var scenes=G.utils.toArray('[data-scene]'),stage=document.querySelector('[data-stage]');
  var tl=G.timeline({scrollTrigger:{trigger:stage,start:'top top',end:'+='+(scenes.length*90)+'%',pin:true,scrub:.6,anticipatePin:1}});
  G.set(scenes,{autoAlpha:0});G.set(scenes[0],{autoAlpha:1});
  scenes.forEach(function(s,i){
    var img=s.querySelector('img'),copy=s.querySelector('.scene__copy');
    tl.fromTo(img,{scale:1.04},{scale:1,duration:1,ease:'none'},i);
    tl.fromTo(copy,{y:50,opacity:0},{y:0,opacity:1,duration:.35,ease:'power2.out'},i+.1);
    if(i<scenes.length-1){tl.to(copy,{opacity:0,y:-30,duration:.2},i+.8);tl.to(scenes[i+1],{autoAlpha:1,duration:.25},i+.8);tl.set(s,{autoAlpha:0},i+1.05);}
  });
  // the light moves through the day: warm morning to gold to dusk
  tl.fromTo('[data-tint]',{background:'linear-gradient(180deg,#fff1c9,transparent)',opacity:.25},{background:'linear-gradient(180deg,#e2803a,#2a1c3a)',opacity:.55,duration:scenes.length,ease:'none'},0);
  var arc=document.querySelector('[data-arcsun]'),o={a:0};
  tl.to(o,{a:1,duration:scenes.length,ease:'none',onUpdate:function(){var t=Math.PI*(1-o.a);arc.setAttribute('cx',100+90*Math.cos(t));arc.setAttribute('cy',100-90*Math.sin(t));}},0);

  /* ---------- history: line draws, entries settle in ---------- */
  var tlist=document.querySelector('[data-tl]'),line=document.createElement('span');line.className='tl__line';line.setAttribute('aria-hidden','true');tlist.prepend(line);
  G.fromTo(line,{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:tlist,start:'top 75%',end:'bottom 60%',scrub:true}});
  G.utils.toArray('.tl li').forEach(function(li){G.from(li,{opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:li,start:'top 85%'}});});
  G.utils.toArray('[data-par] img').forEach(function(im,i){G.fromTo(im,{yPercent:-2.5,scale:1.06},{yPercent:2.5,scale:1.06,ease:'none',scrollTrigger:{trigger:im.closest('figure'),start:'top bottom',end:'bottom top',scrub:true}});});
  G.utils.toArray('.disp').forEach(function(h){G.from(h,{opacity:0,y:24,duration:.9,ease:'power2.out',scrollTrigger:{trigger:h,start:'top 88%'}});});

  /* ---------- WebGL: golden-hour light motes drifting over the barn ---------- */
  function motes(cv,host){
    var gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false});if(!gl)return;
    var N=innerWidth<700?70:140,data=new Float32Array(N*4);
    for(var i=0;i<N;i++){data[i*4]=Math.random();data[i*4+1]=Math.random();data[i*4+2]=.4+Math.random()*1.6;data[i*4+3]=Math.random()*6.28;}
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;}
    var p=gl.createProgram();
    gl.attachShader(p,sh(gl.VERTEX_SHADER,'attribute vec4 a;uniform float t;uniform vec2 r;uniform float d;varying float al;void main(){float y=fract(a.y+t*.012*a.z);float x=a.x+sin(t*.4*a.z+a.w)*.02;gl_Position=vec4(x*2.-1.,y*2.-1.,0,1);gl_PointSize=(2.+a.z*3.)*d;al=smoothstep(0.,.25,y)*(1.-smoothstep(.75,1.,y))*(.45+.35*sin(t*1.3+a.w));}'));
    gl.attachShader(p,sh(gl.FRAGMENT_SHADER,'precision mediump float;varying float al;void main(){float q=length(gl_PointCoord-.5);float g=smoothstep(.5,0.,q);gl_FragColor=vec4(vec3(1.,.82,.52)*g*al,g*al);}'));
    gl.linkProgram(p);gl.useProgram(p);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    var al=gl.getAttribLocation(p,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,4,gl.FLOAT,false,0,0);
    var ut=gl.getUniformLocation(p,'t'),ud=gl.getUniformLocation(p,'d');
    gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    var dpr=Math.min(devicePixelRatio||1,1.5),vis=true;
    function size(){cv.width=cv.clientWidth*dpr;cv.height=cv.clientHeight*dpr;gl.viewport(0,0,cv.width,cv.height);gl.uniform1f(ud,dpr);}
    size();addEventListener('resize',size);
    new IntersectionObserver(function(e){vis=e[0].isIntersecting;}).observe(host);
    G.ticker.add(function(time){if(!vis)return;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(ut,time);gl.drawArrays(gl.POINTS,0,N);});
  }
})();
