# Acolhe Up

Microssistema mobile-first para registro presencial de atendimentos em uma ação de acolhimento de pessoas migrantes.

## Escopo atual

O produto foi deliberadamente reduzido a uma única função operacional:

**registrar um novo atendimento e encaminhá-lo para uma base central.**

A equipe não consulta, edita ou acompanha casos pelo site. A gestão posterior ocorre no Google Sheets.

## Arquitetura

```text
Equipe de acolhimento
        ↓
index.html
        ↓
Google Apps Script
        ↓
Google Sheets
```

O site é um único arquivo HTML com CSS e JavaScript embutidos. Não há React, router, build ou dependências necessárias para administrar a interface publicada.

O Apps Script é a camada mínima de gravação. O Google Sheets é a base operacional.

## Fluxo da interface

### 01 — Identificação

- Nome / identificação
- País de origem — lista controlada
- Idioma principal — lista controlada
- Estado civil — lista controlada
- Contato — opcional
- Responsável pelo acolhimento — opcional
- Situação documental — lista controlada

### 02 — Demandas

Seleção múltipla:

- Documentação
- Refúgio / Residência
- Trabalho
- Saúde
- Assistência social
- Educação
- Diploma / Formação
- Jurídico
- Moradia
- Outro

Cada demanda revela apenas as perguntas complementares relacionadas a ela.

### 03 — Finalização

- Observações breves — opcional
- Revisão dos dados essenciais
- Registro

Após o envio, a interface oferece apenas a ação **Novo atendimento**.

## Estrutura da planilha

A aba principal chama-se `Atendimentos`.

Cada linha representa um atendimento e contém:

- data e hora;
- ID único;
- identificação;
- país de origem;
- idioma;
- estado civil;
- contato;
- atendente;
- situação documental;
- uma coluna SIM/vazia para cada demanda;
- detalhamento das demandas;
- observações;
- versão/origem do formulário.

A estrutura por colunas binárias para as demandas facilita contagem, filtros, tabelas dinâmicas e uma futura visão geral diretamente no Google Sheets.

## Configuração do Google Apps Script

1. Crie uma planilha Google.
2. Abra **Extensões → Apps Script**.
3. Cole o conteúdo de `Code.gs`.
4. Execute `setup()` uma vez e autorize o script.
5. Confirme a criação da aba `Atendimentos` e do cabeçalho.
6. Implante como **Aplicativo da Web**.
7. Use a URL pública terminada em `/exec`.
8. No `index.html`, localize:

```javascript
var APPS_SCRIPT_URL = '';
```

9. Cole a URL `/exec` entre as aspas.
10. Publique o HTML.

## Health check

Abrir a URL `/exec` no navegador deve retornar JSON semelhante a:

```json
{
  "status": "ok",
  "servico": "Acolhe Up — registros",
  "planilhaAcessivel": true,
  "aba": {
    "nome": "Atendimentos",
    "encontrada": true
  }
}
```

## Segurança e minimização

O Apps Script:

- valida campos essenciais;
- rejeita registros sem demanda;
- aceita apenas as dez demandas previstas;
- usa `LockService` para reduzir colisões de escrita;
- neutraliza valores iniciados por caracteres que poderiam ser interpretados como fórmulas pelo Google Sheets.

A interface orienta a equipe a registrar somente informações necessárias ao acolhimento.

## Publicação

O GitHub Pages publica diretamente o `index.html`. Não é necessário instalar dependências nem executar build.

O arquivo operacional da interface é:

```text
index.html
```

A camada de gravação é:

```text
Code.gs
```

## Estado do código anterior

A estrutura React/TanStack existente permanece no repositório temporariamente apenas como histórico de transição. Ela não participa da nova publicação estática e pode ser removida após validação do novo fluxo.
