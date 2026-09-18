# Hero do site: "Cada conversa move o seu negócio"

Composição `HeroSite` em `remotion/src/Hero.tsx`. 1920x1080, 30 fps, 22 s.

## O conceito

**Uma conversa só, que nunca sai de cena e se transforma três vezes.** Não são
três animações coladas: é um plano contínuo, sem corte, em que o mesmo painel
muda de estado. É o que torna a frase literal — a conversa atravessa a peça e,
ao atravessar, move o negócio.

| Ato | Frente | O que acontece |
|---|---|---|
| 01 · Uma conversa chega | **Agentes de IA** | Mensagem entra, o Agente responde. Chip: `IA Gerenciando` |
| 02 · A equipe assume | **Atendimento** | O chip vira `Humano Gerenciando`, entra o avatar do atendente e a IA pausa |
| 03 · O negócio se move | **CRM e Ativação** | A conversa vira ficha e caminha pelos quatro estágios do funil |

Fecho: a frase da marca com **conversa** em azul, e o CTA único.

## Por que os rótulos são esses

Não foram inventados. Saíram do **App Profissio de verdade**, na conta
Profissio SDR:

- Status: `IA Gerenciando`, `Humano Gerenciando` (o app usa **Humano**, não
  "Atendente" como diz a Central de Ajuda).
- Estágios do funil: `Conversas básicas → Com objeções → Interessado →
  Reunião marcada`.
- Rodapé do painel: `Informações coletadas`, com as etiquetas reais.

As **mensagens são fictícias**, escritas para a peça. Nenhuma conversa de
cliente real foi usada, nem podia ser.

## Como está construído

- Superfície escura `#101218` com um halo azul que deriva devagar. Sem
  gradiente aurora: a revisão 3 não tem sistema de gradiente.
- Painel branco de raio 20 (token `painel`), a UI como protagonista.
- Sora peso 500, tracking -3,5% em tudo, alinhado à esquerda.
- Azul `#2458F5` no acento e na palavra-chave; verde só no chip de status
  humano, que é semântica de estado, não cor de marca.
- Trilho de progresso no rodapé esquerdo: informa em qual das três frentes a
  peça está. Numeração `01/03` porque **é** uma sequência, não enfeite.

## Render

```bash
cd remotion
npx remotion render src/index.ts HeroSite out/hero-profissio.mp4 --codec=h264 --crf=17
```

**Depois do render, corrigir a faixa de cor**: o Remotion entrega `yuvj420p`
em faixa completa, que destoa entre players. O passo obrigatório:

```bash
ffmpeg -i out/hero-profissio.mp4 -vf "scale=out_range=tv,format=yuv420p" \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -crf 17 -preset slow -movflags +faststart -an saida.mp4
```

Entregue em `out/`: `hero-profissio.mp4` (1,8 MB) e `hero-profissio.webm`
(1,0 MB, VP9). Para o site, servir o WebM com o MP4 como fallback.

## Para publicar no site

Peça de hero roda sem som, em laço e sem controles:

```html
<video autoplay muted loop playsinline poster="hero.jpg">
  <source src="hero-profissio.webm" type="video/webm">
  <source src="hero-profissio.mp4" type="video/mp4">
</video>
```

O `muted` não é estilo: sem ele o `autoplay` é bloqueado pelos navegadores.

## O que ficou de fora, de propósito

- **Áudio.** Hero de site roda mudo. Se virar peça de rede social, aí entra
  trilha ambiente comedida e master a -14 LUFS.
- **Laço perfeito.** A peça termina no fecho e não volta ao estado inicial;
  em laço, o corte é perceptível. Se o site for rodar em loop contínuo, vale
  uma versão que resolve de volta ao ato 1.
