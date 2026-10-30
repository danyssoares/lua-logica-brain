# Lua Lógica Studio

Pipeline de produção de Reels e carrosséis: **pauta (Supabase) → imagem
(Replicate) → composição (Remotion) → aprovação (dia anterior, via
Telegram)**.

Este projeto vive dentro do `lua-logica-brain` (repositório público), mas o
código aqui não deve nunca commitar credenciais — `.env` está no
`.gitignore`. Veja `.env.example`.

## Estrutura

```
studio/
  src/
    Root.tsx              — registra as composições Remotion
    lib/
      tokens.ts            — lê brand/tokens.json (cores + fontes)
      fonts.ts              — carrega as fontes reais via @remotion/fonts
      types.ts               — tipos compartilhados (TextSlideData, ReelData, ...)
    components/             — os 3 componentes-base + assinatura da marca
      TextSlide.tsx           — variantes "stagger" e "frase-unica"
      BackgroundEffect.tsx    — Ken Burns + overlay
      ArchetypeCard.tsx       — arquétipo/trânsito + reflexão
      BrandMark.tsx           — ícone + @lualogica, sempre presente (ver abaixo)
    compositions/
      Reel.tsx                — 1080x1920, slides com crossfade
      CarrosselSlide.tsx      — 1 slide = 1 clipe curto animado (~2.7s), proporção
                                 dinâmica (4:5/1:1/9:16) via calculateMetadata
    pipeline/                — scripts Node (não fazem parte do bundle Remotion)
      config.ts, supabase.ts, replicate.ts, promptBuilder.ts,
      toSlideData.ts, render.ts, runDay.ts
  prompts/
    master-image-prompt.md   — PREENCHER: prompt mestre de geração de imagem
  manual/
    exemplo-dia.json         — exemplo de pauta escrita à mão (ver "Modo manual")
  producao/                  — output gerado (gitignored)
  public/
    fonts -> ../../brand/fonts   (symlink; fonte real fica em brand/)
    logo -> ../../brand/logo     (symlink; logo real fica em brand/)
```

## Assinatura da marca (ícone + @lualogica)

Todo slide (carrossel ou reel) sempre carrega a marca, em dois layouts
possíveis — decidido automaticamente pelo `variant` do texto:

- **slides "frase única"** (capa, cta): ícone centralizado, acima do kicker
  — igual ao formato que você já usa no Canva. `@lualogica` discreto embaixo,
  centralizado.
- **slides "stagger"** (diagnóstico, resolução, insight, arquétipo): ícone
  pequeno no canto superior esquerdo (não disputa espaço com o texto, que
  fica ancorado embaixo) + `@lualogica` discreto no canto inferior esquerdo.

O ícone tem duas variantes de cor (`brand/logo/icone-transparente-fundo-*.png`,
fundo transparente, geradas a partir do `Lua Lógica brand kit.pdf`) —
`BrandWatermark`/`TextSlide` escolhem automaticamente pela `theme` do slide
(`dark` → ícone creme/dourado; `light` → ícone dourado/roxo).

## Setup

```bash
cd studio
npm install
cp .env.example .env   # preencher SUPABASE_* e REPLICATE_*
```

## Ver as composições no Remotion Studio

```bash
npm run dev
```

## Regra fixa: formato e proporção nunca são adivinhados

Cada peça tem **5 formatos possíveis**: `post-estatico`, `carrossel-estatico`,
`carrossel-animado`, `reel`, `gravado` (capa de vídeo que você grava por
conta própria). Proporção: `4:5` | `1:1` | `9:16`.

Todo item da pauta (venha do Supabase ou de um JSON manual) **precisa**
trazer os dois. No pipeline (`runDay.ts`), se um dos dois estiver faltando,
o item é **pulado** — avisa no log e não gera nada pra ele, em vez de
assumir um padrão.

**Quando é EU quem estou gerando conteúdo com você aqui no chat** (não
rodando o script direto), a regra é mais forte ainda: se você não me disse
o formato e a proporção, eu **paro o fluxo e pergunto** antes de fazer
qualquer rascunho ou gerar qualquer imagem — não presumo.

## Regra fixa: sem título/kicker nos slides por padrão

Slides levam só o texto do slide. Nada de rótulo tipo "O que está
acontecendo" ou "Arquétipo do momento" inventado por mim como scaffolding —
isso só aparece se **você disser que a peça faz parte de uma série
nomeada** (ex: "Seu mapa explica", "O céu de hoje") — aí o nome da série
vira o kicker da capa. Sem essa instrução, `item.pilar` fica vazio e nenhum
slide leva título.

## Regra fixa: prévia de texto + imagens antes de qualquer render final

Antes de gerar a peça de verdade (o que gasta Replicate), eu **sempre**
mostro pra você, aqui no chat:
- o texto final de cada slide (já passado pela lente de tom de voz, ver
  `conteudo/linguagem.md`)
- a sugestão de imagem de cada slide/fundo (a cena que eu escrevi, não só
  "vai gerar uma imagem")

Só depois da sua aprovação eu rodo o comando de render de verdade. Isso
vale pra carrossel, reel e post estático — a imagem de fundo do reel e do
post estático também passam por essa prévia, não só os slides do meio do
carrossel.

## Como iniciar um conteúdo novo

Digite **"Iniciar"** e eu pergunto o que falta pra começar:
1. Tema central OU o texto/script já pronto (se já tiver)
2. Formato (`post-estatico` / `carrossel-estatico` / `carrossel-animado` /
   `reel` / `gravado`)
3. Proporção (`4:5` / `1:1` / `9:16`)
4. Faz parte de uma série nomeada? (define se leva kicker ou não)

Daí sigo os passos abaixo: rascunho (texto + sugestão de imagem, sem gastar
Replicate) → sua aprovação → render final.

## Duas etapas: rascunho (só texto) → final (texto + imagem)

1. **Você me dá o tema/texto** (aqui no chat, ou um JSON com só
   `tema`/`formato`/`proporcao`). Eu escrevo/reescrevo — hook, insights, cta
   e uma sugestão de cena por imagem — aplicando o tom de voz
   (`conteudo/linguagem.md`: terapêutico, mas com "tapinha na cara pra
   acordar" — confronta um padrão específico, não só valida) e te mostro
   pra revisão, **sem gerar nada no Replicate ainda**. Isso não é um comando
   de pipeline: sou eu mesma escrevendo, porque não tem um LLM plugado no
   código.
2. **Você aprova/ajusta o rascunho** — eu salvo o resultado final num JSON
   em `manual/` (mesmo formato de `manual/exemplo-dia.json`, com o campo
   `imagens: string[]` preenchido — uma direção de cena por slide do meio,
   índice alinhado com `insights`).
3. **Rodo o comando abaixo** — aí sim gera as imagens de verdade no
   Replicate e o(s) clipe(s)/imagem(ns) final(is):

```bash
npx tsx src/pipeline/runDay.ts --file=manual/<arquivo-aprovado>.json
```

Se o JSON já tiver os textos completos (hook/insights/cta) mas SEM o campo
`imagens`, o pipeline gera a imagem mesmo assim — só usa uma cena genérica
derivada do tema (`pipeline/promptBuilder.ts#defaultSceneFor`) em vez da sua
direção específica por slide. Prefira sempre passar por mim primeiro (etapa
1) pra essa cena não sair genérica.

## Três formas de rodar

### 1. Automático, pela tabela do Supabase (o modo "de produção")

```bash
npm run pauta:dia -- --date=2026-08-27
```

Busca a pauta desse dia na tabela do Supabase, gera imagem no Replicate e
renderiza. Esse é o modo que deve rodar sozinho todo dia, uma vez que tudo
estiver validado.

### 2. Manual — você dá o conteúdo direto (o modo "fechando o design")

```bash
npm run pauta:manual
# ou, com seu próprio arquivo:
npx tsx src/pipeline/runDay.ts --file=caminho/para/seu-arquivo.json
```

Lê um JSON local (mesmo formato de `manual/exemplo-dia.json` — um array de
itens com `tema`, `formato`, `hook`, `insights`, `cta`, etc, ver
`pipeline/types.ts`) em vez de consultar o Supabase. É o jeito de você (ou eu,
a seu pedido) escrever o conteúdo de um dia específico à mão — sem tocar na
tabela — pra revisar o resultado visual antes de deixar tudo automático.

Some `--sem-imagem` pra pular a chamada ao Replicate e testar só o layout
(fica com fundo de cor sólida, como no estilo atual do Canva):

```bash
npx tsx src/pipeline/runDay.ts --file=manual/exemplo-dia.json --sem-imagem
```

### 3. Fixture — testar o Remotion sem nenhuma credencial

```bash
npm run pauta:dia -- --date=2026-08-27 --fixture
```

Usa 2 itens de exemplo fixos no código e pula Supabase/Replicate por
completo — só para validar que a composição/fontes/marca estão renderizando
certo. **Já rodei isso ao montar o projeto** — dá pra abrir
`producao/2026-08-27/` pra ver o resultado.

## Layout dos slides de carrossel

- **capa / cta / post estático**: variant "frase-unica", só tipografia +
  ícone centralizado + `goldGlow: true` (brilho dourado decorativo no canto
  superior direito, igual à referência `referencias/canva-post.png`). Sem
  imagem — é o estilo que você já validou.
- **diagnóstico / resolução**: variant "stagger", com `topImage` — imagem
  gerada pelo Replicate só na faixa superior do slide (~49% da altura), com
  fade suave pra cor sólida embaixo, onde o texto fica ancorado. Ícone da
  marca fica no canto superior esquerdo, sobre a imagem (com sombra sutil
  pra continuar legível em qualquer foto). No `carrossel-animado`, o Ken
  Burns da imagem roda de verdade por trás do texto entrando.
- **arquétipo**: `ArchetypeCard`, sem imagem.

Isso é o `pipeline/toSlideData.ts` — 1 imagem gerada por insight (2 imagens
pra um carrossel com 2 insights), a capa/cta/post estático não geram
imagem. Nenhum slide leva kicker/título por padrão (ver regra acima).

Só `carrossel-animado` sai em clipe (~2.7s: entrada escalonada + hold pra
leitura); `carrossel-estatico` e `post-estatico` saem em PNG, capturado no
frame já assentado da animação de entrada (mesma composição, sem
movimento).

## Servidor de assets interno (por quê existe)

`pipeline/assetServer.ts` sobe um servidor HTTP local (`ensureAssetServer`)
que serve qualquer arquivo dentro de `lua-logica-brain/` sob demanda —
usado pra servir as imagens que o Replicate acabou de gerar (salvas em
`producao/<data>/.../imagem-N.png`) pro Remotion durante o render.

Isso existe por causa de um comportamento do próprio Remotion: o servidor
interno dele (usado por `renderStill`/`renderMedia`) só enxerga os arquivos
que já existiam em `public/` no momento em que preparou o bundle — um
arquivo criado DEPOIS disso (como uma imagem baixada do Replicate segundos
antes do render) dá 404 nele mesmo estando fisicamente no disco. Confirmei
isso servindo a mesma pasta com um servidor HTTP genérico, que funcionou
sem problema — daí a solução: qualquer imagem dinâmica passa por
`toAssetUrl()` antes de virar `imageSrc`, em vez de depender do `public/`
estático (que continua existindo, só que só pra fontes/logo — conteúdo que
não muda a cada render).

---

Em qualquer um dos 3 modos, o resultado sai em `producao/<data>/<slug-do-tema>/`:
- **carrossel-animado**: `slide-1-capa.mp4`, `slide-2-diagnostico.mp4`, ... (um clipe por slide)
- **carrossel-estatico**: mesma coisa, em `.png`
- **post-estatico**: `post.png`
- **reel**: `reel.mp4`
- **gravado** (vídeo que você mesma grava): só `capa.png` (still — é referência pra gravar em cima, não a peça publicada)
- `status.json` em cada pasta, com `status: "pendente_aprovacao"`

## Já confirmado

- **Prompt mestre e modelo** — `black-forest-labs/flux-1.1-pro` (Flux Pro),
  testado com token real. Ver `brand/image-prompt-guide.md` (guia humano) e
  `prompts/master-image-prompt.md` (versão consumida pelo pipeline). Flux
  Pro não tem `negative_prompt` — as exclusões já vêm embutidas no bloco de
  estilo.
- Contas com menos de $5 em crédito no Replicate caem num rate limit
  agressivo (6 predictions/min, burst de 1) — `pipeline/replicate.ts` já
  tenta de novo automaticamente respeitando o `retry-after`.

## O que falta decidir/preencher

1. **Schema real da tabela do Supabase** — hoje `pipeline/types.ts` e
   `pipeline/supabase.ts` assumem colunas (`data`, `formato`, `proporcao`,
   `pilar`, `tema`, `hook`, `insights`, `cta`, `arquetipo`, `transito`,
   `reflexao`, `imagens`, `usar_foto_pessoal`, `status`). Ajustar `mapRow()`
   em `supabase.ts` para bater com as colunas reais — `formato` e
   `proporcao` são obrigatórias (ver regra acima).
2. **Foto pessoal** — `usarFotoPessoal`/`assets-pessoais/fotos-referencia/`
   ainda não estão ligados à geração de imagem de verdade (precisaria de
   img2img ou um modelo com referência de imagem — o Flux Pro atual é só
   texto-pra-imagem).
3. **Entrega no Telegram / agendamento no Instagram** — o pipeline hoje só
   deixa os arquivos prontos em `producao/<data>/`. O próximo passo é ligar
   isso no bot do Telegram que você já tem (mandar os clipes pra aprovação)
   e, depois de aprovado, empurrar pra uma ferramenta de agendamento do
   Instagram. Ver `automacoes/arquitetura-publicacao.md`.
