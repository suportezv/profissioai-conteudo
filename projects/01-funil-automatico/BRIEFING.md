# Projeto 01: Funil Automático (motion)

**Pilar**: D (Central de Ajuda em vídeo), cruzado com B (dor do eixo Vendas).
**Feature**: Aba Funil, classificação automática de leads.
**Formato**: motion graphic vertical, sem locução na v1. Áudio e pós na etapa seguinte.
**Duração alvo**: ~31s. **Canvas**: 1080x1920 (9:16), 30fps.
**Execução**: Claude Design, cena a cena. Roteiro v2 na gramática validada do `@elevenlabsio` (ver `CENAS.md`).

## Por que esta feature

Escolhida entre os 28 artigos da Central de Ajuda. Critérios: quanto é diferenciada, quanto é legível em 3 segundos e quanto rende movimento.

O Funil da Profissio.ai "organiza automaticamente as conversas com clientes, com base em seus comportamentos, intenções e nível de interesse". Ele analisa conteúdo das mensagens, tipo de interação e palavras-chave/intenções, e **move a conversa de estágio sozinho**.

Ganha porque:

1. **É contraintuitivo.** Em CRM, mover card é trabalho humano. Um funil que anda sozinho quebra expectativa, e quebra de expectativa é gancho.
2. **É nativamente visual.** Card atravessando coluna sem ninguém tocar é a definição de motion graphic. Não precisa de metáfora inventada, o produto já é a animação.
3. **Bate numa dor que o próprio site declara** no eixo Vendas: "acompanhamento e nutrição dos contatos manual".
4. **Fala com quem decide.** Funil é vocabulário de dono e de head de vendas, o público B2B do perfil.

Vice-campeãs, guardadas para os próximos: **Assumir conversa** (a passagem de IA Gerenciando para Atendente Gerenciando) e **Tempo economizado** no Painel de Análises, que mostra quantas horas de atendimento humano o Agente poupou.

## Roteiro

| Cena | Tempo | Função | Texto em tela (v2, sentence case) |
|---|---|---|---|
| 1 | 0:00–0:05 | Gancho | Seu funil está desatualizado agora. |
| 2 | 0:05–0:11 | Dor | Alguém precisa arrastar cada card. Toda vez. |
| 3 | 0:11–0:19 | Virada | O Funil lê a conversa e move o lead sozinho. |
| 4 | 0:19–0:26 | Aprofundamento | Classificado por intenção, não por formulário. |
| 5 | 0:26–0:31 | CTA | Seu time chega antes. + Fale com a Agente Profissio.ai (wa.me digitado) |

## Sistema visual (v2, fixo em todas as cenas)

Reescrito após análise frame a frame de 4 vídeos reais do `@elevenlabsio` (18/ago/2026). Gramática completa no `CLAUDE.md`.

- **Fundo aurora claro**: base `#F2EFF7`, manchas desfocadas rosa `#E255A0`/`#D86AA8` (superior direito) e violeta `#6B3CB8` (inferior esquerdo), drift lento contínuo, grão 2%.
- **Tinta**: `#15101F`. Secundário `#4F4858`. Micro rótulos `#7B7589`. Palavra-chave rosa `#E255A0`.
- **Tipografia**: Sora em tudo, sentence case, sem caixa alta. Micro rótulos em Inter Tight.
- **UI**: painéis brancos `#FFFFFF`, cantos 16 a 20px, sombra difusa rgba(21,16,31,0.10); cards internos `#F7F4FB`.
- **Movimento**: peça contínua sem cortes; easing `cubic-bezier(0.16,1,0.3,1)`; estados seguram 2 a 3s; transições por escala e fade.
- **Área segura**: 220px topo, 420px base.
- **Regra de marca**: nunca usar travessão.

## Restrições herdadas do FRAMEWORK

- Legendas, se houver, sempre por último no filter chain (etapa de pós, não no Claude Design).
- Loudness final -14 LUFS na sonorização.
- Duração entre 20 e 60s.
