
   document.addEventListener('DOMContentLoaded', () => {

    const history = ComsocData.history;

    /* Intro copy  */
    const introEl = document.getElementById('historyIntro');
    if (introEl && history) {
      introEl.innerHTML = history.intro.map(p => `<p>${p}</p>`).join('');
    }

    /*  Timeline  */
    const timelineEl = document.getElementById('historyTimeline');
    if (timelineEl && history) {
      history.terms.forEach(term => {
        const eventsHtml = term.events.map(e => `
          <div class="timeline-event">
            <div class="timeline-event-title"><i class="fa-solid fa-diamond"></i>${e.title}</div>
            <p class="timeline-event-desc">${e.desc}</p>
          </div>
        `).join('');
        const avatarHtml = term.img
        ? `<img src="${term.img}" alt="${term.president}" class="timeline-avatar-img">`
        : `<i class="fa-solid fa-user-graduate"></i>`;

      const item = document.createElement('div');
      item.className = 'timeline-item reveal';
      item.innerHTML = `
        <div class="timeline-card glass glass-hover">
          <div class="timeline-sy">${term.sy}</div>
          <div class="timeline-head">
            <div class="timeline-avatar">${avatarHtml}</div>
            <div>
              <div class="timeline-president-name">${term.president}</div>
              <div class="timeline-president-role">President &middot; ${term.course}</div>
            </div>
          </div>
          <div class="timeline-events">${eventsHtml}</div>
        </div>
      `;
        timelineEl.appendChild(item);
      });
      Comsoc.observeReveals(timelineEl);
    }

  });