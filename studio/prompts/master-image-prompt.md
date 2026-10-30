# Prompt mestre — geração de imagem (Replicate)

> Versão consumida por `pipeline/promptBuilder.ts`. Guia completo (com
> exemplos e explicações) em `brand/image-prompt-guide.md` — mantenha os
> dois em sincronia se ajustar o bloco de estilo.

## Bloco de estilo base (usar em TODA imagem)

```
Ethereal mystic-tech aesthetic. Color palette: deep purple #450e5d, gold #C6A156,
cosmic cream #F2E8E4, accents of medium purple #5e2a78 and light gold #d9be83.
Soft cinematic lighting, subtle film grain texture, gentle light leaks suggesting
cosmic energy. Editorial, elegant, feminine, contemplative mood. No harsh contrast,
no neon, no cartoonish elements, no text or typography in the image.
```

## Regras fixas

- Modelo padrão: **Flux Pro** (`black-forest-labs/flux-1.1-pro`). Nano Banana
  só em emergência — nunca misturar os dois no mesmo carrossel/reel.
- Nunca pedir texto na imagem (o texto entra depois, via Remotion). O Flux
  Pro não tem `negative_prompt` — por isso essa regra já está embutida no
  bloco de estilo acima, não numa seção separada.
- Geração por texto puro (sem imagem de referência/Kontext).
- Composição com espaço negativo pro texto por cima — ver `sceneFor()` em
  `pipeline/promptBuilder.ts`, que já adiciona essa instrução automaticamente.

## Variáveis disponíveis (preenchidas por `promptBuilder.ts`)

- `{{tema}}` — assunto do dia (coluna `tema` da pauta)
- `{{hook}}` — frase de abertura / frase única
- `{{arquetipo}}` — arquétipo ou trânsito citado, quando houver
