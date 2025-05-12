import SuperiorEditais from "./SuperiorEditais";

export default function MeusEditais () {
    return(
        <div className="flex flex-col gap-10">
            <div className="h-fit">
                <SuperiorEditais/>
            </div>
            <div className="bg-green-700">
                cards
            </div>
        </div>
    );
} 