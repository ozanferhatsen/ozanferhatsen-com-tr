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

  const updates=[...document.querySelectorAll('[data-legal-updates] .legal-update-card')];
  const dots=[...document.querySelectorAll('.legal-updates-dots span')];
  if(updates.length>1){
    let current=0;
    const show=index=>{
      updates.forEach((item,i)=>item.classList.toggle('is-active',i===index));
      dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
    };
    const mq=window.matchMedia('(max-width:760px)');
    let timer=null;
    const start=()=>{
      if(timer) clearInterval(timer);
      if(mq.matches){
        timer=setInterval(()=>{
          current=(current+1)%updates.length;
          show(current);
        },6500);
      }
    };
    show(0);
    start();
    mq.addEventListener?.('change',start);
  }
});
