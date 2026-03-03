import { UsuarioUnidade } from "../usuario"

export interface Log {
    id: string
    table_name: string
    record_id: string
    action: string
    user_id: string
    old_data: {
        name: string
    }
    user: UsuarioUnidade
    created_at: string
    description: string
}