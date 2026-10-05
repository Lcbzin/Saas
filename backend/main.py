from datetime import date
from typing import Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.analise import (
    calcular_indicadores,
    carregar_vendas,
    filtrar_por_periodo,
)

app = FastAPI(title="LZ Analytics")

# CORS: em produção, troque pelas origens reais do seu site
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def obter_vendas():
    try:
        return carregar_vendas()
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Arquivo de dados (data/vendas.csv) não encontrado.",
        )


def obter_vendas_filtradas(inicio: Optional[date], fim: Optional[date]):
    if inicio and fim and inicio > fim:
        raise HTTPException(
            status_code=400,
            detail="A data inicial não pode ser maior que a data final.",
        )
    return filtrar_por_periodo(obter_vendas(), inicio, fim)


@app.get("/")
def inicio():
    return {"message": "Bem-vindo à API de Análise de Vendas!"}


@app.get("/saude")
def saude():
    return {"status": "ok"}


@app.get("/vendas/indicadores")
def indicadores_vendas(
    inicio: Optional[date] = None,
    fim: Optional[date] = None,
):
    return calcular_indicadores(obter_vendas_filtradas(inicio, fim))


@app.get("/vendas")
def listar_vendas():
    return obter_vendas().to_dict(orient="records")


@app.get("/vendas/faturamento-por-dia")
def faturamento_por_dia(
    inicio: Optional[date] = None,
    fim: Optional[date] = None,
):
    vendas = obter_vendas_filtradas(inicio, fim)

    if vendas.empty:
        return []

    vendas["data"] = pd.to_datetime(vendas["data"])
    vendas["faturamento"] = vendas["quantidade"] * vendas["preco_unitario"]

    resultado = (
        vendas.groupby(vendas["data"].dt.date)["faturamento"]
        .sum()
        .reset_index()
    )

    resultado["data"] = resultado["data"].apply(
        lambda d: d.strftime("%d/%m/%Y")
    )

    return resultado.to_dict(orient="records")
