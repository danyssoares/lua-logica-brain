# Arquitetura de publicação

## Decisão de cadência (2026-08-26)

Fluxo diário, com aprovação no dia anterior:

1. Pauta mensal já existe numa tabela no Supabase (fonte da verdade dos
   temas/assuntos do mês).
2. Todo dia, o pipeline (`studio/`) gera o conteúdo do dia seguinte:
   imagem via Replicate + composição via Remotion (carrossel em PNGs ou
   reel em MP4; para vídeos que a Dany grava, só a capa).
3. O material do dia seguinte é enviado pro grupo do Telegram (bot já
   existente) para aprovação/ajuste.
4. Depois de aprovado, agendar a publicação no Instagram usando uma
   ferramenta de agendamento — **a definir**: opções mencionadas
   anteriormente foram Graph API direta vs. Postiz/Blotato.

Motivo de ser diário (e não a semana inteira de uma vez): dá pra ajustar
sem desperdiçar geração de imagem da semana toda se a direção mudar cedo.
A pauta em si (os temas) já é definida com antecedência (mensal, no
Supabase) — só a geração de imagem/render é que acontece um dia antes.

## Em aberto

- [ ] Qual ferramenta de agendamento do Instagram (Postiz, Blotato, Graph
      API direta, outra)
- [ ] Como o pipeline entrega os arquivos pro bot do Telegram (webhook do
      n8n lendo `studio/producao/<data>/`? upload direto via API do
      Telegram?)
- [ ] Como o "aprovado"/"ajustar" volta do Telegram pro pipeline (marca
      status na tabela do Supabase via `pipeline/supabase.ts#marcarStatus`?)

⚠️ Nunca incluir aqui credenciais, tokens do n8n, chaves da Evolution
API/WhatsApp ou do bot do Telegram.
