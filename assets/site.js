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

  const dynamicBrand=document.querySelector('[data-dynamic-brand]');
  const heroBrand=document.querySelector('[data-hero-brand]');
  if(dynamicBrand&&heroBrand){
    const setBrandVisible=visible=>{
      dynamicBrand.classList.toggle('is-visible',visible);
      dynamicBrand.setAttribute('aria-hidden',String(!visible));
      dynamicBrand.tabIndex=visible?0:-1;
    };

    setBrandVisible(false);

    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{
        setBrandVisible(!entries[0].isIntersecting);
      },{threshold:0});
      observer.observe(heroBrand);
    }else{
      const updateBrand=()=>{
        const rect=heroBrand.getBoundingClientRect();
        setBrandVisible(rect.bottom<=0||rect.top>=window.innerHeight);
      };
      updateBrand();
      window.addEventListener('scroll',updateBrand,{passive:true});
      window.addEventListener('resize',updateBrand);
    }
  }

  const focusSearch=()=>{
    const input=document.getElementById('site-search-input');
    if(input){
      input.focus();
      return;
    }
    window.location.assign('/arama/?focus=1');
  };

  document.addEventListener('keydown',event=>{
    if((event.metaKey||event.ctrlKey)&&!event.altKey&&event.key.toLowerCase()==='k'){
      event.preventDefault();
      focusSearch();
    }
  });

  if(window.location.pathname==='/arama/'&&new URLSearchParams(window.location.search).get('focus')==='1'){
    window.setTimeout(()=>{
      const input=document.getElementById('site-search-input');
      if(input) input.focus();
    },0);
  }
});
