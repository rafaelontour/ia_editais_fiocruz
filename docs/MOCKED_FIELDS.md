# Campos Mockados — Funcionalidades sem backend

## 1. Grupo e Tipo de Documento no Kanban

### O que foi mockado

Foram adicionados três campos ao `Edital` (card do Kanban):

- `grupo` — nome do grupo de documentos (`DocumentGroup.name`) definido no **Modo Configurador**
- `tipo_documento` — nome do tipo de documento (`DocumentGroupItem.name`) associado ao projeto
- `projeto_nome` — nome do projeto de origem

Atualmente esses campos **não existem no backend** e são preenchidos **apenas no front-end** quando um documento é enviado do projeto para o Kanban.

### Onde os dados são inseridos

**Arquivo:** `src/app/(paginas)/(adm)/adm/projetos/[id]/page.tsx` — função `enviarParaKanban`

```typescript
grupo: projeto?.document_group_name ?? "",
tipo_documento: doc.type ?? "",
projeto_nome: projeto?.name ?? "",
```

Além disso, ao carregar a página do Kanban (`editais/page.tsx`), é feito um **backfill** automático: para documentos existentes que tenham `grupo` e `tipo_documento` mas não tenham `projeto_nome`, o código tenta associar o primeiro projeto que contenha aquele grupo.

### O que precisa ser implementado no backend

1. Adicionar os campos `grupo`, `tipo_documento` e `projeto_nome` (ou equivalentes) ao modelo/endpoint de **Edital** (`GET /doc`, `GET /doc/:id` e `POST /doc`)
2. Esses campos devem ser preenchidos com o nome do grupo de documentos, tipo de documento e projeto associados ao edital no momento da criação

---

## 2. Imagem do Tipo de Documento no Configurador

### O que foi mockado

Foi adicionado um campo opcional `icon_path` à interface `DocumentGroupItem`. Esse campo armazena uma imagem (em base64) que é escolhida pelo usuário ao criar um novo tipo de documento no **Modo Configurador**.

A imagem é:
- Armazenada no **localStorage** junto com os demais dados do `DocumentGroupItem`
- Exibida como um thumbnail de 24x24 ao lado do nome do tipo de documento
- Expande para o tamanho original quando o usuário clica na thumbnail

### Onde os dados são inseridos

**Arquivo:** `src/app/(paginas)/(adm)/adm/configurador/page.tsx`

No diálogo "Adicionar novo tipo de documento", o usuário pode clicar em "Escolher imagem" para selecionar um arquivo de imagem do computador. A imagem é convertida para base64 via `FileReader` e armazenada no campo `icon_path` do `DocumentGroupItem`.

### O que precisa ser implementado no backend

1. Adicionar o campo `icon_path` (ou campo equivalente para armazenar URL de imagem) ao modelo/endpoint de **DocumentGroupItem** no backend
2. Implementar upload de imagem para um servidor de arquivos (S3, armazenamento local, etc.) em vez de armazenar base64 no JSON
3. Atualizar o campo `icon_path` com a URL retornada pelo upload

Após a implementação no backend:
- O campo `icon_path` passará a conter uma URL real em vez de base64
- Remover a lógica de `FileReader` / base64 no front-end
- Substituir por upload para o backend e armazenamento da URL retornada

---

## Arquivos alterados (geral)

| Arquivo | O que faz |
|---|---|
| `src/core/edital/Edital.ts` | Adiciona `grupo?`, `tipo_documento?`, `projeto_nome?` à interface |
| `src/core/configurador/GrupoDocumento.ts` | Adiciona `icon_path?` à interface `DocumentGroupItem` |
| `src/service/configurador.ts` | Aceita `icon_path` em `adicionarDocumentoConfiguravelService` e `atualizarDocumentoConfiguravelService` |
| `src/app/(paginas)/(adm)/adm/projetos/[id]/page.tsx` | Preenche os campos mockados ao enviar documento para o Kanban |
| `src/components/editais/CardEdital.tsx` | Exibe grupo e tipo de documento no card |
| `src/app/(paginas)/(adm)/adm/editais/page.tsx` | Backfill de `projeto_nome` para documentos existentes |
| `src/app/(paginas)/(adm)/adm/configurador/page.tsx` | Upload de imagem (base64 mockado) e thumbnail com expansão |

---

## 3. Responsável nas conversas do Assistente (OiacIA)

### O que foi mockado

Foram adicionados dois campos à interface `ChatDocumento`:

- `responsavel_id` — ID do usuário responsável pela conversa
- `responsavel_nome` — nome do responsável (para exibição nos cards)

No formulário de upload (`FormularioUpload`), foi adicionado um campo **Responsável** (Select) que lista os usuários da mesma unidade (obtidos via `getUsuariosPorUnidade`).

### Onde os dados são inseridos

**Arquivo:** `src/components/assistente/FormularioUpload.tsx`

O campo `responsavel` é obrigatório no schema Zod e é persistido via `criarDocumentoChat` no localStorage.

### Como funciona a página do assistente

1. **Estado "lista"**: exibe um **Masonry** com cards de todas as conversas salvas, mostrando: nome do documento, nome do arquivo, responsável, quantidade de mensagens e data de criação.
2. **Botão "Nova conversa"**: abre o formulário de upload (`FormularioUpload`) com os campos existentes mais o novo campo **Responsável**.
3. **Estado "chat"**: após criar ou clicar em uma conversa existente, exibe o visualizador de documento + chat lado a lado (mesmo layout anterior).
4. **Botão "Cancelar"** no formulário: retorna para a lista sem salvar.
5. **Botão de excluir** (Trash2) em cada card: remove a conversa do localStorage e atualiza a lista.
6. **Responsável** movido para a **Etapa 2** do formulário (junto com tipificações), validado no avanço da etapa.

### O que precisa ser implementado no backend

1. Adicionar os campos `responsavel_id` e `responsavel_nome` ao modelo/endpoint de `ChatDocumento` no backend
2. O campo `responsavel` deve referenciar um usuário real (FK para tabela de usuários)
3. O endpoint de listagem de conversas deve suportar filtro por responsável
4. Substituir o armazenamento em localStorage por chamadas de API (CRUD de conversas), incluindo exclusão

## 4. Exclusão de editais no Kanban

### O que foi mockado

A exclusão de editais no Kanban é 100% local (mockada), independente do campo `isMock`. O fluxo atual:

1. Marca o documento como não enviado ao Kanban via `desmarcarEnviadoAoKanban` (localStorage)
2. Remove o edital do state `columns` filtrando por ID
3. Atualiza a UI via `funcaoAtualizarEditais`

### Por que foi mockado

O backend retorna `422 (Unprocessable Content)` no `DELETE /doc/:id`. Enquanto esse endpoint não for implementado corretamente, a exclusão é feita apenas no front-end.

### Como voltar ao comportamento original no futuro

Em `src/components/editais/CardEdital.tsx`, função `excluirEdital`:

```typescript
// FUTURO: quando o backend suportar DELETE /doc/:id, descomentar o bloco abaixo
// e remover a mock atual.
//
// if (!edital.isMock) {
//   const resposta = await excluirEditalService(edital.id);
//   if (resposta !== 204) {
//     toast.error("Erro ao excluir edital!");
//     return;
//   }
// } else {
//   await desmarcarEnviadoAoKanban(edital.id);
// }
```

O código original comentado já está no arquivo, basta descomentá-lo e remover a mock atual.

---

## 5. `typification_ids` como JSONB em `ProjectDocument`

### Problema

O campo `typification_ids` no model `ProjectDocument` foi implementado como `JSONB` para agilizar o desenvolvimento. O psycopg não serializa objetos `UUID` nativamente via `json.dumps()`, o que gerou erro 500 ao salvar.

### Correção aplicada

- Mudou o tipo no schema e model de `list[UUID]` para `list[str]`
- Adicionou `UUIDEncoder` personalizado no `database.py` como proteção global

### Recomendação futura

Para melhor performance e consistência, refatorar para **junction table** (igual `document_typifications` do model `Document`):

1. Criar tabela `project_document_typifications` com FK para `project_documents.id` e `typifications.id`
2. Remover coluna `typification_ids` de `project_documents`
3. Atualizar os schemas, service e repositório do `ProjectDocument`

---

## Arquivos alterados (geral) — segunda rodada

| Arquivo | O que faz |
|---|---|
| `src/core/assistente/ChatDocumento.ts` | Adiciona `responsavel_id?` e `responsavel_nome?` à interface |
| `src/components/assistente/FormularioUpload.tsx` | Adiciona campo `responsavel` (Select, Step 2), schema Zod, botão Cancelar |
| `src/app/(paginas)/(adm)/adm/assistente/page.tsx` | Rewrite completo: masonry de cards + scroll area + botão "Nova conversa" + excluir conversas + layout correto |
| `src/service/assistente/assistente.ts` | Adiciona função `excluirDocumentoChat` |
