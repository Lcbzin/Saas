// ==========================================
// LZ ANALYTICS
// JAVASCRIPT DO DASHBOARD
// ==========================================


// URL BASE DA API

const API_URL =
    "http://127.0.0.1:8000";


// Variável que armazenará o gráfico

let graficoVendas = null;


// ==========================================
// FORMATAR VALORES EM REAIS
// ==========================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// ==========================================
// CARREGAR INDICADORES
// ==========================================

async function carregarIndicadores() {

    try {

        const resposta = await fetch(
            `${API_URL}/vendas/indicadores`
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar os indicadores."
            );
        }


        const dados =
            await resposta.json();


        // ==========================================
        // FATURAMENTO
        // ==========================================

        document.getElementById(
            "faturamento"
        ).innerText =
            formatarMoeda(
                dados.faturamento
            );


        // ==========================================
        // LUCRO
        // ==========================================

        document.getElementById(
            "lucro"
        ).innerText =
            formatarMoeda(
                dados.lucro
            );


        // ==========================================
        // QUANTIDADE DE VENDAS
        // ==========================================

        document.getElementById(
            "vendas"
        ).innerText =
            dados.quantidade_vendas;


        // ==========================================
        // QUANTIDADE DE PRODUTOS
        // ==========================================

        document.getElementById(
            "produtos"
        ).innerText =
            dados.quantidade_produtos;


        // ==========================================
        // TICKET MÉDIO
        // ==========================================

        document.getElementById(
            "ticket"
        ).innerText =
            formatarMoeda(
                dados.ticket_medio
            );


        // ==========================================
        // PRODUTO MAIS VENDIDO
        // ==========================================

        document.getElementById(
            "produto-mais-vendido"
        ).innerText =
            dados.produto_mais_vendido;


        // ==========================================
        // QUANTIDADE DO PRODUTO MAIS VENDIDO
        // ==========================================

        document.getElementById(
            "quantidade-produto-mais-vendido"
        ).innerText =

            `${dados.quantidade_produto_mais_vendido} unidades vendidas`;


    } catch (erro) {

        console.error(
            "Erro nos indicadores:",
            erro
        );


        document.getElementById(
            "faturamento"
        ).innerText =
            "Erro";


        document.getElementById(
            "lucro"
        ).innerText =
            "Erro";


        document.getElementById(
            "vendas"
        ).innerText =
            "Erro";


        document.getElementById(
            "produtos"
        ).innerText =
            "Erro";


        document.getElementById(
            "ticket"
        ).innerText =
            "Erro";


        document.getElementById(
            "produto-mais-vendido"
        ).innerText =
            "Erro";


        document.getElementById(
            "quantidade-produto-mais-vendido"
        ).innerText =
            "Verifique a API.";
    }
}


// ==========================================
// CARREGAR GRÁFICO
// ==========================================

async function carregarGraficoVendas() {

    const canvas =
        document.getElementById(
            "graficoVendas"
        );


    const container =
        canvas.parentElement;


    try {

        // ==========================================
        // CONSULTAR API
        // ==========================================

        const resposta = await fetch(
            `${API_URL}/vendas/faturamento-por-dia`
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar faturamento diário."
            );
        }


        const dados =
            await resposta.json();


        // ==========================================
        // VERIFICAR DADOS
        // ==========================================

        if (
            !Array.isArray(dados) ||
            dados.length === 0
        ) {

            container.innerHTML =
                "<p>Nenhum dado encontrado.</p>";

            return;
        }


        // ==========================================
        // SEPARAR DATAS
        // ==========================================

        const datas =
            dados.map(
                item => item.data
            );


        // ==========================================
        // SEPARAR FATURAMENTO
        // ==========================================

        const faturamentos =
            dados.map(
                item =>
                    Number(
                        item.faturamento
                    )
            );


        // ==========================================
        // VALIDAR NÚMEROS
        // ==========================================

        if (
            faturamentos.some(
                valor =>
                    !Number.isFinite(valor)
            )
        ) {

            throw new Error(
                "A API retornou valores inválidos."
            );
        }


        // ==========================================
        // EVITAR DUPLICAÇÃO DO GRÁFICO
        // ==========================================

        if (graficoVendas) {

            graficoVendas.destroy();
        }


        // ==========================================
        // CRIAR GRÁFICO
        // ==========================================

        graficoVendas =
            new Chart(
                canvas,
                {

                    type: "line",


                    data: {

                        labels: datas,


                        datasets: [

                            {

                                label:
                                    "Faturamento diário",


                                data:
                                    faturamentos,


                                borderColor:
                                    "#2563eb",


                                backgroundColor:
                                    "rgba(37, 99, 235, 0.12)",


                                borderWidth: 3,


                                pointRadius: 4,


                                pointHoverRadius: 6,


                                fill: true,


                                tension: 0.3

                            }

                        ]

                    },


                    options: {

                        responsive: true,


                        maintainAspectRatio:
                            false,


                        interaction: {

                            intersect: false,

                            mode: "index"

                        },


                        plugins: {

                            legend: {

                                display: true

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (
                                            contexto
                                        ) {

                                            return (
                                                "Faturamento: " +
                                                formatarMoeda(
                                                    contexto.parsed.y
                                                )
                                            );
                                        }

                                }

                            }

                        },


                        scales: {

                            y: {

                                beginAtZero: true,


                                title: {

                                    display: true,

                                    text:
                                        "Faturamento (R$)"

                                },


                                ticks: {

                                    callback:
                                        function (
                                            valor
                                        ) {

                                            return Number(
                                                valor
                                            ).toLocaleString(
                                                "pt-BR",
                                                {
                                                    style:
                                                        "currency",

                                                    currency:
                                                        "BRL",

                                                    notation:
                                                        "compact"
                                                }
                                            );
                                        }

                                }

                            },


                            x: {

                                title: {

                                    display: true,

                                    text:
                                        "Data"

                                }

                            }

                        }

                    }

                }
            );


    } catch (erro) {

        console.error(
            "Erro no gráfico:",
            erro
        );


        container.innerHTML =

            "<p>Não foi possível carregar o gráfico. " +
            "Verifique a API e o console do navegador.</p>";
    }
}


// ==========================================
// INICIAR DASHBOARD
// ==========================================

async function iniciarDashboard() {

    await Promise.all([

        carregarIndicadores(),

        carregarGraficoVendas()

    ]);
}


// ==========================================
// EXECUTAR
// ==========================================

iniciarDashboard();