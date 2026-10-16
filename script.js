/* =========================================================
   CONFIGURAÇÃO FIXA DO ALUNO
   ========================================================= */
const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 4,
  apiUrl: "https://boletim-api.profbt.com.br"
};

/* =========================================================
   DADOS BRUTOS (fictícios) — 8º Ano
   Notas em formatos diferentes de propósito, para treinar
   a normalização. Faltas dos 3 trimestres (3º = 0).
   ========================================================= */
const disciplinasLocais = [
  { disciplina: "Língua Portuguesa", tri1: 8.8, tri2: "8,1", tri3: null, faltas: [4, 9, 0] },
  { disciplina: "Matemática", tri1: 8.5, tri2: "8,3", tri3: null, faltas: [4, 13, 0] },
  { disciplina: "Ciências", tri1: 9.1, tri2: "10,0", tri3: null, faltas: [4, 6, 0] },
  { disciplina: "História", tri1: 7.8, tri2: "7,8", tri3: null, faltas: [5, 7, 0] },
  { disciplina: "Geografia", tri1: 7.3, tri2: "7,9", tri3: null, faltas: [0, 9, 0] },
  { disciplina: "Língua Inglesa", tri1: 9.3, tri2: "10,0", tri3: null, faltas: [4, 5, 0] },
  { disciplina: "Arte", tri1: 7.4, tri2: "8,4", tri3: null, faltas: [1, 7, 0] },
  { disciplina: "Educação Física", tri1: 10.0, tri2: "9,0", tri3: null, faltas: [2, 5, 0] },
  { disciplina: "Educação Digital", tri1: 10.0, tri2: "10,0", tri3: null, faltas: [3, 4, 0] },
  { disciplina: "Educação Financeira", tri1: 10.0, tri2: "10,0", tri3: null, faltas: [3, 8, 0] },
  { disciplina: "Estudo Orientado", tri1: 7.8, tri2: "9,2", tri3: null, faltas: [2, 6, 0] },
  { disciplina: "Redação e Leitura", tri1: 8.7, tri2: "8,7", tri3: null, faltas: [0, 6, 0] },
  { disciplina: "Pensamento Lógico", tri1: 10.0, tri2: "10,0", tri3: null, faltas: [1, 4, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: 7.9, tri2: "8,1", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Práticas Experimentais", tri1: 8.0, tri2: "10,0", tri3: null, faltas: [0, 4, 0] }
];

/* =========================================================
   ESTADO DA APLICAÇÃO
   ========================================================= */
let pinSessao = null;
let disciplinas = [];
let modoEdicao = false;

/* =========================================================
   FUNÇÃO: normalizarNota
   Converte qualquer nota para a escala 0 a 10.
   (Mantida para os DADOS ANTIGOS — aceita 75, 82, "8,5" etc.)
   ========================================================= */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let numero = valor;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  }

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  } else if (numero > 10 && numero <= 100) {
    return numero / 10;
  } else {
    return null;
  }
}

/* =========================================================
   FUNÇÃO: validarNotaEditor
   Regra DIFERENTE do normalizarNota. Aceita somente:
   - número entre 0 e 10 (ponto ou vírgula decimal)
   - vazio (vira null)
   Retorna { ok: true, valor: number|null } ou { ok: false }.
   ========================================================= */
function validarNotaEditor(texto) {
  const limpo = String(texto).trim();

  if (limpo === "") {
    return { ok: true, valor: null };
  }

  if (!/^\d+([.,]\d+)?$/.test(limpo)) {
    return { ok: false };
  }

  const numero = parseFloat(limpo.replace(",", "."));

  if (isNaN(numero) || numero < 0 || numero > 10) {
    return { ok: false };
  }

  return { ok: true, valor: numero };
}

/* =========================================================
   FUNÇÃO: validarFaltasEditor
   Aceita somente inteiro >= 0. Vazio é inválido.
   ========================================================= */
function validarFaltasEditor(texto) {
  const limpo = String(texto).trim();

  if (!/^\d+$/.test(limpo)) {
    return { ok: false };
  }

  const numero = parseInt(limpo, 10);

  if (isNaN(numero) || numero < 0) {
    return { ok: false };
  }

  return { ok: true, valor: numero };
}

/* =========================================================
   FUNÇÃO: calcularMedia
   Média usando SOMENTE as notas disponíveis.
   ========================================================= */
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);

  if (validas.length === 0) {
    return null;
  }

  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

/* =========================================================
   FUNÇÃO: definirSituacao
   ========================================================= */
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= 6.0) {
    return "Bom desempenho";
  }
  return "Atenção";
}

/* =========================================================
   FUNÇÃO: formatarNota
   ========================================================= */
function formatarNota(nota) {
  if (nota === null) {
    return "Ainda não lançada";
  }
  return nota.toFixed(1).replace(".", ",");
}

/* =========================================================
   FUNÇÃO: somarFaltas
   ========================================================= */
function somarFaltas(faltas) {
  return faltas.reduce((acc, f) => acc + f, 0);
}

/* =========================================================
   FUNÇÃO: limparTabela
   ========================================================= */
function limparTabela() {
  const corpo = document.getElementById("corpoTabela");
  corpo.innerHTML = "";
}

/* =========================================================
   FUNÇÃO: limparCards
   ========================================================= */
function limparCards() {
  const container = document.getElementById("cardsResumo");
  container.innerHTML = "";
}

/* =========================================================
   PREENCHER A TABELA
   ========================================================= */
function preencherTabela() {
  const corpo = document.getElementById("corpoTabela");
  limparTabela();

  disciplinas.forEach((d, indice) => {
    const n1 = normalizarNota(d.tri1);
    const n2 = normalizarNota(d.tri2);
    const n3 = normalizarNota(d.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const totalFaltas = somarFaltas(d.faltas);
    const situacao = definirSituacao(media);

    let classeSituacao = "situacao-sem-nota";
    if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (situacao === "Atenção") classeSituacao = "situacao-atencao";

    const linha = document.createElement("tr");

    // Coluna: Disciplina (nunca editável)
    const tdNome = document.createElement("td");
    tdNome.textContent = d.disciplina;
    linha.appendChild(tdNome);

    // Colunas: notas (editáveis no modo edição)
    const valoresNotas = [d.tri1, d.tri2, d.tri3];
    for (let i = 0; i < 3; i++) {
      const td = document.createElement("td");
      if (modoEdicao) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "campo-edicao";
        input.dataset.indice = indice;
        input.dataset.tipo = "nota";
        input.dataset.trimestre = i;
        const valorAtual = normalizarNota(valoresNotas[i]);
        input.value = valorAtual !== null
          ? valorAtual.toFixed(1).replace(".", ",")
          : "";
        td.appendChild(input);
      } else {
        td.textContent = formatarNota(n1 && i === 0 ? n1 : i === 1 ? n2 : i === 2 ? n3 : null);
      }
      linha.appendChild(td);
    }

    // Coluna: Média (nunca editável)
    const tdMedia = document.createElement("td");
    tdMedia.textContent = media !== null ? formatarNota(media) : "—";
    linha.appendChild(tdMedia);

    // Coluna: Faltas (editável — soma dos 3 trimestres)
    const tdFaltas = document.createElement("td");
    if (modoEdicao) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "campo-edicao";
      input.dataset.indice = indice;
      input.dataset.tipo = "faltas";
      input.value = String(somarFaltas(d.faltas));
      tdFaltas.appendChild(input);
    } else {
      tdFaltas.textContent = String(totalFaltas);
    }
    linha.appendChild(tdFaltas);

    // Coluna: Situação (nunca editável)
    const tdSituacao = document.createElement("td");
    tdSituacao.className = classeSituacao;
    tdSituacao.textContent = situacao;
    linha.appendChild(tdSituacao);

    corpo.appendChild(linha);
  });
}

/* =========================================================
   PREENCHER OS CARDS DE RESUMO
   ========================================================= */
function preencherCards() {
  const container = document.getElementById("cardsResumo");
  limparCards();

  const medias = [];
  let totalFaltas = 0;
  let bons = 0;
  let atencao = 0;

  disciplinas.forEach((d) => {
    const n1 = normalizarNota(d.tri1);
    const n2 = normalizarNota(d.tri2);
    const n3 = normalizarNota(d.tri3);
    const media = calcularMedia([n1, n2, n3]);

    if (media !== null) {
      medias.push(media);
      if (media >= 6.0) bons++;
      else atencao++;
    }

    totalFaltas += somarFaltas(d.faltas);
  });

  const mediaGeral =
    medias.length > 0
      ? medias.reduce((acc, m) => acc + m, 0) / medias.length
      : null;

  // Frequência FICTÍCIA — apenas demonstrativa.
  const frequenciaDemonstrativa = 92;

  const cards = [
    {
      titulo: "Média Geral",
      valor: mediaGeral !== null ? formatarNota(mediaGeral) : "—",
      detalhe: "Escala de 0 a 10"
    },
    {
      titulo: "Total de Faltas",
      valor: totalFaltas,
      detalhe: "Somatório dos 3 trimestres"
    },
    {
      titulo: "Bom Desempenho",
      valor: bons,
      detalhe: "Disciplinas com média ≥ 6,0"
    },
    {
      titulo: "Precisam de Atenção",
      valor: atencao,
      detalhe: "Disciplinas com média < 6,0"
    },
    {
      titulo: "Frequência",
      valor: frequenciaDemonstrativa + "%",
      detalhe: "Frequência adequada"
    }
  ];

  cards.forEach((c) => {
    const div = document.createElement("div");
    div.className = "card";

    const h3 = document.createElement("h3");
    h3.textContent = c.titulo;

    const valor = document.createElement("div");
    valor.className = "valor";
    valor.textContent = c.valor;

    const detalhe = document.createElement("div");
    detalhe.className = "detalhe";
    detalhe.textContent = c.detalhe;

    div.appendChild(h3);
    div.appendChild(valor);
    div.appendChild(detalhe);

    container.appendChild(div);
  });
}

/* =========================================================
   FUNÇÃO: renderizar
   Atualiza tabela e cards juntos.
   ========================================================= */
function renderizar() {
  preencherCards();
  preencherTabela();
}

/* =========================================================
   LOGIN (PIN)
   ========================================================= */
async function entrarComPin() {
  const campoPin = document.getElementById("campoPin");
  const botaoEntrar = document.getElementById("botaoEntrar");
  const status = document.getElementById("statusAcesso");

  const pin = campoPin.value.trim();

  if (pin === "") {
    status.textContent = "Digite seu PIN.";
    status.className = "acesso-status";
    return;
  }

  status.textContent = "Conectando...";
  status.className = "acesso-status";
  botaoEntrar.disabled = true;

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pin
      })
    });

    if (resposta.status === 401) {
      status.textContent = "Turma, chamada ou PIN inválidos.";
      status.className = "acesso-status";
      botaoEntrar.disabled = false;
      return;
    }

    if (resposta.status === 429) {
      status.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      status.className = "acesso-status";
      botaoEntrar.disabled = false;
      return;
    }

    if (!resposta.ok) {
      status.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      status.className = "acesso-status";
      botaoEntrar.disabled = false;
      return;
    }

    const json = await resposta.json();

    // Guarda o PIN somente em memória
    pinSessao = pin;

    // Decide a fonte dos dados
    if (json.dados !== null && json.dados !== undefined) {
      // DADOS DA API > DADOS LOCAIS
      if (Array.isArray(json.dados.disciplinas)) {
        disciplinas = json.dados.disciplinas.map((d) => ({
          disciplina: d.disciplina,
          tri1: d.tri1 !== undefined ? d.tri1 : null,
          tri2: d.tri2 !== undefined ? d.tri2 : null,
          tri3: d.tri3 !== undefined ? d.tri3 : null,
          faltas: Array.isArray(d.faltas) ? d.faltas : [0, 0, 0]
        }));
      } else {
        disciplinas = disciplinasLocais.map((d) => ({
          disciplina: d.disciplina,
          tri1: d.tri1,
          tri2: d.tri2,
          tri3: d.tri3,
          faltas: d.faltas.slice()
        }));
      }
    } else {
      // Sem dados salvos — usa os dados fictícios locais
      disciplinas = disciplinasLocais.map((d) => ({
        disciplina: d.disciplina,
        tri1: d.tri1,
        tri2: d.tri2,
        tri3: d.tri3,
        faltas: d.faltas.slice()
      }));
    }

    // Limpa o campo do PIN após login
    campoPin.value = "";
    status.textContent = "";
    status.className = "acesso-status ok";

    // Mostra o boletim e esconde a tela de acesso
    document.getElementById("areaAcesso").hidden = true;
    document.getElementById("areaBoletim").hidden = false;
    document.getElementById("areaAlterar").hidden = false;
    document.getElementById("areaControles").hidden = true;

    renderizar();
  } catch (erro) {
    status.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    status.className = "acesso-status";
    botaoEntrar.disabled = false;
  }
}

/* =========================================================
   MODO DE EDIÇÃO
   ========================================================= */
function ativarEdicao() {
  modoEdicao = true;
  document.getElementById("areaControles").hidden = false;
  document.getElementById("areaAlterar").hidden = true;
  document.getElementById("statusEdicao").textContent = "";
  document.getElementById("statusEdicao").className = "edicao-status";
  renderizar();
}

function cancelarEdicao() {
  modoEdicao = false;
  // Restaura os dados do último estado confirmado
  // (recarrega do estado atual em memória, que não foi alterado)
  document.getElementById("areaControles").hidden = true;
  document.getElementById("areaAlterar").hidden = false;
  document.getElementById("statusEdicao").textContent = "";
  document.getElementById("statusEdicao").className = "edicao-status";
  renderizar();
}

/* =========================================================
   SALVAR ALTERAÇÕES
   ========================================================= */
async function salvarAlteracoes() {
  const status = document.getElementById("statusEdicao");
  const botaoSalvar = document.getElementById("botaoSalvar");
  const botaoCancelar = document.getElementById("botaoCancelar");

  const inputs = document.querySelectorAll("td input.campo-edicao");

  // Valida tudo ANTES de mexer nos dados
  const novosDados = disciplinas.map((d) => ({
    disciplina: d.disciplina,
    tri1: d.tri1,
    tri2: d.tri2,
    tri3: d.tri3,
    faltas: d.faltas.slice()
  }));

  let houveErro = false;

  inputs.forEach((input) => {
    input.classList.remove("invalido");
  });

  inputs.forEach((input) => {
    const indice = parseInt(input.dataset.indice, 10);
    const tipo = input.dataset.tipo;

    if (tipo === "nota") {
      const tri = parseInt(input.dataset.trimestre, 10);
      const resultado = validarNotaEditor(input.value);
      if (!resultado.ok) {
        input.classList.add("invalido");
        houveErro = true;
        return;
      }
      if (tri === 0) novosDados[indice].tri1 = resultado.valor;
      if (tri === 1) novosDados[indice].tri2 = resultado.valor;
      if (tri === 2) novosDados[indice].tri3 = resultado.valor;
    } else if (tipo === "faltas") {
      const resultado = validarFaltasEditor(input.value);
      if (!resultado.ok) {
        input.classList.add("invalido");
        houveErro = true;
        return;
      }
      const outros = novosDados[indice].faltas[0] + novosDados[indice].faltas[1];
      // A edição mostra a SOMA; guardamos o restante no 1º tri para preservar a soma.
      const f1 = resultado.valor;
      novosDados[indice].faltas = [f1, 0, 0];
    }
  });

  if (houveErro) {
    status.textContent = "Há campos inválidos. Corrija antes de salvar.";
    status.className = "edicao-status";
    return;
  }

  status.textContent = "Salvando...";
  status.className = "edicao-status";
  botaoSalvar.disabled = true;
  botaoCancelar.disabled = true;

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novosDados.map((d) => ({
            disciplina: d.disciplina,
            tri1: d.tri1,
            tri2: d.tri2,
            tri3: d.tri3,
            faltas: d.faltas
          }))
        }
      })
    });

    if (!resposta.ok) {
      status.textContent = "Não foi possível salvar. Tente novamente.";
      status.className = "edicao-status";
      botaoSalvar.disabled = false;
      botaoCancelar.disabled = false;
      return;
    }

    // Sucesso: aplica as mudanças
    disciplinas = novosDados;
    modoEdicao = false;

    status.textContent = "Dados salvos com sucesso.";
    status.className = "edicao-status ok";

    document.getElementById("areaControles").hidden = true;
    document.getElementById("areaAlterar").hidden = false;

    renderizar();
  } catch (erro) {
    status.textContent = "Não foi possível salvar. Tente novamente.";
    status.className = "edicao-status";
    botaoSalvar.disabled = false;
    botaoCancelar.disabled = false;
  }
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("botaoEntrar").addEventListener("click", entrarComPin);
  document.getElementById("botaoAlterar").addEventListener("click", ativarEdicao);
  document.getElementById("botaoSalvar").addEventListener("click", salvarAlteracoes);
  document.getElementById("botaoCancelar").addEventListener("click", cancelarEdicao);

  document.getElementById("campoPin").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      entrarComPin();
    }
  });
});