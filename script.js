const apiKey = "imfhCCMQHpAh0c1mdNUMhoaaJjxlz7J3i9MKv3Z5";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

const dateInput = document.getElementById("dateInput");
const btnFetch = document.getElementById("btnFetch");
const btnToday = document.getElementById("btnToday");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const displayArea = document.getElementById("displayArea");

// Define a data máxima permitida no input (hoje)
const today = new Date();
dateInput.max = today.toISOString().slice(0, 10);
dateInput.value = dateInput.max; // Começa no dia atual

// Função para formatar data no formato YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Carrega os dados da NASA para uma data específica
async function loadAPOD(date) {
  displayArea.style.opacity = 0.5;
  displayArea.innerHTML = "<p>Carregando...</p>";

  try {
    const response = await fetch(`${apiUrl}&date=${date}`);
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error(
          "Limite de requisições da API excedido ou chave inválida. Registre sua própria chave em api.nasa.gov."
        );
      } else {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();

    if (data.code) {
      // Quando API retorna erro no JSON (ex: data inválida)
      displayArea.innerHTML = `<p style="color:#ffc107;">${data.msg}</p>`;
      displayArea.style.opacity = 1;
      return;
    }

    let mediaHTML = "";
    if (data.media_type === "image") {
      mediaHTML = `<img src="${data.url}" alt="${data.title}" loading="lazy">`;
    } else if (data.media_type === "video") {
      mediaHTML = `<iframe src="${data.url}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>`;
    } else {
      mediaHTML = "<p>Tipo de mídia não suportado.</p>";
    }

    const textoUmbraPT = `A sombra escura interna do planeta Terra é chamada de umbra. Com formato semelhante a um cone que se estende no espaço, ela tem uma seção transversal circular que é mais facilmente vista durante um eclipse lunar. Na noite de 7 para 8 de setembro, a Lua Cheia passou perto do centro do cone umbral da Terra, proporcionando um espetáculo para observadores do eclipse em várias partes do planeta, incluindo Antártica, Austrália, Ásia, Europa e África.

Essa imagem em time-lapse foi registrada na cidade de Zhangjiakou, na China, usando fotos consecutivas do eclipse lunar total. A sequência mostra a seção transversal curva da sombra umbral deslizando pela superfície da Lua, da esquerda para a direita.

A luz do Sol, ao ser espalhada pela atmosfera da Terra e entrar na umbra, faz a superfície lunar parecer avermelhada durante a totalidade do eclipse. Porém, próximo à borda da umbra, a borda da Lua eclipsada mostra uma tonalidade azul distinta. Isso acontece porque a luz azul da Lua eclipsada é originada por raios solares que passam por camadas altas da estratosfera terrestre, onde o ozônio espalha a luz vermelha e transmite a azul.

Durante a fase total desse eclipse lunar, a Lua ficou completamente dentro da umbra da Terra por cerca de 83 minutos.`;

    let descriptionToShow = data.explanation;

    // Se for a data 2025-09-11, usa o texto em português
    if (data.date === "2025-09-11") {
      descriptionToShow = textoUmbraPT;
    }

    displayArea.innerHTML = `
      <h2>${data.title}</h2>
      <p class="date">${data.date}</p>
      ${mediaHTML}
      <p class="description">${descriptionToShow}</p>
    `;
  } catch (error) {
    displayArea.innerHTML = `<p style="color:#ff6b6b;">Erro: ${error.message}</p>`;
  } finally {
    displayArea.style.opacity = 1;
  }
}

// Botão buscar
btnFetch.addEventListener("click", () => {
  if (!dateInput.value) {
    alert("Por favor, selecione uma data.");
    return;
  }
  loadAPOD(dateInput.value);
});

// Botão hoje
btnToday.addEventListener("click", () => {
  dateInput.value = dateInput.max;
  loadAPOD(dateInput.value);
});

// Botão anterior
btnPrev.addEventListener("click", () => {
  let date = new Date(dateInput.value);
  date.setDate(date.getDate() - 1);

  const firstDate = new Date("1995-06-16");
  if (date < firstDate) {
    alert("Não há imagens anteriores a 16 de junho de 1995.");
    return;
  }

  dateInput.value = formatDate(date);
  loadAPOD(dateInput.value);
});

// Botão próxima
btnNext.addEventListener("click", () => {
  let date = new Date(dateInput.value);
  date.setDate(date.getDate() + 1);

  const maxDate = new Date(dateInput.max);
  if (date > maxDate) {
    alert("Não pode selecionar uma data futura.");
    return;
  }

  dateInput.value = formatDate(date);
  loadAPOD(dateInput.value);
});

// Carregar foto do dia atual ao abrir a página
loadAPOD(dateInput.value);
