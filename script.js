/* =========================================================
   DADOS BRUTOS (fictícios) — 8º Ano
   Aqui os valores vêm em formatos diferentes de propósito,
   para treinarmos a normalização.
   ========================================================= */
const disciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

/* =========================================================
   FUNÇÃO: normalizarNota
   Converte qualquer nota para a escala 0 a 10.
   Regras:
   - vazio / null / undefined  -> null (nota ainda não lançada)
   - entre 0 e 10              -> mantém igual
   - maior que 10 e até 100    -> divide por 10
   - aceita ponto e vírgula    -> troca "," por "."
   - valores inválidos         -> null (não entram na média)
   ========================================================= */
function normalizarNota(valor) {
  // Verifica se está vazio, null ou undefined
  if (valor === null || valor === undefined || valor === "") {
    return null; // nota ainda não lançada
  }

  // Se for texto, troca vírgula por ponto
  let numero = valor;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  }

  // Se não for um número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Aplica as regras de escala
  if (numero >= 0 && numero <= 10) {
    return numero; // já está na escala 0–10
  } else if (numero > 10 && numero <= 100) {
    return numero / 10; // converte para 0–10 (ex.: 82 -> 8.2)
  } else {
    return null; // fora das regras = inválido
  }
}

/* =========================================================
   FUNÇÃO: calcularMedia
   Calcula a média usando SOMENTE as notas disponíveis.
   Nota ausente NUNCA vira zero.
   ========================================================= */
function calcularMedia(notas) {
  // Filtra só as notas válidas (que não são null)
  const validas = notas.filter((n) => n !== null);

  // Se não houver nenhuma nota, não há média
  if (validas.length === 0) {
    return null;
  }

  // Soma todas e divide pela quantidade
  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

/* =========================================================
   FUNÇÃO: definirSituacao
   Define a situação com base na média disponível.
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
   Mostra a nota com 1 casa decimal ou "—" se não houver.
   ========================================================= */
function formatarNota(nota) {
  if (nota === null) {
    return "Ainda não lançada";
  }
  return nota.toFixed(1).replace(".", ",");
}

/* =========================================================
   FUNÇÃO: somarFaltas
   Soma as faltas dos três trimestres.
   ========================================================= */
function somarFaltas(faltas) {
  return faltas.reduce((acc, f) => acc + f, 0);
}

/* =========================================================
   PREENCHER A TABELA
   Percorre cada disciplina, normaliza, calcula e cria a linha.
   ========================================================= */
function preencherTabela() {
  const corpo = document.getElementById("corpoTabela");

  disciplinas.forEach((d) => {
    // Normaliza as três notas
    const n1 = normalizarNota(d.tri1);
    const n2 = normalizarNota(d.tri2);
    const n3 = normalizarNota(d.tri3);

    // Calcula a média apenas com as notas disponíveis
    const media = calcularMedia([n1, n2, n3]);

    // Soma as faltas
    const totalFaltas = somarFaltas(d.faltas);

    // Define a situação
    const situacao = definirSituacao(media);

    // Define a classe CSS da situação
    let classeSituacao = "situacao-sem-nota";
    if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (situacao === "Atenção") classeSituacao = "situacao-atencao";

    // Cria a linha da tabela
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
   Calcula média geral, total de faltas, bons desempenhos, etc.
   ========================================================= */
function preencherCards() {
  const container = document.getElementById("cardsResumo");

  // Vamos juntar as médias de cada disciplina
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

  // Média geral (somente das disciplinas com nota)
  const mediaGeral =
    medias.length > 0
      ? medias.reduce((acc, m) => acc + m, 0) / medias.length
      : null;

  // Frequência FICTÍCIA — apenas demonstrativa.
  // No futuro será tratada de outra forma (não calculada a partir das faltas).
  const frequenciaDemonstrativa = 92;

  // Monta os cards
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

  // Cria cada card no HTML
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
   Executa as funções quando a página terminar de carregar.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  preencherCards();
  preencherTabela();
});