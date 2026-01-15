export interface Resultado {
  id: string;
  test_run_id: string;
  test_case_id: string;
  metric_id: string;
  model_id: string;
  input: string;
  threshold_used: number;
  reason_feedback: string;
  score_feedback: number;
  passed_feedback: boolean;
  actual_feedback: string;
  actual_fulfilled: boolean;
  passed_fulfilled: boolean;
  expected_feedback: string;
  expected_fulfilled: boolean;
  created_at: string;
  updated_at: string;
}
