import pandas as pd


def carregar_vendas():
    arquivo = 'data/vendas.csv'

    df = pd.read_csv(arquivo)

    return df


def calcular_indicadores(df):

    # ==========================================
    # FATURAMENTO TOTAL
    # ==========================================

    faturamento = (
        df["quantidade"] * df["preco_unitario"]
    ).sum()


    # ==========================================
    # CUSTO TOTAL
    # ==========================================

    custo_total = (
        df["quantidade"] * df["custo_unitario"]
    ).sum()


    # ==========================================
    # LUCRO
    # ==========================================

    lucro = faturamento - custo_total


    # ==========================================
    # QUANTIDADE DE VENDAS
    # ==========================================

    quantidade_vendas = len(df)


    # ==========================================
    # QUANTIDADE TOTAL DE PRODUTOS VENDIDOS
    # ==========================================

    quantidade_produtos = df["quantidade"].sum()


    # ==========================================
    # TICKET MÉDIO
    # ==========================================

    ticket_medio = faturamento / quantidade_vendas


    # ==========================================
    # VENDAS AGRUPADAS POR PRODUTO
    # ==========================================

    vendas_por_produto = (
        df.groupby("produto")["quantidade"].sum()
    )


    # ==========================================
    # PRODUTO MAIS VENDIDO
    # ==========================================

    produto_mais_vendido = vendas_por_produto.idxmax()


    # ==========================================
    # QUANTIDADE DO PRODUTO MAIS VENDIDO
    # ==========================================

    quantidade_produto_mais_vendido = (
        vendas_por_produto.max()
    )


    # ==========================================
    # CONVERTER DATA
    # ==========================================

    df["data"] = pd.to_datetime(df["data"])


    # ==========================================
    # VENDAS POR DIA
    # ==========================================

    vendas_por_dia = (
        df.groupby(
            df["data"].dt.strftime("%d/%m/%Y")
        )["quantidade"]
        .sum()
        .reset_index()
    )


    # Renomear as colunas
    vendas_por_dia.columns = [
        "data",
        "quantidade"
    ]


    # ==========================================
    # RETORNO DOS INDICADORES
    # ==========================================

    return {

        "faturamento": float(faturamento),

        "custo_total": float(custo_total),

        "lucro": float(lucro),

        "quantidade_vendas": int(quantidade_vendas),

        "quantidade_produtos": int(quantidade_produtos),

        "ticket_medio": float(ticket_medio),

        "produto_mais_vendido": str(
            produto_mais_vendido
        ),

        "quantidade_produto_mais_vendido": int(
            quantidade_produto_mais_vendido
        ),

        "vendas_por_dia": vendas_por_dia.to_dict(
            orient="records"
        )
    }


# ==========================================
# TESTE DO ARQUIVO
# ==========================================

if __name__ == '__main__':

    vendas = carregar_vendas()

    indicadores = calcular_indicadores(vendas)

    print(indicadores)