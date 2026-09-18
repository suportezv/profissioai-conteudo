# Levar as ferramentas deste estúdio para os outros

Guia para replicar o cinto de ferramentas do Profissio.ai Conteúdo Studio nos estúdios irmãos (`ana-conteudo`, `eita-conteudo`, `normalyze.conteudo`, `profecia-conteudo`) ou em um estúdio novo.

A regra que organiza tudo: **ferramenta é genérica, marca não é.** Os scripts foram escritos sem nenhuma referência à Profissio.ai justamente para atravessarem estúdios sem edição. O que carrega marca está isolado em poucos arquivos, nomeados abaixo.

---

## 1. O que copiar sem tocar em nada

Estes seis arquivos têm **zero referências de marca** (conferido por varredura, não por impressão). Copie como estão:

| Arquivo | O que faz |
|---|---|
| `scripts/decupar.py` | Decupa vídeo por **âncoras de texto** ("de tal frase até tal frase") casadas contra transcrição com timestamp por palavra. Junta trechos, gira, aplica LUT, normaliza áudio |
| `scripts/relatorio_decupagem.py` | Retranscreve as peças finais e monta o relatório do que ficou e do que caiu |
| `scripts/gera_lut_slog2.py` | Gera LUT 3D de S-Log2/S-Gamut para Rec.709 a partir das transferências da `colour-science` |
| `scripts/zip_index_remoto.py` | Lista e extrai arquivos de um ZIP gigante no Drive por *range request*, sem baixar o ZIP |
| `scripts/gera_imagem.py` | Gera imagem pela OpenAI ou pelo Gemini, mesma interface, chaves só do ambiente |
| `scripts/sobe_para_drive.py` | Sobe arquivos para uma pasta do Drive com token de acesso |

```bash
# do estúdio de destino, com este repo clonado ao lado
cp ../profissioai-conteudo/scripts/{decupar,relatorio_decupagem,gera_lut_slog2,zip_index_remoto,gera_imagem,sobe_para_drive}.py scripts/
```

Dependências que eles assumem: `ffmpeg`/`ffprobe` no PATH, `python3` com `numpy`, `pillow` e `colour-science`, e `curl`. O `setup.sh` instala tudo.

---

## 2. O que copiar e editar (poucas linhas)

### `scripts/setup.sh` — 3 linhas de marca

- linha 2: comentário com o nome do estúdio
- linhas 106-107: o symlink `~/profissioai-conteudo`

Troque o nome do estúdio nas três e pronto. O resto (rota de rede pelo proxy, ffmpeg estático, video-use, hyperframes, Remotion, Python) é genérico.

### `scripts/validate.sh` — 2 linhas de marca

- linha 2: comentário
- a linha que cita `blog_id 6736175` do Metricool: trocar pelo blog_id do estúdio de destino

### `remotion/` — 2 arquivos de marca

Copie a pasta inteira **menos `node_modules`**, e edite:

- **`src/marca.ts`**: é o único lugar com a paleta. Troque os hexes pelos da marca de destino e o nome da fonte. Todo o resto do Remotion lê daqui.
- **`src/Root.tsx`**: o `rodape: "profissio.ai"` nos `defaultProps`.

`Aurora.tsx`, `CartaoTitulo.tsx`, `index.ts` e `remotion.config.ts` **não têm marca** e vão sem edição. O `Aurora` desenha a partir dos tokens, então trocar `marca.ts` já muda o visual inteiro.

```bash
mkdir -p remotion
cp -r ../profissioai-conteudo/remotion/{src,package.json,tsconfig.json,remotion.config.ts} remotion/
printf '\n# Remotion\nremotion/node_modules/\nremotion/out/\n' >> .gitignore
# depois: editar remotion/src/marca.ts e remotion/src/Root.tsx
```

---

## 3. O que **não** copiar

- **`CLAUDE.md` e `FRAMEWORK.md` inteiros.** Cada estúdio tem marca, persona, voz e credencial próprias. Copiar isso é exatamente o erro que o Profissio.ai teve que desfazer ao nascer do template do EITA.
- **`projects/`**: são peças de um cliente específico.
- **`design-system/`**: é a identidade visual da Profissio.ai.

O que **vale** transplantar de `CLAUDE.md` são os **gotchas técnicos genéricos**, que são craft e não marca. Na seção "Gotchas essenciais", copie os que não citam a Profissio.ai — em especial:

- S-Log2 da Sony: converter, não "filtrar"
- câmera grava na vertical sem gravar a flag de rotação
- decupagem por âncora de texto
- Remotion renderiza com o `headless_shell`, não com o Chromium do Playwright
- processo em background com `nohup`/`setsid` é recolhido pelo harness
- ler o índice de um ZIP gigante no Drive sem baixar o arquivo
- allowlist do environment não cobre subdomínio
- Metricool: rascunho com data vencida não publica e não avisa

E a seção **"Escolha do framework de motion"** do `FRAMEWORK.md`: a regra HyperFrames vs Remotion vale para qualquer estúdio, só o padrão declarado pode mudar.

---

## 4. Chaves de API: cada estúdio tem as suas

**Este é o ponto que mais dá errado na cópia.** Nenhuma chave está em arquivo do repo, e nenhuma deve estar. Todo script lê exclusivamente de variável de ambiente, e `gera_imagem.py` recusa explicitamente receber chave por argumento, porque linha de comando vaza em histórico do shell e em lista de processos.

Para cada estúdio, cadastrar **nas variáveis de ambiente do environment** (não no `.env` do repo, não no chat):

| Variável | Para quê | Como conferir o escopo |
|---|---|---|
| `ELEVENLABS_API_KEY` | TTS, STT (Scribe) e `sound-generation` | chamar o endpoint com parâmetro inválido: `401 missing_permissions` = escopo ausente; `400`/`404` = escopo presente |
| `OPENAI_API_KEY` | geração de imagem | `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"` |
| `GEMINI_API_KEY` | geração de imagem | `curl https://generativelanguage.googleapis.com/v1beta/models -H "x-goog-api-key: $GEMINI_API_KEY"` |

Três armadilhas já pagas com tempo:

1. **Variável de ambiente entra na criação do container.** Cadastrar no environment com uma sessão já aberta não faz a sessão enxergar: é preciso sessão nova. Conferir com `printenv | grep -c API_KEY` antes de acusar o script.
2. **Chave válida não significa quota.** No Gemini, listar modelos funciona no tier gratuito, mas gerar imagem devolve `429` com `limit: 0`. Se o erro cita `quotaId: ...-FreeTier`, o projeto da chave **não** está no faturamento — adicionar meio de pagamento na conta não basta, ele tem que estar vinculado **ao projeto daquela chave**. Foi exatamente o que travou o Profissio.ai por horas, e o que destravou foi vincular o faturamento ao projeto certo. **Leia o campo `details` do erro, não só a mensagem**: é ele que nomeia a cota violada.
3. **Nem toda chave da ElevenLabs tem todos os escopos.** A do Profissio.ai não tem `user_read`, então não dá para checar saldo antes de gerar lote. Verificar antes de planejar um lote grande.

---

## 5. Allowlist de rede do environment

Cada environment tem a sua. Os hosts que este cinto de ferramentas exige:

| Host | Para quê |
|---|---|
| `api.elevenlabs.io` | TTS, STT, SFX |
| `api.openai.com` | imagem por GPT |
| `generativelanguage.googleapis.com` | imagem por Gemini |
| `www.googleapis.com` | upload para o Drive |
| `drive.google.com`, `drive.usercontent.google.com` | baixar brutos |
| `pypi.org`, `files.pythonhosted.org` | dependências Python |
| `registry.npmjs.org` | Remotion e `npx` |
| `api.github.com` + GitHub Releases | ffmpeg estático, clones |

Dois avisos que valem para qualquer estúdio:

- **A allowlist é literal por subdomínio.** `www.googleapis.com` **não** cobre `generativelanguage.googleapis.com`. Para um site inteiro, usar `*.dominio.com` junto do apex.
- **Diagnóstico em um comando**: `curl -sv https://host/ 2>&1 | grep CONNECT`. Se aparecer `HTTP/1.1 403` no CONNECT, é allowlist; qualquer outra resposta significa que a rede passou e o problema é outro (chave, quota, rota).

`raw.githubusercontent.com` **não** precisa ser liberado: o `setup.sh` registra as skills do hyperframes a partir do clone local quando o `npx ... skills update` falha.

---

## 6. Rodar e verificar

```bash
bash scripts/setup.sh      # 6 passos; sai com código 0 mesmo se um passo avisar
bash scripts/validate.sh   # tem que ficar verde
```

O `validate.sh` **testa comportamento, não presença de arquivo**. É deliberado: a versão antiga procurava um patch no código e dava falso positivo depois que o upstream corrigiu o problema de outro jeito. Hoje ele:

- roda 3 filtros reais no ffmpeg
- gera retrato, paisagem e paisagem com matriz de rotação 90 e confere se `is_portrait_source` acerta os três
- renderiza 1 frame de verdade no Remotion
- bate os hosts liberados

Se um passo do `setup.sh` avisar, ele **não** derruba o boot — é intencional, para a sessão nascer mesmo com uma ferramenta faltando. Por isso **ler a saída**, não só o código de retorno.

**Em sessão nova, conferir `ls /workspace` antes de contar com video-use ou hyperframes.**

> **Armadilha do campo de setup do environment.** Configure-o com **caminho absoluto**, nunca relativo. O comando de boot roda com o diretório de trabalho no **pai** do repo, então `bash scripts/setup.sh` falha com `No such file or directory` e **exit 127**, e a sessão nasce sem `/workspace` e sem skills. Use `bash /home/user/<nome-do-repo>/scripts/setup.sh`, ou a versão que não depende do nome:
>
> ```bash
> for p in ./scripts/setup.sh ./*/scripts/setup.sh; do [ -f "$p" ] && exec bash "$p"; done; p=$(find /home /workspace /repo /app /src -maxdepth 4 -type f -path "*/scripts/setup.sh" 2>/dev/null | head -1); [ -n "$p" ] && exec bash "$p"; echo "setup.sh nao encontrado no repo"; exit 1
> ```
>
> O script deriva o próprio `REPO_ROOT` do `BASH_SOURCE`, então roda de qualquer diretório desde que seja invocado pelo caminho certo. O gatilho de boot do environment não roda o `setup.sh` de forma confiável; rodar à mão resolve.

---

## 7. Ordem sugerida

1. `setup.sh` e `validate.sh` (adaptar 5 linhas) → roda e fica verde
2. Os 6 scripts genéricos → cópia direta
3. Variáveis de ambiente e allowlist → **abrir sessão nova** e conferir
4. `remotion/` → copiar, trocar `marca.ts` e `Root.tsx`, renderizar 1 frame para provar
5. Gotchas genéricos para o `CLAUDE.md` do destino, e a regra de escolha de framework para o `FRAMEWORK.md`
6. Marca, persona e voz: **preencher do zero no destino**, nunca herdar

> **Este guia foi ensaiado, não só escrito.** Em 18/set/2026 o roteiro inteiro
> rodou num estúdio de teste descartável: os 6 scripts copiados vieram com zero
> referências de marca, e o Remotion portado renderizou 1080x1920 numa paleta
> verde/teal **trocando apenas 3 hexes em `marca.ts` e o rodapé em `Root.tsx`**,
> sem encostar em `Aurora.tsx` nem em `CartaoTitulo.tsx`. É a prova de que a
> marca está mesmo isolada nesses dois arquivos.

Um teste de fumaça honesto no fim, em vez de confiar na cópia:

```bash
python3 scripts/gera_imagem.py --listar                      # as duas chaves respondem?
python3 scripts/zip_index_remoto.py list <file_id_publico>   # range request funciona?
cd remotion && npx remotion still src/index.ts <Composicao> /tmp/f.png --frame=30
```
