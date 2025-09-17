document.addEventListener('DOMContentLoaded', () => {
    const campoData = document.getElementById('campoData');
    const btnBuscar = document.getElementById('btnBuscar');
    const btnToday = document.getElementById('todayBtn');
    const btnPrev = document.getElementById('prevBtn');
    const btnNext = document.getElementById('nextBtn');
    const tituloMidia = document.getElementById('tituloMidia');
    const caixaMidia = document.getElementById('caixaMidia');
    const textoDescricao = document.getElementById('textoDescricao');
    const textoData = document.getElementById('textoData');
    const cardResultado = document.querySelector('.card-resultado');

    const API_KEY = 'imfhCCMQHpAh0c1mdNUMhoaaJjxlz7J3i9MKv3Z5';

    if (cardResultado) cardResultado.classList.remove('visivel');

    async function buscarFoto(dataManual) {
        const data = dataManual || campoData.value;
        if (!data) {
            if (tituloMidia) tituloMidia.textContent = '';
            if (caixaMidia) caixaMidia.innerHTML = '';
            if (textoDescricao) textoDescricao.textContent = '';
            if (textoData) textoData.textContent = 'Selecione uma data!';
            if (cardResultado) cardResultado.classList.remove('visivel');
            return;
        }

        if (textoData) textoData.textContent = 'Buscando...';
        if (tituloMidia) tituloMidia.textContent = '';
        if (caixaMidia) caixaMidia.innerHTML = '';
        if (textoDescricao) textoDescricao.textContent = '';

        try {
            const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${data}`;
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao buscar dados da NASA');
            const dados = await resposta.json();

            if (tituloMidia) tituloMidia.textContent = dados.title || '';
            if (textoDescricao) textoDescricao.textContent = dados.explanation || '';
            if (textoData) textoData.textContent = dados.date || '';

            if (dados.media_type === 'image') {
                if (caixaMidia) caixaMidia.innerHTML = `<img src="${dados.url}" alt="${dados.title}" style="max-width:100%; max-height:500px; border-radius:8px; display:block; margin:auto; box-shadow: 0 8px 24px rgba(0,0,0,0.5);">`;
            } else if (dados.media_type === 'video') {
                if (caixaMidia) caixaMidia.innerHTML = `<iframe src="${dados.url}" frameborder="0" allowfullscreen style="width:100%;min-height:400px;border-radius:8px;"></iframe>`;
            } else {
                if (caixaMidia) caixaMidia.innerHTML = `<p>Tipo de mídia não suportado.</p>`;
            }
            if (cardResultado) cardResultado.classList.add('visivel');
            campoData.value = data; // Atualiza o campo de data
        } catch (erro) {
            if (tituloMidia) tituloMidia.textContent = '';
            if (caixaMidia) caixaMidia.innerHTML = '';
            if (textoDescricao) textoDescricao.textContent = '';
            if (textoData) textoData.textContent = 'Erro ao buscar dados!';
            if (cardResultado) cardResultado.classList.add('visivel');
        }
    }

    if (btnBuscar) btnBuscar.addEventListener('click', () => buscarFoto());

    // Botão Hoje
    if (btnToday) btnToday.addEventListener('click', () => {
        const hoje = new Date();
        const yyyy = hoje.getFullYear();
        const mm = String(hoje.getMonth() + 1).padStart(2, '0');
        const dd = String(hoje.getDate()).padStart(2, '0');
        const dataHoje = `${yyyy}-${mm}-${dd}`;
        campoData.value = dataHoje;
        buscarFoto(dataHoje);
    });

    // Botão Anterior
    if (btnPrev) btnPrev.addEventListener('click', () => {
        if (!campoData.value) return;
        const dataAtual = new Date(campoData.value);
        dataAtual.setDate(dataAtual.getDate() - 1);
        const dataAnterior = dataAtual.toISOString().split('T')[0];
        campoData.value = dataAnterior;
        buscarFoto(dataAnterior);
    });

    // Botão Próxima
    if (btnNext) btnNext.addEventListener('click', () => {
        if (!campoData.value) return;
        const dataAtual = new Date(campoData.value);
        dataAtual.setDate(dataAtual.getDate() + 1);
        const dataProxima = dataAtual.toISOString().split('T')[0];
        campoData.value = dataProxima;
        buscarFoto(dataProxima);
    });
});
