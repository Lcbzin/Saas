function formatarData(data) {
    const partes = String(data).split("-");
    if (partes.length !== 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto; // textContent evita injeção de HTML
    return celula;
}

function mostrarMensagem(tabela, mensagem) {
    tabela.innerHTML = "";
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 5;
    celula.textContent = mensagem;
    linha.appendChild(celula);
    tabela.appendChild(linha);
}

async function carregarVendas() {
    const tabela = document.getElementById("tabela-vendas");

    try {
        const resposta = await fetch(`${API_URL}/vendas`);
        if (!resposta.ok) throw new Error("Erro ao consultar as vendas.");

        const dados = await resposta.json();

        if (!Array.isArray(dados) || dados.length === 0) {
            mostrarMensagem(tabela, "Nenhuma venda encontrada.");
            return;
        }

        tabela.innerHTML = "";

        dados.forEach(venda => {
            const linha = document.createElement("tr");
            linha.appendChild(criarCelula(formatarData(venda.data)));
            linha.appendChild(criarCelula(venda.produto));
            linha.appendChild(criarCelula(venda.quantidade));
            linha.appendChild(criarCelula(formatarMoeda(venda.preco_unitario)));
            linha.appendChild(criarCelula(
                formatarMoeda(venda.quantidade * venda.preco_unitario)
            ));
            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro nas vendas:", erro);
        mostrarMensagem(tabela, "Não foi possível carregar as vendas. Verifique a API.");
    }
}

carregarVendas();
