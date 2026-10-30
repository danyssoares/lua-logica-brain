# Linguagem e tom de voz

> v2 — atualizado em 2026-09-15 a partir de `analise-tom-de-voz-lua-logica.md`,
> uma análise de conversas reais do ChatGPT onde a Dany escreveu/revisou
> conteúdo próprio. Isso **supersede** a v1 (que vinha só de descrição verbal
> em conversa) — mantive o espírito da v1 ("tapinha na cara") porque não
> contradiz a análise nova, só é mais bruto/direto do que a voz real dela,
> que é mais literária/ensaística do que confrontadora linha a linha.

## Dois modos de voz — não é a mesma escrita

Reels/Carrossel e Substack **não são o mesmo texto encurtado ou esticado**.
São modos de escrever diferentes, com objetivo diferente. A própria Dany
descreve isso no trecho de referência abaixo: "sentar pra escrever um texto
é diferente de sentar pra escrever um roteiro de vídeo ou de carrossel, que
precisa de uma narrativa e tempos certos."

### Reels / Carrossel — ritmado, pensado pra tempo de tela

- **Ritmo em linha quebrada**: frases curtas, uma por linha/slide,
  intercaladas com um período mais longo de vez em quando. Cadência de
  respiração, não de parágrafo denso.
- **Pergunta retórica como conector** ("não acha?", "será que...", "a que
  custo?") — puxa o leitor pra dentro do raciocínio. Não é decoração
  ocasional, é ferramenta de ritmo.
- **Abre com cena concreta, não com conceito**: uma memória, um momento do
  dia, um objeto — só depois generaliza pro "a gente"/"você". Evitar abrir
  direto no conceito abstrato ("Todo mundo sente que...").
- **Astrologia como tempero, não como laudo**: UMA citação de trânsito/
  posição por texto, amarrada direto ao ponto. Nunca lista Sol+Lua+
  Ascendente+Casas em sequência técnica.
- **Coloquialismos genuínos**: "né?", "confesso que", "vamos por partes",
  "então" — mantém o texto falado, não escrito formalmente.
- **Fecha com pergunta íntima ao leitor**, não com CTA de marca genérico.
  ⚠️ **Ponto em aberto**: isso tensiona com o mecanismo de CTA que já
  construímos (botão "Manda [palavra-chave]" pra gerar DM) — meu palpite é
  que dá pra fazer as duas coisas juntas (a pergunta íntima *é* o convite,
  o botão só facilita a ação), mas quero confirmar com você antes de mudar
  os CTAs que já aprovamos.

**Regras de formato (carrossel), já implementadas no pipeline:**
- Sem numeração de slide ("01/07" etc.)
- Sem etiqueta de tema no slide (nada de "A VIRADA", "A SOMBRA" como label)
  — o texto carrega o sentido sozinho
- Paleta Mystic Tech com papel por momento do slide (ver seção própria
  abaixo — isso é uma atualização em relação ao que estava em uso)

### Substack — contínuo, fluido, ensaístico

- Prosa contínua, **sem subtítulos/headers fragmentando** — o fluxo é em
  parágrafos e linhas curtas, não em seções.
- Abre com cena concreta pessoal (o café, a pasta de poesias, o blog do
  casamento) — primeira pessoa, específico, sensorial.
- Generaliza pro leitor só depois de estabelecer a cena — nunca abre já no
  "a gente".
- Ritmo de frase curta + frase longa, mas fluindo em parágrafo — não em
  linha quebrada tipo carrossel.
- Qualidade de "sentar pra escrever só por escrever" — reflexivo, sem
  pressa, sem a narrativa cronometrada de vídeo/carrossel.

## O que evitar (confirmado pelos rascunhos reais dela) — vale pros dois modos

- Jargão técnico de qualquer área (TI, marketing, corporativo) — nunca
  aparece no que ela escreve de fato.
- Repetição do mesmo ponto reformulado — ela mesma flagra isso como
  "pedante" nos próprios rascunhos. Um ponto, uma vez, bem dito.
- Abertura genérica tipo "Todo mundo diz que..." / "Você já se pegou
  pensando..." — comece já na cena concreta ou já confrontando.
- Frases-clichê do nicho de cura/autoconhecimento ("você não está quebrada,
  você está...") — reconhecíveis como template.
- Listar posições astrológicas como diagnóstico técnico.
- Explicar o trânsito/símbolo de forma didática demais, tipo legenda de
  infográfico, em vez de falar direto com a pessoa.

## O olhar (camada emocional por trás do texto, v1 — ainda vale)

Terapêutico, mas com "um tapinha na cara pra acordar". Não é só acolhimento
passivo — é confronto amoroso: acolhe a dor, mas não fica nela. Público:
mulheres em processo de despertar, que já sentem que tem algo pra destravar
e precisam de um empurrão, não só de validação. Na prática (v2), esse
"tapinha" se expressa mais como pergunta retórica que confronta um padrão
específico do que como frase-chicote direta — mais afiado e literário do
que bruto.

## Paleta "Mystic Tech" — papel por momento do slide

> Atualização em relação ao que está em uso hoje (`brand/tokens.json` só
> tinha um roxo escuro só, `purpleDeep #450e5d`, usado em tudo). Adicionei
> `purpleDarkest #2E0940` ao tokens.json — **ainda não apliquei nos
> componentes**, quero confirmar o mapeamento abaixo com você antes de
> re-renderizar o que já foi aprovado:

| Cor | Hex | Papel |
|---|---|---|
| Roxo escuríssimo | `#2E0940` (`purpleDarkest`) | Abertura/fechamento (capa, cta) |
| Roxo médio | `#450E5D` (`purpleDeep` — nome já existente) | Reflexão/virada (slides do meio) |
| Creme | `#F2E8E4` (`cosmicCream`) | Respiro/luz |
| Dourado | `#C6A156` (`gold`) | Destaque principal |

## Trecho de referência (Substack, tom-alvo, escrito por ela)

> Peguei um café e sentei para escrever...
> Já tinha um tempo que não fazia isso com tanto gosto.
> Sentar para escrever um texto é diferente de sentar para escrever um
> roteiro de vídeo ou de carrossel, que precisa de uma narrativa e tempos
> certos.
> Na escrita só por escrever, a gente deixa o pensamento vir e colocamos
> ele no papel (ou no Bloco de Notas), quase que num flow. Eu acho
> delicioso.

## Pessoa gramatical
- Regra de quando usar "ela" (3ª pessoa) vs "você" (2ª pessoa) — [detalhar contexto de cada uma]

## Identidade
- Tagline: [preencher]
- Nome de exibição no Instagram: [preencher]

## Palavras/expressões preferidas
- "né?", "confesso que", "vamos por partes", "então" (coloquialismos genuínos, ver acima)
- [continuar a lista conforme revisarmos mais conteúdo real]

## Palavras/expressões a evitar
- "Você não está quebrada, você está..." (clichê do nicho)
- Jargão técnico de qualquer área
- [continuar a lista conforme aparecer]
