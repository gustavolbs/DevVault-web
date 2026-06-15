# EnvDock web

Site Next.js para marketing, conta Supabase, cobranca Stripe, licencas, downloads e backend opaco de sync.

Documentacao central:

- [Arquitetura](../docs/ARCHITECTURE.md)
- [Funcionalidades](../docs/FEATURES.md)
- [Desenvolvimento](../docs/DEVELOPMENT.md)
- [Configuracao de servicos e credenciais](../docs/CONFIGURATION.md)
- [API web](../docs/WEB_API.md)
- [Pendencias](../docs/OPEN_ITEMS.md)

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sem Supabase configurado, paginas publicas funcionam e auth permanece desabilitada. Consulte [CONFIGURATION.md](../docs/CONFIGURATION.md) para migrations, redirects, SMTP, GitHub OAuth, Stripe, R2 e variaveis de deploy.

## Validacao

```bash
npm test
npm run lint
npm run build
```

O backend de sync armazena somente envelope AES-256-GCM opaco. Transporte, conflito visual e restauracao no desktop continuam pendentes.
