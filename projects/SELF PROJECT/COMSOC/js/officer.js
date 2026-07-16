document.addEventListener('DOMContentLoaded', () => {

    function renderOfficerCard({ name, role, bio, img }) {
      return `
        <div class="col-md-6 col-lg-4 reveal">
          <div class="adviser-card glass glass-hover h-100">
            <div class="adviser-photo"><img src="${img}" alt="${name}" class="adviser-photo-img"></div>
            <div class="adviser-name">${name}</div>
            <div class="adviser-role">${role}</div>
            <p class="adviser-bio mb-0">${bio}</p>
          </div>
        </div>
      `;
    }
  
    const mainGrid = document.getElementById('mainOfficersGrid');
    const headsGrid = document.getElementById('committeeHeadsGrid');
  
    if (mainGrid) {
      ComsocData.mainOfficers.forEach(o => mainGrid.insertAdjacentHTML('beforeend', renderOfficerCard(o)));
      Comsoc.observeReveals(mainGrid);
    }
  
    if (headsGrid) {
      ComsocData.committees.forEach(c => {
        headsGrid.insertAdjacentHTML('beforeend', renderOfficerCard({
          name: c.headName,
          role: `${c.name} Head`,
          bio: c.headBio,
          img: c.headImg
        }));
      });
      Comsoc.observeReveals(headsGrid);
    }
  
  });