import Image from "next/image";

export default function Cabecalho() {
    return (
        <header
            className="
                w-full bg-[#F5F5F5] px-3
            "
        >
            <img
                src={"/logo_ia_editais.png"}
                alt="Logo"
                style={{ width: "auto", maxHeight: "32px" }}
                className="
                    inline-block ml-2
                "
            />

            <img 
                src={"/logo_fiocruz.png"}
                alt="Logo"
                style={{ width: "auto", maxHeight: "60px" }}
                className="
                    ml-2 inline-block mb-[3px]
                "
            />
        </header>
    )
}