import { Button } from "../ui/button";

export default function BotaoCancelar() {
    return (
        <div
            role="button"
            className={`
                h-full flex items-center justify-center
                transition ease-in-out text-white
                rounded-md px-3 bg-vermelho
                hover:cursor-pointer text-sm
            `}
            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
        >
            Cancelar
        </div>
    );
}