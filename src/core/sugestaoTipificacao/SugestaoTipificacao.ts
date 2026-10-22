export type ModoSessaoSugestao = "create" | "enrich";
export type StatusSessaoSugestao =
  | "processing"
  | "ready"
  | "failed"
  | "completed";
export type TipoItemSugestao = "source" | "typification" | "taxonomy" | "branch";
export type OperacaoItemSugestao = "create" | "update";
export type StatusItemSugestao = "pending" | "confirmed" | "discarded";

export interface EvidenciaSugestao {
  quote: string;
  pages?: number[];
}

export interface RegraExcluidaSugestao {
  title: string;
  quote: string;
  pages?: number[];
}

export interface ItemSugestao {
  id: string;
  session_id: string;
  kind: TipoItemSugestao;
  operation: OperacaoItemSugestao;
  status: StatusItemSugestao;
  position: number;
  proposed_title: string;
  proposed_description?: string | null;
  parent_item_id?: string | null;
  parent_entity_id?: string | null;
  parent_entity_title?: string | null;
  target_entity_id?: string | null;
  target_snapshot?: Record<string, unknown> | null;
  evidence?: EvidenciaSugestao[];
  rationale?: string | null;
  similar_to_id?: string | null;
  similarity_note?: string | null;
  final_title?: string | null;
  final_description?: string | null;
  applied_entity_id?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
}

export interface SessaoSugestao {
  id: string;
  mode: ModoSessaoSugestao;
  status: StatusSessaoSugestao;
  target_typification_id?: string | null;
  target_typification_name?: string | null;
  document_group_id?: string | null;
  document_group_name?: string | null;
  document_group_item_id?: string | null;
  document_group_item_name?: string | null;
  original_filename: string;
  file_path: string;
  page_count?: number | null;
  error_message?: string | null;
  generation_model?: string | null;
  created_by?: string | null;
  created_at: string;
  processing_started_at?: string | null;
  processing_finished_at?: string | null;
}

export interface SessaoSugestaoDetalhe extends SessaoSugestao {
  items?: ItemSugestao[];
  excluded_rules?: RegraExcluidaSugestao[];
}

export interface RespostaSessoesSugestao {
  sessions: SessaoSugestao[];
}

export interface EdicaoConfirmacaoSugestao {
  title?: string;
  description?: string | null;
}
