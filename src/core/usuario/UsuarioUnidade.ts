import { Dispatch, SetStateAction } from "react"
import { NivelAcesso } from "../enum/nivelAcessoEnum"

export interface UsuarioUnidade {
    id: string,
    unit_id?: string,
    phone_number?: string,
    username?: string,
    email?: string,
    access_level?: string,
    created_at?: string | number
    updated_at?: string | number
    editable_documents?: string[]
}