const START = new Date('2026-10-20T00:00:00');
const TOTAL_DAYS = 73;

function pct(date) {
  return ((new Date(date) - START) / (TOTAL_DAYS * 86400000)) * 100;
}

function barW(start, end) {
  return pct(end) - pct(start);
}

const blocks = [
  {
    id: 'analiza',
    title: 'Analiza tematu',
    num: '01',
    dates: '20–26 paź',
    duration: '1 tydzień',
    color: '#c8410a',
    start: '2026-10-20',
    end: '2026-10-27',
    people: 'Cały zespół',
    task: 'Definicja IoT, historia i podstawowe pojęcia.'
  },
  {
    id: 'badania',
    title: 'Badania i źródła',
    num: '02',
    dates: '27 paź – 5 lis',
    duration: '10 dni',
    color: '#1a5c3a',
    start: '2026-10-27',
    end: '2026-11-06',
    people: 'Cały zespół',
    task: 'Wyszukiwanie wiarygodnych źródeł i przykładów zastosowań IoT.'
  },
  {
    id: 'tresc',
    title: 'Opracowanie treści',
    num: '03',
    dates: '6–15 lis',
    duration: '10 dni',
    color: '#1e3f7a',
    start: '2026-11-06',
    end: '2026-11-16',
    people: 'Cały zespół',
    task: 'Opracowanie korzyści, zagrożeń i tekstów projektu.'
  },
  {
    id: 'prezentacja',
    title: 'Prezentacja',
    num: '04',
    dates: '16–25 lis',
    duration: '10 dni',
    color: '#7a2080',
    start: '2026-11-16',
    end: '2026-11-26',
    people: 'Agata · Amelka · Sara',
    task: 'Przygotowanie slajdów, ilustracji i bibliografii.'
  },
  {
    id: 'strona',
    title: 'Strona internetowa',
    num: '05',
    dates: '20 lis – 9 gru',
    duration: '20 dni',
    color: '#8a6200',
    start: '2026-11-20',
    end: '2026-12-10',
    people: 'Dominika · Ola',
    task: 'Kodowanie HTML, CSS i JS, uzupełnianie treści oraz poprawa wyglądu.'
  },
  {
    id: 'testy',
    title: 'Testy i finalizacja',
    num: '06',
    dates: '10–31 gru',
    duration: '22 dni',
    color: '#c8410a',
    start: '2026-12-10',
    end: '2027-01-01',
    people: 'Cały zespół',
    task: 'Testy strony, poprawki, korekta prezentacji i przygotowanie plików do oddania.'
  }
];

const topics = [
  {
    id: 'analiza',
    color: '#c8410a',
    title: '1. Podstawy IoT',
    items: [
      'Definicja Internetu rzeczy',
      'Historia i rozwój technologii IoT',
      'Zasada działania urządzeń IoT',
      'Czujniki, sieci i przesyłanie danych',
      'Przykłady urządzeń codziennego użytku'
    ]
  },
  {
    id: 'badania',
    color: '#1a5c3a',
    title: '2. Zastosowania IoT',
    items: [
      'Inteligentne domy i automatyka',
      'Medycyna i urządzenia monitorujące zdrowie',
      'Inteligentny transport i miasta',
      'Przemysł 4.0 i rolnictwo',
      'Wyszukanie wiarygodnych źródeł'
    ]
  },
  {
    id: 'tresc',
    color: '#1e3f7a',
    title: '3. Korzyści i zagrożenia',
    items: [
      'Automatyzacja codziennych czynności',
      'Oszczędność energii i czasu',
      'Analiza danych w czasie rzeczywistym',
      'Prywatność użytkowników',
      'Cyberbezpieczeństwo i ryzyko awarii'
    ]
  },
  {
    id: 'prezentacja',
    color: '#7a2080',
    title: '4. Prezentacja',
    items: [
      'Opracowanie planu prezentacji',
      'Przygotowanie wstępu i definicji IoT',
      'Przedstawienie przykładów zastosowań',
      'Omówienie korzyści i zagrożeń',
      'Bibliografia i korekta slajdów'
    ]
  },
  {
    id: 'strona',
    color: '#8a6200',
    title: '5. Strona internetowa',
    items: [
      'Przygotowanie struktury strony',
      'Opis technologii Internetu rzeczy',
      'Sekcja zastosowań w codziennym życiu',
      'Sekcja korzyści i zagrożeń',
      'Sprawdzenie działania na telefonie i komputerze'
    ]
  },
  {
    id: 'testy',
    color: '#c8410a',
    title: '6. Testy i oddanie',
    items: [
      'Sprawdzenie poprawności treści',
      'Testowanie linków i nawigacji',
      'Poprawki wizualne i techniczne',
      'Kontrola prezentacji i bibliografii',
      'Przygotowanie finalnych plików',
      'Zakończenie projektu do 31 grudnia'
    ]
  }
];

const state = {};
const IP_STORAGE_KEY = 'iot_ip_key';

function safeIpKey(value) {
  return String(value || 'local')
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/_+/g, '_');
}

function getCurrentStorageKey() {
  return 'iot_state_' + safeIpKey(
    localStorage.getItem(IP_STORAGE_KEY) || 'local'
  );
}

function loadStateFromStorage() {
  try {
    const key = getCurrentStorageKey();
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : {};

    topics.forEach(topic => {
      state[topic.id] = Array.isArray(parsed[topic.id]) ? parsed[topic.id] : [];
    });
  } catch (error) {
    topics.forEach(topic => {
      state[topic.id] = [];
    });
  }
}

async function refreshIpKey() {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('IP fetch failed');
    }

    const data = await response.json();
    const ip = data && data.ip ? data.ip : 'local';
    const key = safeIpKey(ip);

    localStorage.setItem(IP_STORAGE_KEY, ip);
    return key;
  } catch (error) {
    return safeIpKey(localStorage.getItem(IP_STORAGE_KEY) || 'local');
  }
}

function saveState() {
  try {
    const key = getCurrentStorageKey();
    const payload = {};

    topics.forEach(topic => {
      payload[topic.id] = state[topic.id] || [];
    });

    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
  }
}

loadStateFromStorage();
refreshIpKey().then(() => {
  const key = getCurrentStorageKey();
  const raw = localStorage.getItem(key);

  if (raw) {
    const parsed = JSON.parse(raw);
    topics.forEach(topic => {
      state[topic.id] = Array.isArray(parsed[topic.id]) ? parsed[topic.id] : [];
    });
  }
});

function checkSVG(color) {
  return `
    <svg viewBox="0 0 10 8" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4L3.5 6.5L9 1"
            stroke="${color}"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>`;
}

const ganttEl = document.getElementById('gantt');

blocks.forEach(block => {
  const left = Math.max(0, pct(block.start));
  const width = Math.min(
    100 - left,
    barW(block.start, block.end)
  );

  const row = document.createElement('div');
  row.className = 'gantt-row';

  row.innerHTML = `
    <div class="row-info">
      <div class="row-num">${block.num}</div>

      <div class="row-title" style="color:${block.color}">
        ${block.title}
      </div>

      <div class="row-dates">${block.dates}</div>

      <div class="row-duration"
           style="color:${block.color};border-color:${block.color}55">
        ${block.duration}
      </div>

      <div class="row-mini-progress">
        <div class="row-mini-fill"
             id="minifill-${block.id}"
             style="background:${block.color}">
        </div>
      </div>
    </div>

    <div class="gantt-timeline">
      <div class="bar-container">
        <div class="bar"
             id="bar-${block.id}"
             style="left:${left}%;width:${Math.max(0, width)}%;background:${block.color}">
          ${block.title}
        </div>
      </div>
    </div>

    <div class="gantt-assignment">
      <div class="assignment-people"
           style="color:${block.color}">
        ${block.people}
      </div>

      <div class="assignment-task">
        ${block.task}
      </div>
    </div>
  `;

  ganttEl.appendChild(row);
});

const topicsEl = document.getElementById('topics');

topics.forEach(topic => {
  const saved = state[topic.id] || [];
  const card = document.createElement('div');
  card.className = 'topic-card';

  card.innerHTML = `
    <div class="card-stripe" style="background:${topic.color}"></div>

    <div class="card-title" style="color:${topic.color}">
      ${topic.title}
    </div>

    <div class="card-progress">
      <div class="card-progress-fill"
           id="cfill-${topic.id}"
           style="background:${topic.color}">
      </div>
    </div>

    <ul class="topic-list">
      ${topic.items.map((item, index) => `
        <li class="${saved.includes(index) ? 'done' : ''}"
            data-id="${topic.id}"
            data-i="${index}">
          <span class="cb">${checkSVG(topic.color)}</span>
          <span>${item}</span>
        </li>
      `).join('')}
    </ul>
  `;

  topicsEl.appendChild(card);
});

function updateProgress() {
  let totalDone = 0;
  let totalAll = 0;

  topics.forEach(topic => {
    const count = topic.items.length;
    const done = (state[topic.id] || []).length;

    totalDone += done;
    totalAll += count;

    const progress = count > 0
      ? (done / count) * 100
      : 0;

    const cardFill = document.getElementById('cfill-' + topic.id);
    const miniFill = document.getElementById('minifill-' + topic.id);
    const bar = document.getElementById('bar-' + topic.id);

    if (cardFill) {
      cardFill.style.width = progress + '%';
    }

    if (miniFill) {
      miniFill.style.width = progress + '%';
    }

    if (bar) {
      bar.classList.toggle('completed', progress >= 100);
    }
  });

  const overall = totalAll > 0
    ? Math.round((totalDone / totalAll) * 100)
    : 0;

  document.getElementById('overallFill').style.width = overall + '%';
  document.getElementById('overallPct').textContent = overall + '%';
}

topicsEl.addEventListener('click', event => {
  const li = event.target.closest('li[data-id]');
  if (!li) return;

  const id = li.dataset.id;
  const index = parseInt(li.dataset.i, 10);

  if (!state[id]) {
    state[id] = [];
  }

  const currentIndex = state[id].indexOf(index);

  if (currentIndex >= 0) {
    state[id].splice(currentIndex, 1);
    li.classList.remove('done');
  } else {
    state[id].push(index);
    li.classList.add('done');
  }

  saveState();
  updateProgress();
});

updateProgress();
