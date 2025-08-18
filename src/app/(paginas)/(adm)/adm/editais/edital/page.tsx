import AnaliseEdital from "@/components/editais/edital/AnaliseEdital";
import Linha01 from "@/components/editais/edital/analiselinhas/Linha01";
import Linha02 from "@/components/editais/edital/analiselinhas/Linha02";
import PdfEdital from "@/components/editais/edital/PdfEdital";
import SuperiorEdital from "@/components/editais/edital/SuperiorEdital";

export default function Edital () {
    return(
        <div className="flex flex-col w-full h-full max-h-full gap-10">
            <SuperiorEdital/>
            <div className="flex flex-row gap-5 w-full h-full">
                <div className="flex-1 flex-col gap-4 w-1/2 ">
                    <Linha01/>

                    <Linha02/>

                    <PdfEdital/>
                </div>
                <div className="w-1/2">
                    <AnaliseEdital/>
                </div>
            </div>
        </div>
    );
}