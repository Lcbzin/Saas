// Configuração única do frontend (troque aqui ao publicar)
const API_URL = "http://127.0.0.1:8000";

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Testa a API e atualiza o indicador do menu lateral
async function verificarApi() {
    const ponto = document.getElementById("status-dot");
    const texto = document.getElementById("status-texto");
    if (!ponto || !texto) return;

    try {
        const resposta = await fetch(`${API_URL}/saude`);
        if (!resposta.ok) throw new Error("API com erro");
        ponto.classList.remove("offline");
        texto.textContent = "API Online";
    } catch (erro) {
        ponto.classList.add("offline");
        texto.textContent = "API Offline";
    }
}

verificarApi();
