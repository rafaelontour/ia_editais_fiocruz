import { Fonte } from "../fonte";

export interface Tipificacao {
  id: string;
  name?: string;
  sources?: Fonte[];
  source_ids?: string[];
  taxonomies?: Taxonomia[];
  document_group_id?: string;
  document_group_name?: string;
  document_group_item_id?: string;
  document_group_item_name?: string;
  created_at?: string;
  updated_at?: string | null;
}

export interface Taxonomia {
  typification_id?: string;
  id: string;
  title?: string;
  description?: string;
  branches?: Branch[];
  created_at?: string;
  updated_at?: string | null;
}

export interface BranchReference {
  chunk_id?: string;
  text_snippet?: string | null;
  page?: number | null;
  rects?: Array<{ x1: number; y1: number; x2: number; y2: number }> | null;
}

export interface Branch {
  id: string;
  title?: string;
  description?: string;
  evaluation?: {
    feedback: string;
    fulfilled: boolean;
    score: number;
  };
  references?: BranchReference[];
  created_at?: string;
  updated_at?: string | undefined;
}
