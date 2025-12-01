import { Button } from "../ui/button";


export default function BotaoSalvar({ onClick }: { onClick?: () => void }) {
    return (
        <Button
            onClick={onClick}
            type="submit"
            className={`
                flex bg-verde hover:bg-verde
                text-white hover:cursor-pointer
            `}
            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
            data-cy="botao-salvar-generico"
        >
            Salvar
        </Button>
    )
}