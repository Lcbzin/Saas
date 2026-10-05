# LZ Analytics

SaaS de dashboards de vendas e financeiro.

## Tecnologias

- Python, FastAPI, Pandas
- PostgreSQL (planejado)
- JavaScript, HTML, CSS

## Objetivo

Transformar dados de vendas e financeiros em dashboards
gerenciais simples e fáceis de entender.

## Como rodar

Terminal 1 (na raiz do projeto):

    python -m venv .venv            # só na primeira vez
    .venv\Scripts\activate          # Windows (Mac/Linux: source .venv/bin/activate)
    pip install -r requirements.txt # só na primeira vez
    uvicorn backend.main:app --reload

Terminal 2:

    cd frontend
    python -m http.server 5500

Acesse http://localhost:5500/index.html
Documentação da API: http://127.0.0.1:8000/docs
