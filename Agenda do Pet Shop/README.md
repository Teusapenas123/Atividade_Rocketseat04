# Agenda do Pet Shop

Site responsivo para gerenciar os agendamentos de um pet shop: ver a agenda por data, criar novos atendimentos e remover os existentes.

## Funcionalidades

- Agenda agrupada em Manhã (09h às 12h), Tarde (13h às 18h) e Noite (19h às 21h), ordenada por horário
- Troca de data no topo para ver os atendimentos daquele dia
- Modal "Agende um atendimento" com fundo bloqueado e foco inicial no primeiro campo
- Validação por campo: tudo obrigatório, telefone válido, horário dentro das faixas e sem conflito na mesma data e hora
- Remoção imediata de agendamentos
- Os dados ficam salvos no navegador (`localStorage`)

## Como rodar

1. Baixe ou clone o repositório e mantenha `index.html`, `style.css` e `script.js` **na mesma pasta**.
2. Abra o `index.html` no navegador ou use a extensão **Live Server** do VS Code.

Não há dependências nem etapa de build.

## Como visualizar online (GitHub Pages)

1. No GitHub, vá em **Settings → Pages**.
2. Em *Build and deployment*, escolha **Deploy from a branch**, selecione `main` e a pasta `/ (root)`.
3. Salve e aguarde o link ser gerado.

## Ajustar os horários

As faixas de atendimento ficam no array `PERIODOS`, no início do `script.js`.

## Tecnologias

HTML, CSS e JavaScript puro.
