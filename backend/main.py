from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from backend.analise import carregar_vendas, calcular_indicadores


app = FastAPI(title="LZ Analytics")


# ==========================================
# CONFIGURAÇÃO DO CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==========================================
# ROTA PRINCIPAL
# ==========================================

@app.get("/")
def inicio():
    return {
        "message": "Bem-vindo à API de Análise de Vendas!"
    }


# ==========================================
# INDICADORES
# ==========================================

@app.get("/vendas/indicadores")
def indicadores_vendas():

    vendas = carregar_vendas()

    indicadores = calcular_indicadores(vendas)

    return indicadores


# ==========================================
# VENDAS
# ==========================================


@app.get("/vendas")
def listar_vendas():

    vendas = carregar_vendas()

    return vendas.to_dict(orient="records")


# ==========================================
# FATURAMENTO POR DIA
# ==========================================

@app.get("/vendas/faturamento-por-dia")
def faturamento_por_dia():

    vendas = carregar_vendas()

    vendas["data"] = pd.to_datetime(vendas["data"])

    vendas["faturamento"] = (
        vendas["quantidade"] *
        vendas["preco_unitario"]
    )

    faturamento_por_dia = (
        vendas
        .groupby(vendas["data"].dt.date)["faturamento"]
        .sum()
        .reset_index()
    )

    faturamento_por_dia["data"] = (
        faturamento_por_dia["data"]
        .apply(lambda data: data.strftime("%d/%m/%Y"))
    )

    return faturamento_por_dia.to_dict(
        orient="records"
    )