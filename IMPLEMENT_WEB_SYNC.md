# Prompt para Codex: concluir as lacunas prioritarias do site DevVault

Trabalhe no workspace `/Users/gustavobispo/WORK/DevVault` e conclua as lacunas prioritarias do site necessarias para uma integracao comercial segura com o desktop. O foco principal e login desktop real, licenca e sync criptografado. Depois, trate lifecycle Stripe e recuperacao de senha sem misturar mudancas inseguras numa unica etapa.

## Leitura obrigatoria

Antes de alterar codigo:

1. Leia `AGENTS.md`.
2. Leia `web/AGENTS.md`.
3. Leia `docs/ARCHITECTURE.md`, `docs/FEATURES.md`, `docs/SYNC.md`, `docs/OPEN_ITEMS.md`, `docs/WEB_API.md` e `docs/DEVELOPMENT.md`.
4. Leia a documentacao relevante do Next.js 16 em `web/node_modules/next/dist/docs/`, especialmente Route Handlers e Authentication.
5. Inspecione as migrations Supabase, `web/src/lib/license/`, `web/src/lib/supabase/` e os testes existentes.
6. Verifique o worktree e preserve alteracoes do usuario.

## Estado atual que nao pode ser descrito como pronto

- O desktop possui opt-in, preferencias, recovery key e AES-256-GCM em `app/src/main/sync/`.
- Nao existe transporte remoto, upload, download, restauracao ou merge.
- `DEVVAULT_SYNC_API_URL` ainda nao habilita transporte.
- O mock de login desktop nao gera access token Supabase real.
- A compra/licenca web ainda nao atualiza o `LicenseService` local do desktop.
- `signature: unsigned:mvp` nao e prova offline confiavel.

## Objetivo principal

Entregar o suporte web seguro para:

1. Login real do desktop via site e callback `devvault://auth/callback`.
2. API autenticada para armazenar e recuperar apenas envelopes criptografados.
3. Gate Pro no servidor.
4. Concorrencia otimista sem overwrite silencioso.
5. Exclusao do backup remoto.
6. Testes automatizados e documentacao.

O servidor nunca deve receber recovery key nem plaintext das envs.

## Fases obrigatorias

Implemente e valide uma fase antes de iniciar a seguinte. Se uma fase nao puder ser concluida com seguranca, documente o bloqueio e nao marque as fases posteriores como prontas.

### Fase 1: infraestrutura de testes

- Adicione testes automatizados ao projeto web.
- Prepare Supabase local/test database para migrations, RLS e concorrencia.
- Crie helpers de request autenticado sem vazar tokens.

### Fase 2: login desktop real

- Implemente `/auth/desktop` conforme a secao abaixo.
- Valide ponta a ponta com o custom protocol em desenvolvimento.

### Fase 3: licenca desktop-web

- Alinhe payload Free ao limite atual 1 projeto, 1 ambiente e zero templates customizados.
- Adicione limites/entitlements de historico, command runner, prepare e sync ao contrato web.
- Implemente no desktop `deviceId` aleatorio e estavel, status/activate/refresh/deactivate no main process.
- Comprar Pro no site deve liberar o desktop apenas apos estado validado pelo servidor.
- Nao confie offline em `unsigned:mvp`; se assinatura assimetrica nao couber nesta fase, mantenha modo online e documente a limitacao.

### Fase 4: sync criptografado

- Implemente banco, API e integracao descritos neste prompt e em `docs/SYNC.md`.

### Fase 5: lifecycle Stripe

- Trate cancelamento, expiracao, refund, chargeback e revogacao nos eventos Stripe adequados.
- Atualize profile e license de modo idempotente.
- Nunca conceda ou preserve Pro apenas pelo redirect do Checkout.

### Fase 6: recuperacao de senha

- Substitua o placeholder por request de reset, callback seguro e formulario de nova senha.
- Preserve validacao de redirect interno e mensagens que nao revelem existencia de conta.

Team, Windows/Linux e colaboracao multiusuario ficam fora do escopo.

## Requisitos de arquitetura

### Desktop auth web

- Implemente a pagina/fluxo `/auth/desktop`.
- Preserve e valide `state` e `redirect_uri` recebido do desktop.
- Aceite somente `devvault://auth/callback` como redirect desktop.
- Se o usuario nao estiver autenticado, conduza ao login existente e retorne ao fluxo desktop.
- Ao concluir, obtenha um access token Supabase valido e redirecione para:

```text
devvault://auth/callback?token=<access-token>&state=<state>
```

- Em cancelamento/erro, use `error=<codigo-seguro>` e preserve `state`.
- Nao registre token e nao o inclua em paginas, analytics ou mensagens de erro.
- Considere explicitamente o risco de token em URL. Mantenha o contrato atual para compatibilidade, mas documente e isole o ponto para futura troca por authorization code de uso unico.

### Banco Supabase

Crie migration versionada para `sync_snapshots` conforme `docs/SYNC.md`.

Requisitos:

- Uma linha por usuario no MVP.
- FK para `auth.users` com cascade.
- `version` monotonicamente crescente.
- Campos do envelope e metadata, nunca recovery key.
- Checks para algoritmo, schema version, payload bytes e campos vazios.
- `updatedAt` e `createdAt` consistentes com o estilo existente.
- RLS habilitada.
- Policies de select/insert/update/delete apenas para `auth.uid() = userId`.
- Indices necessarios.

### API

Implemente Route Handlers Next.js 16:

```text
GET    /api/sync/status
GET    /api/sync/snapshot
PUT    /api/sync/snapshot
DELETE /api/sync/snapshot
```

Use os padroes existentes de `getApiUser`, respostas JSON seguras, `server-only`, Supabase admin e server logging. Extraia helpers de sync para `web/src/lib/sync/`; nao concentre regra nos Route Handlers.

Regras:

- Bearer Supabase obrigatorio para desktop. Cookie pode ser aceito para ferramentas web internas, seguindo `getApiUser`.
- `Cache-Control: no-store`.
- Gate Pro consultando estado real no servidor.
- Nao confiar em `plan`, `userId`, payload size ou device ownership enviados pelo cliente.
- Limite de 8 MiB para a requisicao/envelope.
- Validar estrutura base64url, AES-256-GCM, IV de 12 bytes, auth tag de 16 bytes e tamanho do ciphertext.
- Calcular SHA-256 do ciphertext no servidor para idempotencia e auditoria.
- Nunca descriptografar o envelope.
- Nunca registrar body, ciphertext, token ou headers de Authorization.

### Concorrencia

- Criacao inicial exige `expectedVersion: 0`.
- Atualizacao exige a versao remota conhecida.
- Incremento deve ser atomico; use SQL/RPC ou update condicional, nao read-then-write vulneravel.
- Versao divergente retorna HTTP 409:

```json
{
  "error": "Remote backup changed on another device.",
  "code": "SYNC_CONFLICT",
  "remote": {
    "version": 4,
    "deviceId": "...",
    "keyId": "...",
    "updatedAt": "..."
  }
}
```

- Mesmo hash pode retornar sucesso idempotente.
- Nao implementar last-write-wins silencioso.

### Respostas e erros

Padronize codigos:

- `401 AUTH_REQUIRED`
- `403 PRO_REQUIRED`
- `404 SYNC_NOT_FOUND`
- `409 SYNC_CONFLICT`
- `413 PAYLOAD_TOO_LARGE`
- `422 INVALID_SYNC_ENVELOPE`
- `500 SYNC_UNAVAILABLE`

Mensagens nao devem expor detalhes internos do Supabase.

## Integracao desktop necessaria para validar ponta a ponta

Embora o foco seja `web/`, conclua os ajustes minimos em `app/` se forem necessarios para testar o fluxo real:

- Expor internamente no main process o access token descriptografado para o cliente HTTP de sync, nunca para o renderer.
- Implementar transporte HTTPS em `SyncService` usando `DEVVAULT_SYNC_API_URL`.
- Serializar um bundle versionado no main process.
- Enviar somente envelope cifrado.
- Implementar status, upload manual, download e preview de restauracao.
- Nao sobrescrever SQLite automaticamente; restauracao exige review e transacao/rollback.
- Tratar 401, 403, 409, 413 e indisponibilidade de rede.
- Manter sync opt-in e nunca ativar no login automaticamente.

Se o escopo desktop for grande demais para uma unica mudanca segura, entregue primeiro o site completo e um cliente HTTP desktop testado, deixando restauracao visual em um commit/etapa separada claramente documentada. Nao marque sync como funcional ponta a ponta sem upload e restore reais.

## Testes obrigatorios

Adicione uma suite web; hoje o projeto nao possui testes automatizados suficientes.

Cubra:

- token ausente/invalido;
- usuario Free;
- Pro autenticado;
- envelope valido;
- campos/base64url invalidos;
- payload acima de 8 MiB;
- criacao version 0;
- update atomico;
- conflito concorrente;
- idempotencia por hash;
- ownership/RLS com dois usuarios;
- GET sem snapshot;
- DELETE e leitura posterior;
- callback desktop com state correto, divergente, cancelamento e redirect invalido;
- ausencia de token/ciphertext/recovery key em logs.

Use Supabase local ou um test harness que execute SQL real para as garantias de concorrencia e RLS. Mocks isolados nao sao suficientes para esses dois casos.

## Variaveis de ambiente

Documente e adicione exemplos sem credenciais reais:

```text
DEVVAULT_SYNC_API_URL=https://devvault.app/api/sync
DEVVAULT_AUTH_URL=https://devvault.app/auth/desktop
```

O site deve continuar usando as variaveis Supabase existentes. Nao crie uma chave de criptografia server-side para os bundles: isso quebraria o modelo zero-knowledge.

## Documentacao

Atualize:

- `docs/SYNC.md` com o comportamento final.
- `docs/ARCHITECTURE.md`.
- `docs/FEATURES.md`.
- `docs/WEB_API.md`.
- `docs/DEVELOPMENT.md`.
- `docs/USER_GUIDE.md`.
- `web/README.md` e `.env.example`.
- docs desktop se o contrato IPC ou fluxo mudar.

Remova linguagem de placeholder apenas para partes realmente verificadas.

## Validacao final

Execute:

```bash
cd web
npm run lint
npm run build
```

Execute tambem a nova suite de testes web e, se tocar no desktop:

```bash
cd app
npm test
npm run typecheck
npm run lint
npm run build
```

Teste com Supabase real/local, dois usuarios e dois `deviceId`. Registre claramente qualquer etapa externa nao exercitada.

## Criterios de aceite

- Site autentica o desktop com token Supabase valido.
- API nunca recebe recovery key ou plaintext.
- Usuario Free nao consegue usar sync remoto.
- Usuario nao acessa snapshot de outro usuario.
- Upload concorrente nao perde dados.
- Envelope pode ser baixado sem alteracao byte a byte.
- Exclusao remota funciona e e isolada por usuario.
- Logs nao contem material sensivel.
- Documentacao descreve exatamente o estado entregue.
