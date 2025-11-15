import { useContext } from "react"
import { ProcEditalContexto } from "../context/ProcEdital"

const useEditalProc = () => {
    const contexto = useContext(ProcEditalContexto)

    if (!contexto) {
        throw new Error("useUsuario deve ser usado dentro de um UsuarioContextoProvider")
    }

    return contexto
}

export default useEditalProc;