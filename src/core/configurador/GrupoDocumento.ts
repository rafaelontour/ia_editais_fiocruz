export interface DocumentGroupItem {
  id: string;
  group_id: string;
  name: string;
  created_at?: string;
  icon_path?: string;
}

export interface DocumentGroup {
  id: string;
  name: string;
  created_at?: string;
}
