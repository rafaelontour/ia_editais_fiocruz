import { Dispatch, SetStateAction } from "react"

export interface UsuarioUnidade {
    id: string,
    unit_id: string,
    phone_number: string,
    username: string,
    email: string,
    access_level: string,
    logado?: boolean,
    created_at?: string | number
}