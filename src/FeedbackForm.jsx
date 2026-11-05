import { useState } from 'react';
import './FeedbackForm.css';
import hero from "./assets/17.png";

// URL do app da web do Apps Script, definida no arquivo .env
const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

function FeedbackForm() {
  // Um estado para cada campo, iniciando com string vazia
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [comentario, setComentario] = useState('');
  // Estado extra: impede cliques repetidos enquanto envia
  const [enviando, setEnviando] = useState(false);

  const handleNomeChange = (e) => {
    setNome(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleComentarioChange = (e) => {
    setComentario(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // evita recarregar a página

    if (!nome.trim() || !email.trim() || !comentario.trim()) {
      alert('Preencha todos os campos!');
      return;
    }

    if (!API_URL) {
      alert('URL do Apps Script não configurada. Confira o arquivo .env.');
      return;
    }

    setEnviando(true);

        try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        // text/plain evita a checagem prévia (preflight) que o Apps Script não aceita
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ nome, email, comentario }),
      });

      if (!resposta.ok) {
        alert('O servidor respondeu com erro. Tente novamente mais tarde.');
        return;
      }

      // Lê como texto primeiro: se vier uma página HTML (ex.: implantação restrita),
      // o JSON.parse falha e mostramos uma mensagem mais clara.
      const texto = await resposta.text();
      let resultado;
      try {
        resultado = JSON.parse(texto);
      } catch {
        alert('Resposta inesperada do Apps Script. Confira se a implantação está como "Qualquer pessoa".');
        return;
      }

      if (!resultado.ok) {
        alert(resultado.erro || 'Erro ao salvar o feedback.');
        return;
      }

      alert(
        `Feedback salvo!\n\nNome: ${nome}\nEmail: ${email}\nComentário: ${comentario}`
      );

      setNome('');
      setEmail('');
      setComentario('');
    } catch {
      alert('Não foi possível enviar. Verifique sua conexão e tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
    <img src={hero} alt="" />
      <h2>Deixe seu feedback</h2>

      <div className="campo">
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite aqui seu nome"
          value={nome}
          onChange={handleNomeChange}
        />
      </div>

      <div className="campo">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Agora informe seu e-mail"
          value={email}
          onChange={handleEmailChange}
        />
      </div>

      <div className="campo">
        <label htmlFor="comentario">Comentário</label>
        <textarea
          id="comentario"
          rows="5"
          placeholder="Escreva aqui o que você achou"
          value={comentario}
          onChange={handleComentarioChange}
        />
      </div>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}

export default FeedbackForm;
