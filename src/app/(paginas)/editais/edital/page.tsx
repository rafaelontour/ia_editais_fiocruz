import AnaliseEdital from "@/components/editais/edital/AnaliseEdital";
import PdfEdital from "@/components/editais/edital/PdfEdital";
import SuperiorEdital from "@/components/editais/edital/SuperiorEdital";

export default function Edital () {
    return(
        <div className="flex flex-col w-full h-full max-h-full gap-10">
            <SuperiorEdital/>
            <div className="flex flex-row gap-5 w-full h-full">
                <div className="flex-1 w-1/2 h-full max-h-full">
                    <PdfEdital/>
                </div>
                <div className="w-1/2">
                    <AnaliseEdital/>
                </div>
            </div>
        </div>
    );
}