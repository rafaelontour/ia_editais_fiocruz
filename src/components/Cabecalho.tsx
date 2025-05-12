import Image from "next/image";

export default function Cabecalho() {
    return (
        <header
            className="
                w-full bg-[#F5F5F5] px-3
            "
        >
            <Image
                src={"/logo_ia_editais.png"}
                alt="Logo"
                width={200}
                height={200}
                className="
                    inline-block ml-2
                "
            />

            <Image 
                src={"/logo_fiocruz.png"}
                alt="Logo"
                width={150}
                height={150}
                className="
                    ml-2 inline-block mb-[3px]
                "
            />
        </header>
    )
}