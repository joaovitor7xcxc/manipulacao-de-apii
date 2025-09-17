const apiKey = 'imfhCCMQHpAh0c1mdNUMhoaaJjxlz7J3i9MKv3Z5';
const dateInput = document.getElementById('dateInput');
const btnFetch = document.getElementById('btnFetch');
const btnToday = document.getElementById('btnToday');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const title = document.getElementById('title');
const media = document.getElementById('media');
const description = document.getElementById('description');
const dateDisplay = document.getElementById('dateDisplay');
const errorMsg = document.getElementById('errorMsg');

let currentDate = new Date();

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function setMaxDate() {
  const today = new Date();
  dateInput.max = formatDate(today);
}

function clearDisplay() {
  title.textContent = 'NASA Picture Explorer';
  media.innerHTML = '';
  description.textContent = '';
  dateDisplay.textContent = '';
  errorMsg.textContent = '';
}

function showError(msg) {
  clearDisplay();
  errorMsg.textContent = msg;
}

function showData(data) {
  clearDisplay();
  title.textContent = data.title;
  description.textContent = data.explanation;
  dateDisplay.textContent = `Data: ${data.date}`;

  if (data.media_type === 'image') {
    const img = document.createElement('img');
    img.src = data.url;
    img.alt = data.title;
    media.appendChild(img);
  } else if (data.media_type === 'video') {
    const iframe = document.createElement('iframe');
    iframe.src = data.url;
    iframe.width = '100%';
    iframe.height = '400';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    media.appendChild(iframe);
  } else {
    media.textContent = 'Tipo de mídia não suportado.';
  }
}

async function fetchData(date) {
  clearDisplay();
  errorMsg.textContent = 'Carregando...';
  let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
  if (date) {
    url += `&date=${date}`;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Data não disponível');
    const data = await response.json();
    showData(data);
    currentDate = new Date(data.date);
    dateInput.value = data.date;
  } catch {
    showError('Não foi possível carregar a imagem para essa data.');
  }
}

function changeDate(days) {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + days);
  const today = new Date();
  if (newDate > today) return;
  currentDate = newDate;
  fetchData(formatDate(currentDate));
}

btnFetch.addEventListener('click', () => {
  if (!dateInput.value) return showError('Selecione uma data válida.');
  fetchData(dateInput.value);
});

btnToday.addEventListener('click', () => {
  currentDate = new Date();
  fetchData(formatDate(currentDate));
});

btnPrev.addEventListener('click', () => {
  changeDate(-1);
});

btnNext.addEventListener('click', () => {
  changeDate(1);
});

window.onload = () => {
  setMaxDate();
  fetchData(formatDate(currentDate));
};
