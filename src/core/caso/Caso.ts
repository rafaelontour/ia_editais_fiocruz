export interface Caso {
  id: string;
  name: string;
  taxonomy_id: string;
  typification_id: string;
  branch_id: string;
  test_collection_id: string;
  doc_id: string;
  expected_fulfilled: boolean;
  expected_feedback: string;
  input: string;
  created_at?: string;
  updated_at?: string;
}
