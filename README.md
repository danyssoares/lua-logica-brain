# Lua Lógica — Base de Conhecimento

Repositório de apoio para geração de conteúdo, imagens e automações da marca **Lua Lógica**, usado como referência pelo Claude.

## Estrutura

- **brand/** — identidade visual: paleta, tipografia, logo, mockups
- **assets-pessoais/** — fotos de referência e descrição de estilo pessoal (Dany)
- **conteudo/** — estratégia editorial, tom de voz, banco de frases, calendário
- **produtos/** — descrição de cada produto/oferta (Sua Luz de Volta, Mapa Infantil, Eclipse Express, Estelar Sinastria)
- **astrologia/** — mapa natal de referência e metodologia de interpretação (Aion)
- **automacoes/** — descrição dos fluxos n8n e arquitetura de publicação (sem credenciais)
- **skills/** — cópia das skills usadas com o Claude (Aion, Eclipse Express, Estelar Sinastria)
- **studio/** — pipeline de produção de Reels/carrosséis (Remotion + Supabase + Replicate). Tem `.env` próprio, nunca commitado — ver `studio/README.md`

## ⚠️ Regra de ouro

Este repositório é **público**. Nunca commitar:
- Dados de clientes/consulentes (nome, data de nascimento, local de nascimento, mapas reais)
- Credenciais, tokens de API, chaves do n8n/Evolution API/WhatsApp
- Prints de conversas ou leituras reais

Exemplos e templates usam sempre dados fictícios (ex: "Nome da Consulente").

## Como o Claude usa isso

Basta colar o link do arquivo (ou da pasta) aqui no chat — ex:
```
https://github.com/<usuario>/lua-logica-brain/blob/main/brand/brandbook.md
```
ou o link "raw" para leitura direta do conteúdo.
