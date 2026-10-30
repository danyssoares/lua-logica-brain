# Guia de Prompt — Geração de Imagens Lua Lógica

## Bloco de estilo base (usar em TODA imagem)

Cole isso no início de qualquer prompt, sempre igual, trocando só a cena no final:

```
Ethereal mystic-tech aesthetic. Color palette: deep purple #450e5d, gold #C6A156,
cosmic cream #F2E8E4, accents of medium purple #5e2a78 and light gold #d9be83.
Soft cinematic lighting, subtle film grain texture, gentle light leaks suggesting
cosmic energy. Editorial, elegant, feminine, contemplative mood. No harsh contrast,
no neon, no cartoonish elements, no text or typography in the image.
```

## Regras fixas (não negociar)

- **Modelo padrão: Flux Pro** (`black-forest-labs/flux-1.1-pro` no Replicate).
  Nano Banana só em emergência (Flux fora do ar), e **nunca misturar os dois
  no mesmo carrossel/vídeo** — validamos que geram texturas de renderização
  diferentes entre si.
- **Nunca pedir texto dentro da imagem.** Modelos de imagem erram letra; o
  texto sempre entra depois, como camada tipográfica real no Remotion.
  > Nota técnica: o Flux Pro não tem campo de `negative_prompt` — por isso
  > essa e as outras exclusões vão dentro do próprio bloco de estilo acima,
  > não como negative prompt separado.
- **Geração por texto puro é suficiente.** Não precisa de imagem de
  referência/Kontext — o bloco de estilo acima já mantém a consistência
  sozinho.
- **Composição pensando em overlay de texto:** sempre que a imagem for
  fundo de Reel ou capa de carrossel, pedir explicitamente "área de espaço
  negativo" ou "minimal composition" pra sobrar espaço pro texto por cima.

## Template para nova cena

```
[BLOCO DE ESTILO ACIMA]
[Descrição da cena específica — arquétipo, trânsito, símbolo, etc.]
```

## Para animação (image-to-video, Wan/Kling)

Ao animar uma imagem já gerada, seguir esse padrão:

```
Subtle, slow animation. [O QUE DEVE SE MOVER: tecido, poeira estelar, luz, etc.]
moves gently. Camera remains completely static, no camera movement or zoom.
[QUALQUER ELEMENTO QUE PRECISE FICAR ESTÁVEL — ex: mão, objeto segurado] has a
very subtle, natural stillness — barely perceptible micro-movement, as if
breathing softly. Not a frozen pose. Smooth, dreamlike, cinematic motion.
```

Negative prompt: camera movement, zoom, shaky motion, distorted hand,
warped fingers, morphing objects, fast motion, flickering

**Lição aprendida:** nunca pedir "completely still/unchanged" pra mão ou
parte do corpo — isso trava e fica artificial. Pedir "sutil, mas vivo" em
vez de "parado".

---

Este guia é a referência humana (pra você usar direto no site do Replicate,
se quiser gerar algo avulso). A versão consumida pelo pipeline automático
está em `studio/prompts/master-image-prompt.md`, com o mesmo bloco de
estilo — ver `studio/README.md` pra como os dois se conectam.
