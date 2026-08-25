---
name: eclipse-express
description: >-
  Gera a "Leitura Express de Eclipse", uma análise curta de como um eclipse específico
  reverbera no mapa natal de uma consulente pelos próximos ~6 meses. Use quando o usuário
  fornecer os dados do mapa natal de uma consulente mais o grau/signo de um eclipse e pedir
  para analisar o impacto, ou quando fornecer também dados de trânsito para cruzar com o
  natal. Gera dois outputs, um roteiro de áudio (linguagem simples, sem jargão, para a Dany
  ler/gravar) e um PDF de uma página para entregar à consulente. Não usar para leituras
  completas de mapa natal ou sinastria, só para a leitura pontual de eclipse.
---

# Leitura Express de Eclipse

Esta skill gera a "Leitura Express de Eclipse" — um produto pontual e enxuto (não é consultoria longa) que responde a uma pergunta específica: **como este eclipse ativa o mapa desta pessoa, e como isso deve se desdobrar nos próximos ~6 meses.**

O processo tem duas fases nítidas, com dados diferentes em cada uma. Não pule etapa nem misture as fases.

---

## Regra de ouro

> 🌟 **A consulente entende o que está sendo olhado, mas sente o significado — não decora astrologuês.**

Pode (e deve, com moderação) nomear o **signo do eclipse**, a **casa natal** ativada, e o **regente**/planeta envolvido — isso ajuda a consulente a acompanhar "o que exatamente está sendo olhado ali dentro" e dá credibilidade técnica à leitura. O que NÃO deve aparecer: grau exato, orbe, nome técnico de aspecto (ex: "quadratura", "trígono") a menos que numa frase muito simples ("esse ponto encosta bem perto de...").

**Como fazer isso bem:** sempre que citar um termo técnico, ele vem *ancorado* na tradução prática na mesma frase ou logo em seguida — nunca solto, nunca como se a consulente devesse já saber o que aquilo significa.

❌ Errado (jargão solto): "O eclipse está na sua Casa 4 em quadratura com Vênus, orbe de 3°42'."
❌ Errado (jargão sem tradução nenhuma): "Esse eclipse ativa sua Casa 4."
✅ Certo (nomeado + traduzido, natural): "Esse eclipse aconteceu no signo de Leão, e caiu bem na sua Casa 4 — a casa do lar, da família, das raízes." / "O regente desse eclipse é o Sol, e no seu mapa ele mora em Sagitário, na sua Casa 7, a casa das parcerias — é esse o seu fio condutor."

Continua valendo: nunca aparecer grau exato, orbe numérico, ou nome técnico de aspecto cru (conjunção/quadratura/trígono/oposição) sem uma tradução imediata e simples.

---

## FASE 1 — Apenas o mapa natal (diagnóstico do terreno)

**Input que o usuário vai fornecer nesta fase:**
1. Dados do mapa natal da consulente (signo/casa/grau de todos os planetas, Ascendente, Meio do Céu — formato similar ao `input-examples/mapa_exemplo.json`).
2. O **grau exato** e o **signo** onde o eclipse aconteceu (ex: "15°15' de Leão").

**O que fazer com esses dados (nesta ordem):**

1. **Casa natal ativada** — em que casa do mapa dela cai esse grau do eclipse. Essa é a área de vida principal do tema.
2. **Conjunções/oposições exatas** — o grau do eclipse toca algum planeta, o Ascendente ou o Meio do Céu natal dela? Orbe até 3° = hit forte (mencionar com destaque); orbe até 5-8° = ativação mais sutil (mencionar como pano de fundo, sem forçar).
3. **Regente do signo do eclipse** — onde está esse planeta regente no mapa dela (signo + casa). Isso é o "fio condutor" da história.
4. **Casa regida pelo signo do eclipse** (se o sistema de casas dela permitir identificar isso claramente) — segunda camada de área de vida ativada.

Ainda **não fale do eclipse como evento no tempo** nesta fase — é só leitura de estrutura natal. Se faltar algum dado (ex: usuário não mandou grau exato do eclipse, ou mapa incompleto), pergunte antes de seguir.

---

## FASE 2 — Natal + trânsito atual (a história ganha tempo)

**Input adicional que o usuário vai fornecer nesta fase:**
3. Um **retrato simples do céu atual** (trânsito do dia, não uma janela de 6 meses inteira): posição atual (signo + grau) de Sol, Lua, Mercúrio, Vênus, Marte, Júpiter e, se relevante, Saturno. Não precisa de todos os planetas lentos nem de tabela completa de aspectos — é uma foto rápida do céu de agora.

**O que fazer (mantendo simples, sem aprofundar demais — isso é leitura express, não consultoria completa):**

5. Verificar se algum planeta em trânsito **agora** está no mesmo grau/signo do eclipse (conjunção) ou tocando algum dos pontos natais identificados na Fase 1 (Casa ativada, hit no Asc/MC, regente). Orbe simples de até 5° já é suficiente pra mencionar — não precisa de rigor de orbe fino aqui.
6. Se houver um planeta relevante fazendo essa conjunção/ativação agora (ex: Júpiter no mesmo signo do eclipse, mesmo que grau diferente), isso vira o "sinal de abertura" do tema — algo que já está em movimento, não uma previsão futura. Comunicar como "esse tema já está em movimento agora, e [planeta] traz [tom/qualidade] pra esse início" — sem nomear o planeta cru no texto de entrega, traduzir pra qualidade/sensação.
7. Não é necessário calcular retornos futuros de Sol/Marte ao grau exato do eclipse (isso raramente cai dentro de 6 meses e exige ephemeris precisa). Se o usuário quiser essa camada extra, pode pedir explicitamente, mas o padrão da Fase 2 é o retrato do céu de agora.

**Não incluir:** trânsito completo de todos os planetas lentos, tabela de aspectos exaustiva, retrogradações do período. Isso é leitura express, não consultoria completa — o objetivo é 1-2 frases de "o que já está se mexendo agora", não uma segunda leitura de trânsito inteira.

Se a Fase 2 ainda não tiver sido fornecida e o usuário pedir a leitura completa, gere a Fase 1 e avise que falta o retrato do céu atual para fechar a Fase 2 — não invente posições planetárias; se o usuário topar, pode-se buscar essa informação atual (ex: via busca na web) em vez de pedir para ele fornecer o JSON.

---

## Outputs obrigatórios (gerar sempre os dois, juntos)

### 1. Roteiro de áudio (dividido em 2 partes, ~4-5 min cada — não 3-5 min corridos)

- Texto corrido, tom "Poético Técnico" da Lua Lógica: caloroso, direto, com uma pitada de mistério, mas sempre ancorado em algo prático e sentido pela pessoa.
- **Parte 1** (~4-5 min) cobre o que já sai da Fase 1 e não depende do céu atual: abertura + onde ativa + o que toca de mais pessoal + fio condutor. Cada bloco merece 2-3 parágrafos de desenvolvimento (não só uma frase resumo) — trazer exemplos concretos de como o tema pode aparecer no dia a dia, não só nomear a área de vida.
- **Parte 2** (~4-5 min) cobre o que sai da Fase 2 (o que já está em movimento no céu de agora) + uma reflexão de fechamento mais desenvolvida + o recado-síntese da leitura + CTA. Pode ser gravada/entregue depois, quando a Fase 2 estiver pronta.
- Estrutura sugerida dentro de cada parte (sem precisar rotular as seções em voz alta):
  - Parte 1: abertura curta situando o eclipse → onde ele ativa (desenvolvido, com cenários concretos) → o que ele toca de mais pessoal (desenvolvido) → o fio condutor (desenvolvido, com orientação prática de como usar esse recurso).
  - Parte 2: o que já está em movimento agora (desenvolvido) → uma reflexão de síntese ligando os pontos da Parte 1 → fechamento com um convite/CTA suave.
- Cada parte deve render entre 550-750 palavras (ritmo de leitura ~150 palavras/minuto) para ficar nos 4-5 minutos. Evitar textos curtos e telegráficos — o objetivo agora é aprofundar e ficar condizente com o nível de detalhe do PDF, não só resumir em uma frase por bloco.
- Marcar no topo de cada parte, entre colchetes e fora do texto de leitura, a duração estimada e o nome da consulente — isso é nota de produção, não vai no áudio.

### 2. PDF de uma página (para entregar à consulente)

- Visual Mystic Tech: roxo `#450E5D`, dourado `#C6A156`, creme `#F2E8E4`; tipografia Cormorant Garamond (títulos) + Mulish (corpo) — usar `templates/gerar_pdf.py` como base e adaptar o conteúdo.
- Estrutura enxuta em blocos curtos, todos em linguagem simples:
  - Título: nome da consulente + tema do eclipse (ex: "Eclipse em Leão: o que ele desperta em você")
  - Bloco 1 — Onde ativa
  - Bloco 2 — O que toca
  - Bloco 3 — Fio condutor / como atravessar
  - Bloco 4 — O que já está em movimento agora (o sinal de abertura do céu atual, se a Fase 2 tiver sido feita — em linguagem de sensação/qualidade, não de planeta/grau)
  - Bloco 5 — O que perceber nos próximos meses (sinais concretos e reconhecíveis no dia a dia — não datas nem meses específicos — ligados ao tema identificado na Fase 1, + um indicador de "como saber que está evoluindo bem" dentro desse tema)
  - Rodapé com frase-convite ou CTA suave e a marca Lua Lógica

Depois de gerar o texto do PDF e ele ser aprovado, rodar `templates/gerar_pdf.py` (adaptando os textos-variáveis no topo do script) para produzir o arquivo final, e entregar via `present_files`.

---

## Checklist final antes de entregar

- [ ] Signo do eclipse, casa ativada e regente aparecem nomeados, mas sempre ancorados numa tradução simples na mesma frase (nunca soltos como jargão puro)
- [ ] Grau exato, orbe numérico e nomes técnicos de aspecto (conjunção/quadratura/trígono/oposição) não aparecem crus — no máximo uma menção muito simples tipo "esse ponto encosta bem perto de..."
- [ ] Fase 1 e Fase 2 foram cumpridas na ordem certa, sem pular dados
- [ ] Não foi feito trânsito completo genérico — só o necessário para o eclipse
- [ ] Roteiro de áudio tem 3-5 min de leitura e tom Poético Técnico
- [ ] PDF cabe em 1 página, com a identidade visual Mystic Tech
- [ ] O "sinal de abertura" da Fase 2 está em linguagem de sensação/qualidade, nunca citando o planeta cru ou o grau
- [ ] Não foi prometida uma data futura específica sem dado real de trânsito calculado (a Fase 2 padrão é sobre o céu de agora, não uma previsão de mês)
