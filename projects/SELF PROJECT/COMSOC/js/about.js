
   document.addEventListener('DOMContentLoaded', () => {

    const achievements = ComsocData.achievements;
    const achGrid = document.getElementById('achievementsGrid');
  
    if (achGrid) {
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
    }
  
  });