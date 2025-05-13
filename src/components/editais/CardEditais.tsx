import { Button } from "../ui/button";

export default function CardEditais () {
    return(
        <div className="flex flex-col rounded-md overflow-hidden border-2 border-gray-300 cursor-pointer">
            <div className="bg-[#dedede]  h-16">

            </div>
            <div className="flex flex-col bg-gray-50 py-2.5 px-3 gap-4">
                <div>
                    <div>Edital Fiocruz 2023/2</div>
                    <div className="flex flex-row justify-between">
                        <p className="text-sm">compras</p>
                        <p className="text-xs">datas</p>
                    </div>
                </div>
                <div className="flex gap-0.5 justify-end">
                    <Button variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300"></Button>
                    <Button variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300"></Button>
                    <Button variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300"></Button>
                </div>
            </div>
        </div>
    );
}