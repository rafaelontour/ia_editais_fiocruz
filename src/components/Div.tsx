interface DivProps {
    children: React.ReactNode;
}

export default function Div(dados: DivProps) {
    return (
        <div
            style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
            className="
                flex flex-col gap-2 rounded-md p-4 mb-4
                transition ease-in-out duration-100
                min-w-[250px]
            "
        >
            {dados.children}
        </div>
    )
}