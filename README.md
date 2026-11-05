# Feedback App

Formulário de feedback feito com React que salva as respostas em uma planilha do Google Sheets, usando o Google Apps Script como backend. Não precisa de servidor próprio nem de banco de dados.

## Como funciona

1. A pessoa preenche nome, email e comentário no formulário.
2. O React envia os dados (`POST`) para um app da web publicado no Google Apps Script.
3. O Apps Script valida os campos e grava uma nova linha na aba **Feedbacks** da planilha.

## Tecnologias

- [React 18](https://react.dev/) com hooks (`useState`)
- [Vite](https://vitejs.dev/)
- Google Apps Script + Google Sheets

## Estrutura do projeto

```
feedback-app/
├── apps-script/
│   └── Code.gs            # Backend (colar no Apps Script)
├── public/
│   └── favicon.svg        # Ícone da aba do navegador
├── src/
│   ├── assets/            # Imagens
│   ├── App.jsx
│   ├── FeedbackForm.jsx   # Formulário e envio dos dados
│   ├── FeedbackForm.css
│   ├── index.css
│   └── main.jsx           # Ponto de entrada
├── .env.example           # Modelo das variáveis de ambiente
├── index.html
├── package.json
└── vite.config.js
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Uma conta Google

## Configuração

### 1. Criar o backend no Google

1. Crie uma planilha nova em [sheets.google.com](https://sheets.google.com).
2. Clique em **Extensões > Apps Script**.
3. Apague o código padrão e cole o conteúdo de `apps-script/Code.gs`. Salve com **Ctrl+S**.
4. Clique em **Implantar > Nova implantação** e escolha o tipo **App da Web**.
5. Configure:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
6. Clique em **Implantar** e autorize o acesso. Se aparecer "app não verificado", clique em **Avançado > Acessar (nome do projeto) > Permitir**.
7. Copie a **URL do app da web** (termina em `/exec`).

Para testar, abra a URL no navegador. Deve aparecer:

```json
{"ok":true,"mensagem":"API de feedback ativa."}
```

### 2. Configurar o front-end

Copie o arquivo de exemplo e cole a URL copiada:

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
copy .env.example .env
```

Edite o `.env`:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec
```

> Use a URL sem aspas e sem espaços.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

Sempre que alterar o `.env`, pare o servidor (**Ctrl+C**) e rode `npm run dev` de novo. O Vite só lê esse arquivo ao iniciar.

## Gerar versão de produção

```bash
npm run build
npm run preview   # opcional: testa a versão gerada localmente
```

Os arquivos finais ficam na pasta `dist/`. Se for publicar em um serviço como Netlify ou Vercel, cadastre a variável `VITE_APPS_SCRIPT_URL` nas configurações do serviço, porque o `.env` não é enviado ao repositório.

## Validações

- **Front-end:** nenhum campo pode ficar vazio, e o botão é bloqueado durante o envio para evitar cliques repetidos.
- **Apps Script:** campos obrigatórios, formato de email válido, limite de tamanho (nome 100, email 150 e comentário 2000 caracteres) e proteção contra fórmulas (textos que começam com `=`, `+`, `-` ou `@` são tratados como texto na planilha).
- O envio usa `LockService`, o que evita problemas quando duas pessoas enviam ao mesmo tempo.

## Atualizando o backend

Depois de alterar o `Code.gs`, a URL antiga **não** reflete a mudança sozinha. No Apps Script, vá em **Implantar > Gerenciar implantações**, edite a implantação e escolha **Nova versão**. Assim a URL continua a mesma.

## Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| "URL do Apps Script não configurada" | `.env` ausente ou com o valor de exemplo | Cole a URL real e reinicie o `npm run dev` |
| "Resposta inesperada do Apps Script" | Implantação restrita (pede login do Google) | Mude **Quem pode acessar** para **Qualquer pessoa** e salve uma nova versão |
| "Não foi possível enviar" | Sem internet ou URL incorreta | Confira a conexão e se a URL termina em `/exec` |
| Dados não aparecem na planilha | Script criado fora da planilha | Crie o script por **Extensões > Apps Script** dentro da planilha desejada |
| Favicon não muda | Cache do navegador | Recarregue com **Ctrl+Shift+R** ou use uma aba anônima |

## Segurança

- O arquivo `.env` está no `.gitignore` e **não deve ser enviado ao GitHub**.
- A URL do Apps Script permite que qualquer pessoa que a conheça envie respostas para a sua planilha. Não é necessário escondê-la do navegador (ela aparece no código final do site), mas evite divulgá-la fora do uso do formulário.

## Licença

Projeto de uso pessoal.