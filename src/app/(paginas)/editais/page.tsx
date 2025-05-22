import CardList from "@/components/editais/CardList";
import SuperiorEditais from "@/components/editais/SuperiorEditais";

export default function MeusEditais () {


    return(
        <div className="flex flex-1 flex-col gap-10 ">
            <div className="h-fit">
                <SuperiorEditais/>
            </div>
            <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 w-[90%]">
                {/* CARD - RASCUNHO: */}
                <CardList categoria={[{nome:"Rascunho", color:"gray"}]}/>
                
                {/* CARD - EM CONSTRUÇÃO: */}
                <CardList categoria={[{nome:"Em construção", color:"red"}]}/>
                
                {/* CARD - EM ANÁLISE: */}
                <CardList categoria={[{nome:"Em Análise", color:"#656149"}]}/>
                
                {/* CARD - CONCLUIDO: */}
                <CardList categoria={[{nome:"Concluido", color:"darkgreen"}]}/>
                
            </div>
        </div>
    );
} 