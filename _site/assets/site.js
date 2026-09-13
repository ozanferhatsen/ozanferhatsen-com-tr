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

  const panel=document.querySelector('[data-legal-updates]');
  const updates=[...document.querySelectorAll('[data-legal-update]')];
  const dots=[...document.querySelectorAll('.legal-updates-dots span')];
  if(panel&&updates.length>1){
    let current=Math.max(0,updates.findIndex(item=>item.classList.contains('is-active')));
    let timer=null;

    const show=index=>{
      updates.forEach((item,i)=>{
        const active=i===index;
        item.classList.toggle('is-active',active);
        item.setAttribute('aria-hidden',String(!active));
      });
      dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
    };

    const advance=()=>{
      current=(current+1)%updates.length;
      show(current);
    };

    const start=()=>{
      if(timer) return;
      timer=setInterval(advance,6000);
    };

    const stop=()=>{
      if(timer){
        clearInterval(timer);
        timer=null;
      }
    };

    show(current);
    start();
    panel.addEventListener('mouseenter',stop);
    panel.addEventListener('mouseleave',start);
    panel.addEventListener('focusin',stop);
    panel.addEventListener('focusout',start);
  }
});
