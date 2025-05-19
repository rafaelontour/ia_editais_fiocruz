

export interface Categoria {
  nome: string;
  color: string;
}

interface CategoriaColorProps{
    categoria: Categoria[];
}

export default function CategoriaColor ({categoria} : CategoriaColorProps) {

    return(
        <div>
            
            <div className="flex flex-row gap-5">
                {categoria.map((item) => (
                    <div key={item.nome} className="flex items-center gap-3">
                        <div className="rounded-xs w-3 h-3" style={{ backgroundColor: item.color }}></div>
                        <p>{item.nome}</p>
                    </div>
                ))}
                
            </div>
        </div>
    );
}