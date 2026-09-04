const NOME_ABA = 'Atendimentos';

const DEMANDAS = [
  'documentacao',
  'refugio',
  'trabalho',
  'saude',
  'assistencia',
  'educacao',
  'diploma',
  'juridico',
  'moradia',
  'outro'
];

const CABECALHO = [
  'Data e hora',
  'ID',
  'Nome / identificação',
  'País de origem',
  'Idioma principal',
  'Estado civil',
  'Contato',
  'Responsável pelo acolhimento',
  'Situação documental',
  'Documentação',
  'Refúgio / Residência',
  'Trabalho',
  'Saúde',
  'Assistência social',
  'Educação',
  'Diploma / Formação',
  'Jurídico',
  'Moradia',
  'Outro',
  'Detalhamento das demandas',
  'Observações',
  'Origem'
];

function setup() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(NOME_ABA);

  if (!aba) {
    aba = planilha.insertSheet(NOME_ABA);
  }

  if (aba.getLastRow() === 0) {
    aba.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]);
    aba.setFrozenRows(1);
  }

  return health_();
}

function doGet() {
  try {
    return json_(health_());
  } catch (erro) {
    return json_({
      status: 'erro',
      dataHora: new Date().toISOString(),
      mensagem: erro.message
    });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const dados = e && e.parameter ? e.parameter : {};
    const nome = limpar_(dados.nome);
    const pais = limpar_(dados.pais_origem);
    const idioma = limpar_(dados.idioma_principal);
    const estadoCivil = limpar_(dados.estado_civil);
    const situacaoDocumental = limpar_(dados.situacao_documental);

    if (!nome) throw new Error('Nome / identificação não informado.');
    if (!pais) throw new Error('País de origem não informado.');
    if (!idioma) throw new Error('Idioma principal não informado.');
    if (!estadoCivil) throw new Error('Estado civil não informado.');
    if (!situacaoDocumental) throw new Error('Situação documental não informada.');

    const demandas = parseArray_(dados.demandas_json)
      .filter(id => DEMANDAS.includes(id));

    if (demandas.length === 0) {
      throw new Error('Nenhuma demanda válida foi informada.');
    }

    const detalhes = parseObject_(dados.detalhes_json);
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    let aba = planilha.getSheetByName(NOME_ABA);

    if (!aba) {
      setup();
      aba = planilha.getSheetByName(NOME_ABA);
    }

    if (!aba) throw new Error(`A aba "${NOME_ABA}" não foi encontrada.`);

    const id = Utilities.getUuid();
    const flags = DEMANDAS.map(d => demandas.includes(d) ? 'SIM' : '');

    aba.appendRow([
      new Date(),
      id,
      nome,
      pais,
      idioma,
      estadoCivil,
      limpar_(dados.contato),
      limpar_(dados.atendente),
      situacaoDocumental,
      ...flags,
      limpar_(detalhesParaTexto_(detalhes)),
      limpar_(dados.observacoes),
      limpar_(dados.origem)
    ]);

    return json_({
      sucesso: true,
      id,
      gravadoEm: new Date().toISOString()
    });

  } catch (erro) {
    return json_({
      sucesso: false,
      erro: erro.message
    });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function health_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName(NOME_ABA);

  return {
    status: aba ? 'ok' : 'erro',
    servico: 'Acolhe Up — registros',
    dataHora: new Date().toISOString(),
    planilhaAcessivel: true,
    aba: {
      nome: NOME_ABA,
      encontrada: Boolean(aba)
    }
  };
}

function parseArray_(valor) {
  try {
    const parsed = JSON.parse(String(valor || '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function parseObject_(valor) {
  try {
    const parsed = JSON.parse(String(valor || '{}'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (_) {
    return {};
  }
}

function detalhesParaTexto_(detalhes) {
  return Object.keys(detalhes)
    .sort()
    .map(chave => `${chave}: ${String(detalhes[chave] || '').trim()}`.trim())
    .filter(linha => !linha.endsWith(':'))
    .join(' | ');
}

function limpar_(valor) {
  const texto = String(valor || '').trim();

  if (/^[=+\-@]/.test(texto)) {
    return "'" + texto;
  }

  return texto;
}

function json_(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
