
   document.addEventListener('DOMContentLoaded', () => {

    /* EXECUTIVE BOARD CAROUSEL */
  const board = ComsocData.mainOfficers;
  
    const ebCard = document.getElementById('ebCard');
    const ebDots = document.getElementById('ebDots');
    let ebIndex = 0;
  
    function renderEB(i) {
      const m = board[i];
      ebCard.innerHTML = `
        <div class="eb-photo">
          <img src="${m.img}" alt="${m.name}" class="eb-photo-img">
        </div>
        <div class="eb-content">
          <div class="eb-eyebrow">Executive Board Member</div>
          <div class="eb-name">${m.name}</div>
          <div class="eb-role">${m.role}</div>
          <p class="eb-bio">${m.bio}</p>
        </div>
      `;
      ebDots.querySelectorAll('.eb-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
    }
  
    board.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'eb-dot' + (idx === 0 ? ' active' : '');
      dot.addEventListener('click', () => { ebIndex = idx; renderEB(ebIndex); });
      ebDots.appendChild(dot);
    });
  
    document.getElementById('ebPrev').addEventListener('click', () => {
      ebIndex = (ebIndex - 1 + board.length) % board.length;
      renderEB(ebIndex);
    });
    document.getElementById('ebNext').addEventListener('click', () => {
      ebIndex = (ebIndex + 1) % board.length;
      renderEB(ebIndex);
    });
  
    renderEB(ebIndex);
  
    let ebAuto = setInterval(() => {
      ebIndex = (ebIndex + 1) % board.length;
      renderEB(ebIndex);
    }, 7000);
    ['ebPrev','ebNext'].forEach(id => document.getElementById(id).addEventListener('click', () => {
      clearInterval(ebAuto);
      ebAuto = setInterval(() => { ebIndex = (ebIndex + 1) % board.length; renderEB(ebIndex); }, 7000);
    }));
  
    /* FACULTY ADVISER*/
       const advisers = ComsocData.advisers;
  
    const adviserGrid = document.getElementById('adviserGrid');
    advisers.forEach(a => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4 reveal';
      col.innerHTML = `
      <div class="adviser-card glass glass-hover h-100">
        <div class="adviser-photo"><img src="${a.img}" alt="${a.name}" class="adviser-photo-img"></div>
        <div class="adviser-name">${a.name}</div>
          <div class="adviser-role">${a.role}</div>
          <p class="adviser-bio mb-0">${a.bio}</p>
        </div>
      `;
      adviserGrid.appendChild(col);
    });
    Comsoc.observeReveals(adviserGrid);
  
    /*ORGANIZATIONAL STRUCTURE — COMMITTEES*/
       const committees = ComsocData.committees;
  
    const committeeGrid = document.getElementById('committeeGrid');
    committees.forEach(c => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4 reveal';
      col.innerHTML = `
        <div class="committee-card glass glass-hover h-100">
          <div class="committee-icon"><i class="fa-solid ${c.icon}"></i></div>
          <div class="committee-name">${c.name}</div>
          <p class="committee-desc mb-0">${c.desc}</p>
        </div>
      `;
      committeeGrid.appendChild(col);
    });
    Comsoc.observeReveals(committeeGrid);
  
    /*NEWS & ANNOUNCEMENTS*/
       const news = ComsocData.news;

       const newsGrid = document.getElementById('newsGrid');
       
       news.forEach((n, index) => {
           const col = document.createElement('div');
           col.className = 'col-md-6 col-lg-3 reveal';
       
           col.innerHTML = `
               <div class="news-card glass glass-hover h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#newsModal"
                    data-index="${index}">
       
                   <div class="news-thumb">
                       <img src="${n.image}" alt="${n.title}">
                   </div>
       
                   <div class="news-body">
                       <div class="news-meta">
                           <span>${n.tag}</span>
                           <span class="dot"></span>
                           <span class="date">${n.date}</span>
                       </div>
       
                       <div class="news-title">${n.title}</div>
       
                       <p class="news-excerpt">${truncateText(n.excerpt, 120)}</p>
       
                       <span class="news-link">
                           Read more <i class="fa-solid fa-arrow-right"></i>
                       </span>
                   </div>
               </div>
           `;
       
           newsGrid.appendChild(col);
       });
       
       Comsoc.observeReveals(newsGrid);
       
       // 👇 PUT IT HERE
       document.querySelectorAll(".news-card").forEach(card => {
       
           card.addEventListener("click", () => {
       
               const news = ComsocData.news[card.dataset.index];
       
               document.getElementById("modalNewsImage").src = news.image;
               document.getElementById("modalNewsImage").alt = news.title;
       
               document.getElementById("modalNewsTag").textContent = news.tag;
               document.getElementById("modalNewsDate").textContent = news.date;
               document.getElementById("modalNewsTitle").textContent = news.title;
               document.getElementById("modalNewsDesc").innerHTML = news.desc;
       
           });
       
       });
  
/*EVENTS & ACTIVITIES*/
const events = ComsocData.events;
const eventsGrid = document.getElementById('eventsGrid');
events.forEach((e, index) => {
  const metaHtml = e.meta.map(([icon, text]) => `<span><i class="fa-solid ${icon}"></i>${text}</span>`).join('');
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4 reveal';
  col.innerHTML = `
    <div class="event-card glass glass-hover h-100"
         data-bs-toggle="modal"
         data-bs-target="#eventModal"
         data-index="${index}">
    <div class="event-media">
    <img src="${e.image}" alt="${e.title}">
    <div class="event-date-badge">
        <div class="d">${e.d}</div>
        <div class="m">${e.m}</div>
    </div>
</div>
      <div class="event-body">
        <div class="event-tag">${e.tag}</div>
        <div class="event-title">${e.title}</div>
        <div class="event-meta">${metaHtml}</div>
      </div>
    </div>
  `;
  eventsGrid.appendChild(col);
});
Comsoc.observeReveals(eventsGrid);

document.querySelectorAll(".event-card").forEach(card => {
  card.addEventListener("click", () => {
    const ev = ComsocData.events[card.dataset.index];

    document.getElementById("modalEventImage").src = ev.image;
    document.getElementById("modalEventImage").alt = ev.title;

    document.getElementById("modalEventTag").textContent = ev.tag;
    document.getElementById("modalEventTitle").textContent = ev.title;

    document.getElementById("modalEventLocation").textContent = ev.location || 'TBA';
    document.getElementById("modalEventDate").textContent = ev.date || 'TBA';
    document.getElementById("modalEventTime").textContent = ev.time || 'TBA';

    document.getElementById("modalEventDesc").innerHTML = ev.desc;
  });
});
  
    /*ACHIEVEMENTS (4 CARDS) */
       const achievements = ComsocData.achievements;
  
    const achGrid = document.getElementById('achievementsGrid');
    achievements.forEach(a => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3 reveal';
      col.innerHTML = `
        <div class="ach-card glass glass-hover h-100">
          <div class="ach-num">${a.num}</div>
          <div class="ach-label">${a.label}</div>
          <div class="ach-title">${a.title}</div>
          <p class="ach-desc mb-0">${a.desc}</p>
        </div>
      `;
      achGrid.appendChild(col);
    });
    Comsoc.observeReveals(achGrid);
  
    /* GALLERY CAROUSEL*/
       const galleryImages = [
        'assets/gallery/gallery1.jpg',
        'assets/gallery/gallery2.jpg',
        'assets/gallery/gallery3.jpg',
        'assets/gallery/gallery4.jpg',

      ];
    const track = document.getElementById('galleryTrack');
    galleryImages.forEach((image, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
    
      item.innerHTML = `
        <img src="${image}" alt="Gallery Image ${index + 1}">
      `;
    
      track.appendChild(item);
    });
  
    let galIndex = 0;
    function galVisible() { return window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 3; }
    function updateGallery() {
      const visible = galVisible();
      const maxIndex = Math.max(0, galleryImages.length - visible);
      galIndex = Math.min(galIndex, maxIndex);
      const itemWidth = track.children[0].getBoundingClientRect().width + 20;
      track.style.transform = `translateX(-${galIndex * itemWidth}px)`;
    }
    document.getElementById('galPrev').addEventListener('click', () => {
      galIndex = Math.max(0, galIndex - 1);
      updateGallery();
    });
    document.getElementById('galNext').addEventListener('click', () => {
      const visible = galVisible();
      const maxIndex = Math.max(0, galleryImages.length - visible);
      galIndex = Math.min(maxIndex, galIndex + 1);
      updateGallery();
    });
    window.addEventListener('resize', updateGallery);
    window.addEventListener('load', updateGallery);
    setTimeout(updateGallery, 200);
  
  });

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
}