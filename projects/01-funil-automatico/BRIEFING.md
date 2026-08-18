# Projeto 01: Funil Automático (motion)

**Pilar**: D (Central de Ajuda em vídeo), cruzado com B (dor do eixo Vendas).
**Feature**: Aba Funil, classificação automática de leads.
**Formato**: motion graphic vertical, sem locução na v1. Áudio e pós na etapa seguinte.
**Duração alvo**: 30s. **Canvas**: 1080x1920 (9:16), 30fps.
**Execução**: Claude Design, cena a cena.

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

| Cena | Tempo | Função | Texto em tela |
|---|---|---|---|
| 1 | 0:00–0:03 | Gancho | SEU FUNIL ESTÁ DESATUALIZADO AGORA |
| 2 | 0:03–0:09 | Dor | Alguém precisa arrastar cada card. Toda vez. |
| 3 | 0:09–0:17 | Virada | O funil da Profissio.ai lê a conversa e move o lead sozinho |
| 4 | 0:17–0:25 | Aprofundamento | Ela classifica por intenção, não por formulário |
| 5 | 0:25–0:30 | CTA | Fale com a Agente Profissio.ai no WhatsApp |

## Sistema visual (fixo em todas as cenas)

- **Fundo**: `#07060B`. Superfícies de card: `#15101F`, elevada `#1B1428`.
- **Acento**: rosa `#E255A0`. Apoio: violeta `#6B3CB8`, ciano `#3DBFF2`.
- **Texto**: branco `#FFFFFF`, secundário `#B6B0C5`.
- **Display**: Archivo Black (ou Bebas Neue). **Interface e corpo**: Sora. **Chips**: Inter Tight.
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` nas entradas. Sem bounce, sem overshoot elástico.
- **Área segura**: nada de texto nos 220px do topo nem nos 420px de baixo (UI do Instagram).
- **Regra de marca**: nunca usar travessão. Reescrever a frase.

## Restrições herdadas do FRAMEWORK

- Legendas, se houver, sempre por último no filter chain (etapa de pós, não no Claude Design).
- Loudness final -14 LUFS na sonorização.
- Duração entre 20 e 60s.
