# Acolher Flow

# HANDOFF — MICROSSISTEMA DE ACOLHIMENTO

## PROJETO KELVIN · v0.1

---

# 0. VISÃO DO PRODUTO

Construir um microsistema mobile-first destinado a apoiar uma ação presencial de acolhimento de pessoas migrantes.

O ponto de partida é uma necessidade simples: durante os encontros, diferentes pessoas precisam registrar informações, identificar demandas e posteriormente saber o que aconteceu com cada atendimento.

A solução deve transformar essa coleta em um fluxo mínimo de acompanhamento.

Não se trata apenas de digitalizar uma ficha.

O princípio é:

ENTRADA

→ IDENTIFICAÇÃO DA DEMANDA

→ CLASSIFICAÇÃO

→ ACOMPANHAMENTO

A ficha não deve morrer depois de preenchida.

Cada atendimento deve permanecer visível dentro de uma pequena trajetória operacional:

NOVO

→ TRIADO

→ ENCAMINHADO

→ CONCLUÍDO

---

# 1. OBJETIVO

O sistema deve permitir:

1. registrar rapidamente um atendimento;

2. identificar e estruturar as principais demandas;

3. registrar informações complementares somente quando necessárias;

4. classificar prioridade;

5. acompanhar o estado de cada atendimento;

6. consultar os atendimentos realizados;

7. enxergar, de forma agregada, o perfil das demandas encontradas.

O sistema nasce como PROTÓTIPO FUNCIONAL.

O escopo é deliberadamente pequeno.

O acabamento, porém, deve ser de produto final.

A simplicidade deve parecer uma decisão de arquitetura — não falta de tempo, desenvolvimento incompleto ou wireframe.

---

# 2. PRINCÍPIO DE DESIGN

A experiência deve transmitir:

“uma ficha de acolhimento que ganhou estrutura, continuidade e inteligência operacional”

e não:

“um formulário online”

nem:

“um software corporativo complexo”.

O impacto deve decorrer de:

- clareza;

- fluidez;

- acabamento;

- organização;

- hierarquia;

- sensação de continuidade entre registro e acompanhamento.

Não buscar impacto pela quantidade de funcionalidades.

Quando houver dúvida entre:

A. adicionar uma nova funcionalidade;

B. melhorar a experiência de uma funcionalidade existente;

escolher B.

---

# 3. ESCOPO

O sistema terá quatro superfícies principais:

00 — INÍCIO

01 — NOVO ATENDIMENTO

02 — ATENDIMENTOS

03 — VISÃO GERAL

Além delas, haverá uma tela de detalhe para cada atendimento.

Não criar outros módulos nesta versão.

---

# 4. PRIVACIDADE E DADOS

Esta versão é exclusivamente demonstrativa.

Não implementar banco de dados remoto.

Não utilizar:

- Supabase;

- Firebase;

- banco SQL remoto;

- API externa;

- autenticação;

- armazenamento em nuvem.

Utilizar localStorage.

Os registros apresentados inicialmente devem ser fictícios.

Nenhum dado real de pessoa migrante deve ser utilizado na demonstração.

Inserir discretamente no rodapé:

PROTÓTIPO · armazenamento local · não inserir dados reais

Não transformar esse aviso no centro visual da experiência.

A definição de base legal, finalidade, minimização, acesso, retenção, segurança e demais aspectos de governança de dados ocorrerá posteriormente caso o fluxo seja efetivamente adotado.

---

# 5. IDENTIDADE PROVISÓRIA

Não criar logotipo.

Não inventar nome institucional para o projeto.

Usar provisoriamente:

ACOLHIMENTO

PROJETO KELVIN · v0.1

Subtítulo:

registro e acompanhamento de demandas

“Projeto Kelvin” deve funcionar quase como uma assinatura interna do protótipo, não como branding institucional definitivo.

---

# 6. TELA INICIAL

A primeira tela deve criar imediatamente a percepção de um pequeno sistema já estruturado.

Não abrir diretamente em um formulário.

Estrutura sugerida:

ACOLHIMENTO

PROJETO KELVIN · v0.1

Registro e acompanhamento de demandas de pessoas migrantes.

Exibir abaixo quatro indicadores compactos:

12

ATENDIMENTOS

21

DEMANDAS

04

ENCAMINHADOS

02

ATENÇÃO IMEDIATA

CTA principal:

+ NOVO ATENDIMENTO

Links secundários:

ATENDIMENTOS

VISÃO GERAL

A composição deve ser editorial e limpa, sem parecer dashboard SaaS.

---

# 7. NOVO ATENDIMENTO

O preenchimento deve ocorrer em fluxo curto de três etapas.

Não exibir um formulário longo de uma vez.

Indicador superior:

01 ━━━ 02 ━━━ 03

O usuário deve conseguir registrar um atendimento em aproximadamente dois minutos.

---

# 8. ETAPA 01 — IDENTIFICAÇÃO

Título:

QUEM ESTAMOS ACOLHENDO?

Campos:

Nome / identificação

[texto]

Nacionalidade

[texto ou seletor]

Idioma principal

[texto ou seletor]

Contato

[opcional]

Responsável pelo acolhimento

[texto]

Situação documental

[seleção]

Opções:

- Documentação regular

- Em processo de regularização

- Solicitação de refúgio

- Protocolo/documento provisório

- Sem documentação regular

- Não informado

- Outro

CTA:

CONTINUAR →

---

# 9. ETAPA 02 — DEMANDAS

Título:

O QUE PRECISA DE ATENÇÃO?

Microcopy:

Selecione todas as demandas identificadas durante o acolhimento.

Utilizar grandes controles de seleção ou cards/toggles.

Categorias:

DOCUMENTAÇÃO

REFÚGIO / RESIDÊNCIA

TRABALHO

SAÚDE

ASSISTÊNCIA SOCIAL

EDUCAÇÃO

DIPLOMA / FORMAÇÃO

JURÍDICO

MORADIA

OUTRO

Permitir múltipla seleção.

Não utilizar uma cor diferente para cada categoria.

O estado selecionado deve ser muito claro por tipografia, contraste, borda e/ou preenchimento.

---

# 10. PERGUNTAS CONDICIONAIS

Quando uma demanda for selecionada, revelar suas perguntas complementares na própria etapa.

Utilizar animação curta e discreta.

Não carregar previamente perguntas que não tenham relação com as categorias escolhidas.

A lógica deve reduzir burocracia e digitação.

## DOCUMENTAÇÃO / REFÚGIO / RESIDÊNCIA

Situação principal

[texto curto]

Existe prazo ou urgência identificada?

[sim / não / não sabe]

## TRABALHO

Está trabalhando atualmente?

[sim / não]

Principal necessidade

[texto curto]

## SAÚDE

Precisa de atendimento ou orientação de acesso?

[sim / não]

Observação

[texto curto]

## ASSISTÊNCIA SOCIAL

Já possui atendimento pelo CRAS, CREAS ou outro serviço?

[sim / não / não sabe]

## EDUCAÇÃO

Nível relacionado à demanda

[básico / médio / superior / outro]

Necessidade

[texto curto]

## DIPLOMA / FORMAÇÃO

País de emissão

[texto]

Nível

[graduação / pós-graduação / outro]

Possui diploma/documentação?

[sim / parcialmente / não]

Objetivo

[revalidação / reconhecimento / informação / outro]

## JURÍDICO

Área ou problema principal

[texto curto]

Não solicitar relato jurídico extenso.

## MORADIA

Necessidade principal

[texto curto]

## OUTRO

Descrição

[texto curto]

CTA:

CONTINUAR →

---

# 11. ETAPA 03 — ACOMPANHAMENTO

Título:

COMO SEGUIMOS?

Campo:

PRIORIDADE

Opções:

NORMAL

ATENÇÃO

URGENTE

O uso de cor deve ser contido.

“Urgente” pode receber tratamento cromático específico, sem recorrer a alerta visual agressivo.

Campo:

RESPONSÁVEL

[texto]

Campo:

OBSERVAÇÕES

[textarea curta]

STATUS inicial automático:

NOVO

Estados previstos:

NOVO

TRIADO

ENCAMINHADO

CONCLUÍDO

CTA principal:

REGISTRAR ATENDIMENTO

---

# 12. CONFIRMAÇÃO DE REGISTRO

Depois do salvamento, não retornar imediatamente à lista.

Exibir uma tela de confirmação com acabamento visual.

Exemplo:

ATENDIMENTO REGISTRADO

AMARA N.

Haiti · francês

DOCUMENTAÇÃO

TRABALHO

PRIORIDADE

ATENÇÃO

STATUS

NOVO

RESPONSÁVEL

Marina

Ações:

VER ATENDIMENTO

NOVO ATENDIMENTO

A tela deve funcionar como pequena recompensa visual e confirmar que o registro agora integra um fluxo.

---

# 13. TELA — ATENDIMENTOS

Exibir todos os registros armazenados.

Adicionar busca:

BUSCAR ATENDIMENTO...

Adicionar filtros compactos:

TODOS

NOVOS

ATENÇÃO

URGENTES

ENCAMINHADOS

CONCLUÍDOS

No mobile, evitar tabela horizontal.

Utilizar linhas ou blocos de informação compactos.

Cada registro deve mostrar:

NOME / IDENTIFICAÇÃO

NACIONALIDADE

DEMANDAS

PRIORIDADE

STATUS

RESPONSÁVEL

DATA

Permitir abrir o atendimento.

Ordenação padrão:

mais recente primeiro.

---

# 14. DETALHE DO ATENDIMENTO

A tela deve apresentar o registro como um pequeno caso em acompanhamento, não como dump de formulário.

Exemplo:

AMARA N.

Haiti · francês

Atendimento em 03 set 2026

---

DEMANDAS

DOCUMENTAÇÃO

Regularização em andamento

Prazo identificado:

não

TRABALHO

Busca por oportunidade formal

---

ACOMPANHAMENTO

NOVO

→

TRIADO

→

ENCAMINHADO

→

CONCLUÍDO

Essa trajetória deve ser uma das principais assinaturas visuais do sistema.

O usuário deve conseguir alterar o status diretamente.

Permitir também alterar:

- prioridade;

- responsável;

- observações.

Não criar edição complexa dos demais campos nesta versão.

---

# 15. VISÃO GERAL

A tela deve apresentar leitura agregada da ação sem aparência de BI corporativo.

Título:

VISÃO GERAL

Indicadores:

12

ACOLHIMENTOS

21

DEMANDAS IDENTIFICADAS

04

ENCAMINHADOS

02

ATENÇÃO IMEDIATA

---

## PRINCIPAIS DEMANDAS

Apresentar barras horizontais discretas.

Exemplo:

DOCUMENTAÇÃO

████████████████ 7

TRABALHO

██████████ 5

DIPLOMA / FORMAÇÃO

██████ 3

SAÚDE

████ 2

ASSISTÊNCIA SOCIAL

████ 2

EDUCAÇÃO

██ 1

MORADIA

██ 1

JURÍDICO

██ 1

---

## SITUAÇÃO DOS ATENDIMENTOS

NOVO — 4

TRIADO — 3

ENCAMINHADO — 4

CONCLUÍDO — 1

Não criar gráficos complexos.

Preferir tipografia, números e barras simples.

---

# 16. EMPTY STATES

Desenhar estados vazios deliberadamente.

Exemplo para Atendimentos:

AINDA NÃO HÁ ATENDIMENTOS

Os registros realizados durante a ação aparecerão aqui.

+ NOVO ATENDIMENTO

Exemplo para busca sem resultado:

NENHUM ATENDIMENTO ENCONTRADO

Tente outro nome ou remova os filtros ativos.

Não deixar superfícies vazias com aparência de erro ou implementação incompleta.

---

# 17. MOCK DATA

Adicionar aproximadamente 5 a 7 registros fictícios para que o sistema possa ser demonstrado imediatamente.

Todos devem ser explicitamente dados de demonstração.

Variar:

- nacionalidade;

- idioma;

- demanda;

- prioridade;

- responsável;

- status;

- data.

Criar registros suficientemente completos para demonstrar:

- filtros;

- dashboard;

- diferentes estados;

- perguntas condicionais;

- tela de detalhe.

Não utilizar dados de pessoas reais.

---

# 18. DIREÇÃO VISUAL

A interface deve ser:

- editorial;

- institucional;

- contemporânea;

- sóbria;

- humana sem estética assistencialista;

- visualmente precisa;

- minimalista sem parecer vazia;

- profissional sem parecer corporativa.

Evitar completamente:

- estética padrão de dashboard SaaS;

- aparência default do Lovable;

- aparência default do shadcn;

- cards arredondados em excesso;

- border-radius exagerado;

- sombras volumosas;

- gradientes decorativos;

- glassmorphism;

- ilustrações stock;

- emojis;

- ícones decorativos;

- excesso de ícones Lucide;

- cores diferentes para cada categoria;

- visual de plataforma startup genérica.

A composição deve possuir personalidade própria.

---

# 19. PALETA

Background principal:

#ECECEC

Superfícies claras:

#F8F8F6

Texto principal:

#181818

Texto secundário:

cinzas neutros de contraste suficiente.

Acento principal sugerido:

#214E59

O acento deve aparecer apenas onde possuir função.

Exemplos:

- CTA;

- seleção ativa;

- progresso;

- estado atual;

- indicadores específicos.

Não espalhar a cor pela interface inteira.

“Urgente” pode possuir uma segunda cor funcional muito discreta, escolhida apenas quando necessária.

---

# 20. TIPOGRAFIA

Utilizar uma única família sans-serif de boa qualidade.

Preferência:

Geist

Alternativas:

Inter

Manrope

Evitar fontes excessivamente arredondadas.

Hierarquia tipográfica forte.

Títulos podem ser grandes e compactos.

Labels podem utilizar caixa alta, tamanho reduzido e tracking discreto.

Números do dashboard devem ter presença.

---

# 21. GEOMETRIA E ESPAÇAMENTO

Preferir:

- linhas de 1px;

- separadores;

- grandes áreas respirando;

- grids bem definidos;

- alinhamentos fortes;

- ritmo vertical consistente.

Border-radius:

aproximadamente 6px a 8px quando necessário.

Evitar radius de 16px, 20px ou 24px como linguagem predominante.

Sombras:

preferencialmente nenhuma.

Quando indispensáveis, praticamente imperceptíveis.

---

# 22. MOBILE-FIRST

Prioridade absoluta para celular.

O sistema será potencialmente utilizado:

- em pé;

- durante conversa presencial;

- com uma mão;

- em ambiente com distrações;

- por diferentes pessoas.

Portanto:

- alvos de toque grandes;

- pouca digitação;

- feedback imediato;

- controles legíveis;

- navegação previsível;

- ações principais facilmente alcançáveis.

No mobile, utilizar barra inferior ou navegação extremamente compacta contendo:

INÍCIO

ATENDIMENTOS

NOVO

VISÃO GERAL

O botão NOVO pode receber maior destaque.

No desktop, ampliar a composição naturalmente sem transformar o sistema em outro produto.

---

# 23. MICROINTERAÇÕES

Implementar acabamento completo.

Incluir:

- hover;

- focus;

- pressed;

- disabled;

- feedback de seleção;

- transições discretas;

- confirmação de salvamento;

- mudança visual de status;

- abertura suave das perguntas condicionais;

- feedback claro dos filtros;

- estados vazios;

- loading local quando fizer sentido.

Duração aproximada das transições:

150–250 ms.

Não utilizar animações performáticas.

Movimento deve servir à compreensão da interface.

---

# 24. MICROCOPY

Utilizar linguagem simples, direta e humana.

Não usar juridiquês.

Não usar linguagem assistencialista.

Não usar linguagem de marketing.

Exemplos:

NOVO ATENDIMENTO

Quem estamos acolhendo?

O que precisa de atenção?

Selecione todas as demandas identificadas.

Como seguimos?

Existe alguma situação que precise de atenção imediata?

Registrar atendimento

Atendimento registrado

Ver atendimento

Alterar status

---

# 25. IMPLEMENTAÇÃO

Stack sugerida:

React

TypeScript

Tailwind

shadcn/ui apenas quando realmente útil.

Pode utilizar componentes primitivos do shadcn, mas não reproduzir sua estética padrão.

Armazenamento:

localStorage.

O estado da aplicação deve sobreviver ao refresh do navegador.

---

# 26. NÃO IMPLEMENTAR

Nesta versão, não criar:

- backend;

- banco remoto;

- Supabase;

- Firebase;

- autenticação;

- contas de usuário;

- permissões;

- login;

- inteligência artificial;

- chatbot;

- automações;

- integrações externas;

- envio de e-mail;

- WhatsApp;

- exportação de PDF;

- exportação CSV;

- relatórios complexos;

- notificações;

- landing page;

- área institucional;

- preços;

- planos;

- onboarding;

- CRM completo.

Essas possibilidades podem existir futuramente, mas não pertencem ao v0.1.

---

# 27. ACABAMENTO OBRIGATÓRIO

Esta não é uma versão wireframe.

Não entregar superfícies visualmente provisórias.

Revisar:

- hierarquia tipográfica;

- consistência de espaçamento;

- responsividade;

- estados interativos;

- feedback do usuário;

- alinhamento;

- contraste;

- microcopy;

- empty states;

- consistência entre telas;

- dados simulados;

- navegação;

- fluxo completo.

Não deixar:

- placeholders técnicos;

- textos lorem ipsum;

- componentes genéricos sem tratamento;

- áreas quebradas;

- telas sem acabamento;

- elementos desnecessários;

- aparência de template.

---

# 28. PRINCÍPIO DE CONTENÇÃO

O produto deve ser pequeno no escopo, não pequeno na presença.

Não expandir horizontalmente o sistema.

Aprimorar verticalmente aquilo que já existe.

A primeira versão deve parecer:

precisa,

acabada,

rápida

e deliberada.

Não precisa parecer “grande”.

Precisa parecer pensada.

---

# 29. RESULTADO ESPERADO

Ao abrir a aplicação, o usuário deve conseguir:

1. compreender imediatamente a finalidade do sistema;

2. perceber que se trata de uma ferramenta estruturada, não de um formulário genérico;

3. iniciar um novo atendimento;

4. concluir o registro em aproximadamente dois minutos;

5. selecionar múltiplas demandas;

6. responder apenas às perguntas relevantes;

7. classificar prioridade;

8. salvar o registro;

9. receber confirmação visual adequada;

10. localizar o atendimento posteriormente;

11. pesquisar e filtrar registros;

12. abrir um atendimento;

13. alterar seu status ao longo do fluxo;

14. enxergar o conjunto de demandas da ação na visão geral.

---

# 30. TESTE FINAL

Antes de encerrar a implementação, auditar o resultado contra este handoff.

Perguntar:

1. Alguma funcionalidade foi adicionada sem necessidade?

2. Algum elemento ainda parece componente padrão Lovable/shadcn?

3. O sistema parece um formulário ou um produto?

4. O mobile está tão bem resolvido quanto o desktop?

5. O fluxo NOVO → TRIADO → ENCAMINHADO → CONCLUÍDO está visualmente claro?

6. A interface possui acabamento suficiente para ser apresentada como uma solução funcional?

7. Existe alguma complexidade que possa ser removida sem perda de valor?

8. Existe alguma parte do escopo existente cuja experiência ainda possa ser refinada?

Remover o excesso.

Refinar o que permanecer.

Não ampliar o escopo depois da auditoria.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://helping-hand-up.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2e6d9748-03b3-4200-bd1d-efcdbe8e38a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
