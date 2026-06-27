import { Button } from "../ui/button";


export default function BotaoSalvar({ onClick, rotulo, disabled }: { onClick?: () => void , rotulo?: string, disabled?: boolean } ) {
    return (
        <Button
            onClick={onClick}
            type="submit"
            disabled={disabled}
            className={`
                flex bg-verde hover:bg-verde
                text-white hover:cursor-pointer
            `}
            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
            data-cy="botao-salvar-generico"
        >
            { rotulo ? rotulo : "Salvar" }
        </Button>
    )
}