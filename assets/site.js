document.addEventListener('DOMContentLoaded',()=>{
  const button=document.querySelector('[data-menu]');
  const menu=document.getElementById('menu');
  if(button&&menu){
    button.addEventListener('click',()=>{
      const open=menu.classList.toggle('open');
      button.setAttribute('aria-expanded',String(open));
    });

    menu.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click',()=>{
        menu.classList.remove('open');
        button.setAttribute('aria-expanded','false');
      });
    });
  }

  const updates=document.querySelectorAll('[data-legal-update]');
  if(updates.length>1){
    let current=0;
    const rotate=()=>{
      if(window.matchMedia('(max-width:760px)').matches){
        updates.forEach((item,index)=>item.classList.toggle('is-active',index===current));
        current=(current+1)%updates.length;
      }else{
        updates.forEach(item=>item.classList.add('is-active'));
      }
    };
    rotate();
    setInterval(rotate,6500);
  }
});
