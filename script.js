/* =========================================================
   DADOS BRUTOS (fictícios) — 8º Ano
   Notas em formatos diferentes de propósito, para treinar
   a normalização. Faltas dos 3 trimestres (3º = 0).
   ========================================================= */
const disciplinas = [
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
   FUNÇÃO: normalizarNota
   Converte qualquer nota para a escala 0 a 10.
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
   PREENCHER A TABELA
   ========================================================= */
function preencherTabela() {
  const corpo = document.getElementById("corpoTabela");

  disciplinas.forEach((d) => {
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
    linha.innerHTML = `
      <td>${d.disciplina}</td>
      <td>${formatarNota(n1)}</td>
      <td>${formatarNota(n2)}</td>
      <td>${formatarNota(n3)}</td>
      <td>${media !== null ? formatarNota(media) : "—"}</td>
      <td>${totalFaltas}</td>
      <td class="${classeSituacao}">${situacao}</td>
    `;
    corpo.appendChild(linha);
  });
}

/* =========================================================
   PREENCHER OS CARDS DE RESUMO
   ========================================================= */
function preencherCards() {
  const container = document.getElementById("cardsResumo");

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
  // No futuro será tratada de outra forma (não calculada a partir das faltas).
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
    div.innerHTML = `
      <h3>${c.titulo}</h3>
      <div class="valor">${c.valor}</div>
      <div class="detalhe">${c.detalhe}</div>
    `;
    container.appendChild(div);
  });
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  preencherCards();
  preencherTabela();
});