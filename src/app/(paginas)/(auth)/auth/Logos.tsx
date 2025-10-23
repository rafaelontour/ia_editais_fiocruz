'use client'

import Link from "next/link";
import { motion } from "framer-motion";

export default function Logos() {
    return (
        <div className="flex flex-col items-center">
            {/* Logo 1 com fade in */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Link href="/">
                    <img src="/logo_ia_editais.png" alt="Logo do IaEditias" />
                </Link>
            </motion.div>

            {/* Barra animada crescendo de 10% a 90% */}
            <motion.div
                className="h-1 bg-slate-600 mt-10 rounded-sm"
                initial={{ width: "10%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
            />

            {/* Logo 2 com fade in (entra um pouco depois) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
            >
                <Link href="https://fiocruz.br/">
                    <img src="/logo_fiocruz.png" alt="Logo da FioCruz" />
                </Link>
            </motion.div>
        </div>
    )
}