// Backend do formulário de feedback.
// Cole este arquivo no Apps Script vinculado à planilha (Extensões > Apps Script).

const NOME_ABA = 'Feedbacks';
const CABECALHO = ['Data', 'Nome', 'Email', 'Comentário'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const dados = JSON.parse(e.postData.contents);
    const nome = limpar(dados.nome, 100);
    const email = limpar(dados.email, 150);
    const comentario = limpar(dados.comentario, 2000);

    if (!nome || !email || !comentario) {
      return resposta({ ok: false, erro: 'Preencha todos os campos.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return resposta({ ok: false, erro: 'Email inválido.' });
    }

    const aba = obterAba();
    aba.appendRow([new Date(), protegerFormula(nome), protegerFormula(email), protegerFormula(comentario)]);

    return resposta({ ok: true });
  } catch (erro) {
    return resposta({ ok: false, erro: 'Não foi possível salvar o feedback.' });
  } finally {
    lock.releaseLock();
  }
}

// Útil para testar no navegador: abrir a URL do app da web deve mostrar ok: true.
function doGet() {
  return resposta({ ok: true, mensagem: 'API de feedback ativa.' });
}

function obterAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(NOME_ABA);
  if (!aba) {
    aba = planilha.insertSheet(NOME_ABA);
    aba.appendRow(CABECALHO);
    aba.setFrozenRows(1);
  }
  return aba;
}

function limpar(valor, limite) {
  return String(valor || '').trim().slice(0, limite);
}

// Evita que um texto começando com = + - @ seja interpretado como fórmula na planilha.
function protegerFormula(texto) {
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function resposta(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
