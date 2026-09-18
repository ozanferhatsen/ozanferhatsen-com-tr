document.addEventListener('DOMContentLoaded',()=>{
  const button=document.querySelector('[data-menu]');
  const menu=document.getElementById('menu');
  const dropdowns=[...document.querySelectorAll('.nav-dropdown')];

  const closeDropdowns=()=>{
    dropdowns.forEach(dropdown=>{dropdown.open=false;});
  };

  const setMenuState=(open,{restoreFocus=false}={})=>{
    if(!button||!menu) return;
    menu.classList.toggle('open',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?(button.dataset.closeLabel||'Menüyü kapat'):(button.dataset.openLabel||'Menüyü aç'));
    document.body.classList.toggle('menu-open',open);

    if(!open){
      closeDropdowns();
      if(restoreFocus) button.focus();
      return;
    }

    const firstFocusable=menu.querySelector('summary,a[href],button:not([disabled])');
    if(firstFocusable) window.requestAnimationFrame(()=>firstFocusable.focus());
  };

  if(button&&menu){
    button.addEventListener('click',()=>{
      setMenuState(!menu.classList.contains('open'));
    });

    menu.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click',()=>setMenuState(false));
    });

    window.addEventListener('resize',()=>{
      if(window.innerWidth>760&&menu.classList.contains('open')) setMenuState(false);
    });
  }

  if(dropdowns.length){
    dropdowns.forEach(dropdown=>{
      dropdown.addEventListener('toggle',()=>{
        if(!dropdown.open) return;
        dropdowns.forEach(other=>{
          if(other!==dropdown) other.open=false;
        });
      });
    });

    document.addEventListener('click',event=>{
      dropdowns.forEach(dropdown=>{
        if(dropdown.open&&!dropdown.contains(event.target)) dropdown.open=false;
      });
    });

    dropdowns.forEach(dropdown=>{
      dropdown.querySelectorAll('a').forEach(link=>{
        link.addEventListener('click',()=>{dropdown.open=false;});
      });
    });
  }

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      closeDropdowns();
      if(menu&&menu.classList.contains('open')){
        event.preventDefault();
        setMenuState(false,{restoreFocus:true});
      }
      return;
    }

    if(event.key==='Tab'&&menu&&menu.classList.contains('open')){
      const focusable=[...menu.querySelectorAll('summary,a[href],button:not([disabled])')]
        .filter(element=>element.offsetParent!==null);
      if(!focusable.length) return;
      const first=focusable[0];
      const last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){
        event.preventDefault();
        last.focus();
      }else if(!event.shiftKey&&document.activeElement===last){
        event.preventDefault();
        first.focus();
      }
    }
  });

  const dynamicBrand=document.querySelector('[data-dynamic-brand]');
  const heroBrand=document.querySelector('[data-hero-brand]');
  if(dynamicBrand&&heroBrand){
    const setBrandVisible=visible=>{
      dynamicBrand.classList.toggle('is-visible',visible);
      dynamicBrand.setAttribute('aria-hidden',String(!visible));
      dynamicBrand.tabIndex=visible?0:-1;
    };

    const useTransfer=dynamicBrand.hasAttribute('data-brand-transfer');

    if(useTransfer){
      const header=document.querySelector('[data-site-header]');
      let ticking=false;

      const updateTransfer=()=>{
        const heroRect=heroBrand.getBoundingClientRect();
        const headerBottom=header?header.getBoundingClientRect().bottom:0;
        const start=headerBottom+88;
        const end=headerBottom+18;
        const progress=Math.max(0,Math.min(1,(start-heroRect.top)/(start-end)));

        dynamicBrand.style.opacity=String(progress);
        dynamicBrand.style.transform=`translateY(${(1-progress)*7}px)`;
        dynamicBrand.style.pointerEvents=progress>.92?'auto':'none';
        dynamicBrand.classList.toggle('is-visible',progress>0);
        dynamicBrand.setAttribute('aria-hidden',String(progress<=.92));
        dynamicBrand.tabIndex=progress>.92?0:-1;

        heroBrand.style.opacity=String(1-progress);
        heroBrand.style.transform=`translateY(${-progress*7}px)`;

        ticking=false;
      };

      const requestTransferUpdate=()=>{
        if(ticking) return;
        ticking=true;
        window.requestAnimationFrame(updateTransfer);
      };

      updateTransfer();
      window.addEventListener('scroll',requestTransferUpdate,{passive:true});
      window.addEventListener('resize',requestTransferUpdate);
    }else{
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
