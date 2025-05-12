

export default function CategoriaColor () {
    // FUTURO SELECT -> STATUS
    const status = [
        { nome:"Retrabalhando", color:"green" },
        { nome:"Retrabalhar", color:"red" }
    ]

    return(
        <div>
            
            <div className="flex flex-row gap-5">
                {status.map((item) => (
                    <div key={item.nome} className="flex items-center gap-3">
                        <div className="rounded-xs w-3 h-3" style={{ backgroundColor: item.color }}></div>
                        <p>{item.nome}</p>
                    </div>
                ))}
                
            </div>
        </div>
    );
}