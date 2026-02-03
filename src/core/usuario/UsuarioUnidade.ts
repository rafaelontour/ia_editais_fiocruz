import { Dispatch, SetStateAction } from "react"
import { NivelAcesso } from "../enum/nivelAcessoEnum"

export interface UsuarioUnidade {
    id?: string | undefined,
    unit_id?: string,
    phone_number?: string,
    username?: string,
    email?: string,
    password?: string,
    access_level?: string,
    created_at?: string | number
    updated_at?: string | number
    editable_documents?: string[]
    icon?: {
        file_path: string
    }
}