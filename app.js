let activeCard = null;

function flipCard(el) {
  if (activeCard && activeCard !== el) {
    activeCard.classList.remove('face-up');
  }
  el.classList.toggle('face-up');
  activeCard = el.classList.contains('face-up') ? el : null;
}

function renderSuits() {
  const container = document.getElementById('suits-container');
  SUITS.forEach(suit => {
    const section = document.createElement('section');
    section.className = 'suit-section';
    section.style.setProperty('--suit-color', suit.color);
    section.innerHTML = `
      <div class="suit-header">
        <span class="suit-symbol">${suit.symbol}</span>
        <span class="suit-name">${suit.name}:</span>
        <span class="suit-sub">${suit.subtitle} — ${suit.theme}</span>
      </div>
      <div class="card-grid" id="grid-${suit.id}"></div>
    `;
    container.appendChild(section);
    const grid = section.querySelector(`#grid-${suit.id}`);

    // Ace — always visible, no flip
    const ace = document.createElement('div');
    ace.className = 'card ace';
    ace.innerHTML = `
      <div class="card-rank">${suit.action.rank}<span class="sym">${suit.symbol}</span></div>
      <div class="card-body">
        <div>
          <div class="ace-name">${suit.action.name}</div>
          <div>${suit.action.description}</div>
        </div>
      </div>
    `;
    grid.appendChild(ace);

    // Question cards — face-down by default, click to flip
    suit.cards.forEach(card => {
      const el = document.createElement('div');
      el.className = 'card question';
      el.innerHTML = `
        <div class="card-inner">
          <div class="card-back">
            <div class="card-back-symbol">${suit.symbol}</div>
            <div class="card-back-label">Common Lore</div>
          </div>
          <div class="card-front">
            <div class="card-rank">${card.rank}<span class="sym">${suit.symbol}</span></div>
            <div class="card-body">${card.question}</div>
          </div>
        </div>
      `;
      el.addEventListener('click', () => flipCard(el));
      grid.appendChild(el);
    });
  });
}

document.addEventListener('DOMContentLoaded', renderSuits);
