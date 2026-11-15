(function(){
var b=document.getElementById('catbtn'),m=document.getElementById('mega');
b.onclick=function(e){e.stopPropagation();m.classList.toggle('open')};
document.addEventListener('click',function(e){if(!m.contains(e.target))m.classList.remove('open')});
document.querySelectorAll('.car').forEach(function(c){var d=false,x=0,s=0;
c.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;d=true;x=e.clientX;s=c.scrollLeft;c.classList.add('drag')});
window.addEventListener('pointerup',function(){d=false;c.classList.remove('drag')});
window.addEventListener('pointermove',function(e){if(d)c.scrollLeft=s-(e.clientX-x)});});
document.querySelectorAll('.fav').forEach(function(f){f.onclick=function(){f.style.background=f.style.background?'':'#ffe3d8'}});
})();
