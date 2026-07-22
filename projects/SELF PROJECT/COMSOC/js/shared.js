
   window.Comsoc = (function () {

    /*  Scroll reveal  */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  
    function observeReveals(root) {
      (root || document).querySelectorAll('.reveal').forEach(el => io.observe(el));
    }
  
    document.addEventListener('DOMContentLoaded', () => {
  
      /*  Year  */
      const yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
  
      /*  Navbar scroll state  */
      const nav = document.getElementById('mainNav');
      if (nav) {
        const onScroll = () => {
          if (window.scrollY > 30) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
      }
  
      /*  Mobile menu  */
      const navToggle = document.getElementById('navToggle');
      const mobileMenu = document.getElementById('mobileMenu');
      if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
          const open = mobileMenu.style.display === 'block';
          mobileMenu.style.display = open ? 'none' : 'block';
          navToggle.innerHTML = open ? '<i class="fa-solid fa-bars"></i>' : '<i class="fa-solid fa-xmark"></i>';
        });
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
          mobileMenu.style.display = 'none';
          navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }));
      }


      /* Scroll-spy for section-based nav links (index.html only) */
  const spySections = document.querySelectorAll('main section[id], header[id], section[id]');
  const spyLinks = document.querySelectorAll('.nav-links a[href*="#"], #mobileMenu a[href*="#"]');

  if (spySections.length && spyLinks.length) {
    const setActiveLink = (id) => {
      spyLinks.forEach(link => {
        const hash = link.getAttribute('href').split('#')[1];
        link.classList.toggle('active', hash === id);
      });
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    spySections.forEach(sec => spyObserver.observe(sec));
  }
  
      /* reveal elements already na exist sa static markup */
      observeReveals();
    });


    
  
    return { observeReveals };
  })();