// LZ ANALYTICS - JavaScript do dashboard
// (API_URL, formatarMoeda e verificarApi vêm do config.js)

let graficoVendas = null;

function definirTexto(id, texto) {
    document.getElementById(id).innerText = texto;
}

async function carregarIndicadores() {
    try {
        const resposta = await fetch(`${API_URL}/vendas/indicadores`);
        if (!resposta.ok) throw new Error("Erro ao consultar os indicadores.");

        const dados = await resposta.json();

        definirTexto("faturamento", formatarMoeda(dados.faturamento));
        definirTexto("lucro", formatarMoeda(dados.lucro));
        definirTexto("vendas", dados.quantidade_vendas);
        definirTexto("produtos", dados.quantidade_produtos);
        definirTexto("ticket", formatarMoeda(dados.ticket_medio));
        definirTexto("produto-mais-vendido", dados.produto_mais_vendido);
        definirTexto(
            "quantidade-produto-mais-vendido",
            `${dados.quantidade_produto_mais_vendido} unidades vendidas`
        );

    } catch (erro) {
        console.error("Erro nos indicadores:", erro);

        ["faturamento", "lucro", "vendas", "produtos", "ticket", "produto-mais-vendido"]
            .forEach(id => definirTexto(id, "Erro"));

        definirTexto("quantidade-produto-mais-vendido", "Verifique a API.");
    }
}

function restaurarCanvas(container, mensagem) {
    if (graficoVendas) {
        graficoVendas.destroy();
        graficoVendas = null;
    }
    // Mantém o canvas no DOM para o botão Atualizar continuar funcionando
    container.innerHTML =
        '<canvas id="graficoVendas" style="display:none"></canvas>' +
        `<p>${mensagem}</p>`;
}

async function carregarGraficoVendas() {
    let container = document.getElementById("graficoVendas").parentElement;

    try {
        const resposta = await fetch(`${API_URL}/vendas/faturamento-por-dia`);
        if (!resposta.ok) throw new Error("Erro ao consultar faturamento diário.");

        const dados = await resposta.json();

        if (!Array.isArray(dados) || dados.length === 0) {
            restaurarCanvas(container, "Nenhum dado encontrado.");
            return;
        }

        const datas = dados.map(item => item.data);
        const faturamentos = dados.map(item => Number(item.faturamento));

        if (faturamentos.some(valor => !Number.isFinite(valor))) {
            throw new Error("A API retornou valores inválidos.");
        }

        // Se havia mensagem de erro, recria o canvas visível
        if (graficoVendas) graficoVendas.destroy();
        container.innerHTML = '<canvas id="graficoVendas"></canvas>';
        const canvas = document.getElementById("graficoVendas");

        graficoVendas = new Chart(canvas, {
            type: "line",
            data: {
                labels: datas,
                datasets: [{
                    label: "Faturamento diário",
                    data: faturamentos,
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37, 99, 235, 0.12)",
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: "index" },
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: contexto =>
                                "Faturamento: " + formatarMoeda(contexto.parsed.y)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Faturamento (R$)" },
                        ticks: {
                            callback: valor =>
                                Number(valor).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    notation: "compact"
                                })
                        }
                    },
                    x: { title: { display: true, text: "Data" } }
                }
            }
        });

    } catch (erro) {
        console.error("Erro no gráfico:", erro);
        restaurarCanvas(
            container,
            "Não foi possível carregar o gráfico. Verifique a API e o console do navegador."
        );
    }
}

async function iniciarDashboard() {
    await Promise.all([
        verificarApi(),
        carregarIndicadores(),
        carregarGraficoVendas()
    ]);
}

iniciarDashboard();
