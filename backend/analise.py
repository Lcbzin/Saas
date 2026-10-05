from pathlib import Path

import pandas as pd

# Caminho absoluto: funciona de qualquer pasta
RAIZ = Path(__file__).resolve().parent.parent
ARQUIVO_VENDAS = RAIZ / "data" / "vendas.csv"


def carregar_vendas():
    return pd.read_csv(ARQUIVO_VENDAS)


def filtrar_por_periodo(df, inicio=None, fim=None):
    """Mantém só as vendas entre 'inicio' e 'fim' (ambos inclusos).
    Se inicio ou fim for None, aquele lado fica sem limite."""
    if df.empty:
        return df

    datas = pd.to_datetime(df["data"])
    mascara = pd.Series(True, index=df.index)

    if inicio is not None:
        mascara &= datas >= pd.Timestamp(inicio)

    if fim is not None:
        mascara &= datas <= pd.Timestamp(fim)

    return df[mascara].copy()


def calcular_indicadores(df):
    # Sem dados: retorna tudo zerado (evita divisão por zero)
    if df.empty:
        return {
            "faturamento": 0.0,
            "custo_total": 0.0,
            "lucro": 0.0,
            "quantidade_vendas": 0,
            "quantidade_produtos": 0,
            "ticket_medio": 0.0,
            "produto_mais_vendido": "-",
            "quantidade_produto_mais_vendido": 0,
        }

    faturamento = (df["quantidade"] * df["preco_unitario"]).sum()
    custo_total = (df["quantidade"] * df["custo_unitario"]).sum()
    lucro = faturamento - custo_total

    quantidade_vendas = len(df)
    quantidade_produtos = df["quantidade"].sum()
    ticket_medio = faturamento / quantidade_vendas

    vendas_por_produto = df.groupby("produto")["quantidade"].sum()
    produto_mais_vendido = vendas_por_produto.idxmax()
    quantidade_produto_mais_vendido = vendas_por_produto.max()

    return {
        "faturamento": float(faturamento),
        "custo_total": float(custo_total),
        "lucro": float(lucro),
        "quantidade_vendas": int(quantidade_vendas),
        "quantidade_produtos": int(quantidade_produtos),
        "ticket_medio": float(ticket_medio),
        "produto_mais_vendido": str(produto_mais_vendido),
        "quantidade_produto_mais_vendido": int(quantidade_produto_mais_vendido),
    }


if __name__ == "__main__":
    print(calcular_indicadores(carregar_vendas()))
