export type ProjetoStatus = "INICIADO" | "EM_ANDAMENTO" | "FINALIZADO";

export interface Projeto {
  id: string;
  name: string;
  description?: string;
  status?: ProjetoStatus | string;
  document_group_id?: string;
  document_group_name?: string;
  created_at?: string;
}

export interface DocumentoProjeto {
  id: string;
  project_id: string;
  type?: string;
  name: string;
  number?: string;
  status?: string;
  responsible?: string;
  responsible_name?: string;
  responsible_icon?: {
    file_path: string;
  } | null;
  created_at?: string;
  sent_to_kanban?: boolean;
}
