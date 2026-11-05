# feedback-app

Formulário de feedback em React (useState) que salva as respostas em uma planilha Google via Apps Script.

## Rodar

1. Publique o `apps-script/Code.gs` como app da web (veja as instruções na conversa).
2. Copie `.env.example` para `.env` e cole a URL do app da web.
3. Rode:

```
npm install
npm run dev
```

Reinicie o `npm run dev` sempre que mudar o `.env`.
