(function(){
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var f=function(n){return n.toFixed(2)+' ج.م'};
/* theme */
var root=document.documentElement,tb=$('#themeb');
try{var t=localStorage.getItem('cs-theme');if(t)root.dataset.theme=t}catch(e){}
tb.onclick=function(){var d=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;root.dataset.theme=d?'light':'dark';try{localStorage.setItem('cs-theme',root.dataset.theme)}catch(e){}};
/* cart state */
var cart=[],cur=null;
function pick(c){return{n:c.dataset.n||$('h3',c).textContent,p:parseFloat($('.pr b',c).textContent),o:parseFloat($('.pr s',c).textContent),i:$('img',c).src,off:$('.rib:last-child',c).textContent.replace('-',''),q:1}}
var demo=[$('#v-home .card'),$('#v-home .card.belt')];demo.forEach(function(c){if(c)cart.push(pick(c))});
function toast(m){var e=$('#toast');e.textContent=m;e.classList.add('on');setTimeout(function(){e.classList.remove('on')},1800)}
function add(p){var x=cart.filter(function(i){return i.n===p.n})[0];if(x)x.q++;else cart.push(JSON.parse(JSON.stringify(p)));draw();toast('تمت الإضافة للسلة')}
function tot(){return cart.reduce(function(a,i){return a+i.p*i.q},0)}
function draw(){
 $('#cnt').textContent=cart.reduce(function(a,i){return a+i.q},0);
 $('#cfull').style.display=cart.length?'':'none';$('#cempty').style.display=cart.length?'none':'';
 $('#citems').innerHTML=cart.map(function(i,k){return'<div class="ci"><img src="'+i.i+'" alt=""><div><h3>'+i.n+'</h3><span class="u">'+f(i.p)+'</span></div><div class="qty"><button data-q="'+k+'|1">+</button><span>'+i.q+'</span><button data-q="'+k+'|-1">−</button></div><b class="lt">'+f(i.p*i.q)+'</b><button class="rm" data-rm="'+k+'" aria-label="حذف">×</button></div>'}).join('');
 $('#kitems').innerHTML=cart.map(function(i){return'<div class="ki"><img src="'+i.i+'" alt=""><div>'+i.n+'<br><span class="u">× '+i.q+'</span></div><b>'+f(i.p*i.q)+'</b></div>'}).join('');
 ['#csub','#ctot','#ksub','#ktot'].forEach(function(s){$(s).textContent=f(tot())});
}
function open_(c){cur=pick(c);$('#pn').textContent=cur.n;$('#pcr').textContent=cur.n;$('#pp').textContent=f(cur.p);$('#po').textContent=cur.o.toFixed(2);$('#pb').textContent='-'+cur.off;$('#ps').textContent='وفّر '+f(cur.o-cur.p);$('#pimg').src=cur.i;$$('.th img').forEach(function(m){m.src=cur.i});location.hash='product'}
cur=pick($$('#v-home .card')[6]||$('#v-home .card'));
document.addEventListener('click',function(e){var g=e.target.closest('[data-go]');if(g){location.hash=g.dataset.go;return}
 var q=e.target.closest('[data-q]');if(q){var a=q.dataset.q.split('|'),it=cart[a[0]];it.q=Math.max(1,it.q+ +a[1]);draw();return}
 var r=e.target.closest('[data-rm]');if(r){cart.splice(r.dataset.rm,1);draw();return}
 var fv=e.target.closest('.fav,.pfav');if(fv){fv.classList.toggle('fav-on');fv.style.color=fv.classList.contains('fav-on')?'var(--red)':'';return}
 var ch=e.target.closest('.chip');if(ch){ch.classList.toggle('on');$$('.chip.on').length&&($('.clr').disabled=false);return}
 if(e.target.closest('.cat-chip')){location.hash='products';return}
 var th=e.target.closest('.th');if(th){$$('.th').forEach(function(x){x.classList.toggle('on',x===th)});return}
 var c=e.target.closest('.card');if(c){var b=e.target.closest('.add');if(b&&!c.classList.contains('belt'))add(pick(c));else open_(c)}
});
$('#padd').onclick=function(){add(cur)};
$('.clr').onclick=function(){$$('.chip.on').forEach(function(x){x.classList.remove('on')});this.disabled=true};
$('.totop').onclick=function(){scrollTo({top:0,behavior:'smooth'})};
$('#ckform').onsubmit=function(e){e.preventDefault();$('#onum').textContent='CS-'+Math.floor(10000+Math.random()*89999);cart=[];draw();location.hash='done'};
/* router: #home #products #product #cart #checkout #done */
function route(){var h=(location.hash||'#home').slice(1);if(!$('#v-'+h))h='home';$$('.view').forEach(function(v){v.classList.toggle('show',v.id==='v-'+h)});$('#mega').classList.remove('open');$$('[data-nav]').forEach(function(e){e.classList.toggle('active',e.dataset.nav===h)});if(h==='done'&&!$('#onum').textContent)$('#onum').textContent='CS-24817';scrollTo(0,0)}
addEventListener('hashchange',route);draw();route();
})();
