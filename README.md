# PETS Portal — Monitorização do Plano de Emergência e Transformação da Saúde

[![Deploy to Firebase](https://github.com/dpolonia/petspt/actions/workflows/deploy.yml/badge.svg)](https://github.com/dpolonia/petspt/actions/workflows/deploy.yml)

Portal público de monitorização em tempo real da execução do [Plano de Emergência e Transformação da Saúde (PETS)](https://www.sns.gov.pt/plano-de-emergencia/) do Governo de Portugal.

Live: [petspt.web.app](https://petspt.web.app)

## Fontes de Dados

- [Transparência SNS](https://transparencia.sns.gov.pt/) — API pública ODS v2.1
- [dados.gov.pt](https://dados.gov.pt/) — API autenticada

## Eixos Estratégicos Monitorizados

1. **Resposta a Tempo e Horas** — Listas de espera cirúrgicas e consultas
2. **Bebés e Mães em Segurança** — Saúde materno-infantil
3. **Cuidados Urgentes e Emergentes** — Urgências e emergência médica
4. **Saúde Próxima e Familiar** — Cuidados de saúde primários
5. **Saúde Mental** — Serviços de saúde mental

## Setup Local

```bash
git clone https://github.com/dpolonia/petspt.git
cd petspt
cp .env.example .env    # preencher com chaves reais
npm install
npm run dev             # http://localhost:5173
```

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Recharts · Firebase Hosting · Cloud Functions · Firestore

## Licença

MIT — ver [LICENSE](LICENSE)
