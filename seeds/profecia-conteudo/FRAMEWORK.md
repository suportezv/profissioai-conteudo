# Profecia Conteúdo Studio: FRAMEWORK

Estúdio de edição e agendamento para as redes do **Profecia** (`profec.ia.br`). Infraestrutura e craft herdados dos estúdios irmãos; posicionamento próprio, ainda em definição.

> **Seções PENDENTES não foram definidas.** Não preencher por inferência, não herdar posicionamento da Profissio.ai nem dos outros estúdios. Perguntar antes de produzir texto público.

## Persona e voz do perfil

- **Produto**: PENDENTE (ler `profec.ia.br` e confirmar com a equipe). O que se sabe: agente de IA do ecossistema Profissio.
- **Quem fala, tom, público**: PENDENTE.
- **CTAs oficiais**: PENDENTE (extrair do site, não inventar).
- **Pronúncia da marca**: PENDENTE (hipótese: "profecia" em português; confirmar antes da primeira locução).

### REGRAS INEGOCIÁVEIS (herdadas do grupo)

1. **Nunca usar travessão em texto público.** Reescrever a frase.
2. **Palavrão bipa, não corta.**
3. **Loudness final: -14 LUFS.**

## Pilares de conteúdo

PENDENTE: derivar das fontes primárias quando lidas. Método validado no estúdio irmão: ler site + base de conhecimento do produto, extrair dores/soluções literais, escolher features que sejam (1) diferenciadas, (2) legíveis em 3 segundos, (3) nativamente visuais.

## Assinaturas de motion (herdadas: craft do grupo, validado contra 4 vídeos reais do @elevenlabsio)

- Peça contínua sem cortes; estados se transformam; cada estado segura 2 a 3s.
- Tipografia contida, sentence case, revelação palavra a palavra; sem display caps em motion.
- UI real do produto como card flutuante; cursor navega; transições por escala.
- Grafo de nós para critérios/canais; CTA discreto digitado com cursor.
- Trilha via **Eleven Music** (não sound-generation), comedida, com ducking pelo VO; SFX da biblioteca `assets/sfx`.
- **Fundo e paleta: PENDENTES** (identidade do Profecia; não usar a aurora da Profissio.ai sem confirmação).
- Área segura 9:16: 220px topo, 420px base. Duração alvo 20 a 60s.

## Fórmula da caption

Estrutura validada no grupo (adaptar quando a persona existir): abertura de anúncio de feature ("Apresentando..." confirmar se o padrão vale para o Profecia), 1 a 2 parágrafos de valor concreto, CTA oficial, sem travessão.

## Fluxo por vídeo

1. Briefing + fontes (pilar, mensagem central, duração, data)
2. Roteiro em cenas (BRIEFING.md + CENAS.md com prompts autocontidos para o Claude Design)
3. Usuário executa no Claude Design e devolve o pacote (.dc.html + jsx)
4. Render determinístico (pipeline documentado no repo irmão, `projects/01-funil-automatico/POS.md`)
5. Locução (voz PENDENTE; validar pronúncia por STT) + SFX da biblioteca + trilha Eleven Music
6. Mix com ducking, master **-14 LUFS**
7. **Preview na conversa para aprovação**
8. Caption
9. Agendamento no Metricool como rascunho (marca do Profecia, blog_id PENDENTE; mídia via commit temporário público)
10. Registrar aprendizados no POS.md do projeto e atualizar o CLAUDE.md
