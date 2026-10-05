const API_URL = "http://127.0.0.1:8000";

async function carregarVendas() {

    const resposta = await fetch(`${API_URL}/vendas`);

    const dados = await resposta.json();

    const tabela = document.getElementById("tabela-vendas");

    dados.forEach(venda => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
    <td>${formatarData(venda.data)}</td>
    <td>${venda.produto}</td>
    <td>${venda.quantidade}</td>
    <td>${formatarMoeda(venda.preco_unitario)}</td>
    <td>${formatarMoeda(venda.quantidade * venda.preco_unitario)}</td>
`;

        tabela.appendChild(linha);
    });
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data) {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

carregarVendas();   