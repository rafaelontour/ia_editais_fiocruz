# Campos Mockados — Funcionalidades sem backend

## 1. ~~Grupo e Tipo de Documento no Kanban~~ ✅ Implementado

Os campos `grupo`, `tipo_documento` e `projeto_nome` foram adicionados ao model `Document` no backend (migration `e4d5f6a7b8c9`) e agora são enviados no payload do `POST /doc`.

**Arquivo:** `src/app/(paginas)/(adm)/adm/projetos/[id]/page.tsx` — função `enviarParaKanban`

O backfill no `editais/page.tsx` ainda existe para documentos criados antes da migration; pode ser removido no futuro.

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

## 3. Conversas do Assistente (OiacIA) — ✅ Implementado no backend

### O que foi feito

Foram criadas duas tabelas no banco de dados:

- `chat_conversations` — vinculada a `documents` e `users` (FKs), com soft delete
- `chat_messages` — vinculada a `chat_conversations`, com `role` (user/assistant) e `content`

### Endpoints criados

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/chat/conversations` | Cria conversa para um documento |
| `GET` | `/chat/conversations` | Lista conversas do usuário logado |
| `GET` | `/chat/conversations/{id}/messages` | Mensagens de uma conversa |
| `DELETE` | `/chat/conversations/{id}` | Exclusão lógica |
| `POST` | `/doc/{doc_id}/assistant/chat` | Envia mensagem + salva pergunta e resposta no banco |

### Frontend

- `service/assistente/assistente.ts` — reescrito para usar API (não usa mais localStorage)
- `ChatIA.tsx` — recebe `conversationId` + `documentId`, busca mensagens da API
- `FormularioUpload.tsx` — após upload, cria conversa via API
- `page.tsx` — estado da página usa `conversationId` + `documentId`

### Arquivos do backend alterados/criados

- `iaEditais/models.py` — classes `ChatConversation` e `ChatMessage`
- `iaEditais/repositories/chat_repo.py` — CRUD das conversas
- `iaEditais/routers/docs/chat.py` — endpoints REST
- `iaEditais/routers/docs/assistant.py` — endpoint de chat salva mensagens
- `iaEditais/app.py` — router registrado
- `migrations/versions/0001_add_chat_tables.py` — migration

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

## 6. Separar assistente em rotas (futuro)

### Motivação

Atualmente a page do assistente (`/adm/assistente`) usa **estado React** (`PaginaState`) para alternar entre lista, formulário e chat. Isso significa que:

- **F5/refresh** durante o chat volta para a lista
- Não é possível **compartilhar/bookmark** uma conversa específica
- Botão "voltar" do navegador não funciona como esperado

### O que fazer

Separar em três rotas:

| Rota | Componente |
|---|---|
| `/adm/assistente` | Lista de conversas (igual hoje) |
| `/adm/assistente/novo` | Formulário de upload (`FormularioUpload`) |
| `/adm/assistente/[id]` | Split view: PDF + chat (`VisualizadorDocumento` + `ChatIA`) |

### Como fazer

Os componentes já estão isolados (`FormularioUpload`, `ChatIA`, `VisualizadorDocumento`), então a migração é simples:

1. Criar `src/app/(paginas)/(adm)/adm/assistente/novo/page.tsx` com `<FormularioUpload>` que redireciona para `/[id]` após criar
2. Criar `src/app/(paginas)/(adm)/adm/assistente/[id]/page.tsx` que busca a conversa pelo parâmetro da URL e renderiza a split view
3. Simplificar `src/app/(paginas)/(adm)/adm/assistente/page.tsx` para apenas a listagem
4. Remover `PaginaState` e navegação baseada em estado

---

## Arquivos alterados (geral) — segunda rodada

| Arquivo | O que faz |
|---|---|
| `src/core/assistente/ChatDocumento.ts` | Adiciona `responsavel_id?` e `responsavel_nome?` à interface |
| `src/components/assistente/FormularioUpload.tsx` | Adiciona campo `responsavel` (Select, Step 2), schema Zod, botão Cancelar |
| `src/app/(paginas)/(adm)/adm/assistente/page.tsx` | Rewrite completo: masonry de cards + scroll area + botão "Nova conversa" + excluir conversas + layout correto |
| `src/service/assistente/assistente.ts` | Adiciona função `excluirDocumentoChat` |
