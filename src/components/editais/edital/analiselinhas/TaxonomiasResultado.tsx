import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Taxonomia } from "@/core/tipificacao/Tipificacao";
import { Link } from "lucide-react";
import RamosDaTaxonomiaResultado from "./RamosDaTaxonomiaResultado";

interface Props {
    taxonomias: Taxonomia[] | undefined
}

export default function TaxonommiasResultado({ taxonomias }: Props) {

    return (
        taxonomias && taxonomias.length > 0 && (
            <div className="flex flex-1 border border-gray-300 rounded-sm p-4">
                <Tabs defaultValue="tabTax0">
                    <TabsList>
                        {
                            taxonomias.map((taxonomia, index) => (
                                <TabsTrigger className="hover:cursor-pointer rounded-sm" key={index} value={"tabTax" + index}>
                                    {taxonomia.title}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>

                    {
                            taxonomias.map((taxonomia, index) => (
                                <TabsContent
                                    value={"tabTax" + index}
                                    key={taxonomia.id}
                                >
                                    <RamosDaTaxonomiaResultado
                                        ramos={taxonomia.branches ? taxonomia.branches : []}
                                        key={taxonomia.id}
                                    />
                                </TabsContent>
                            ))
                        }
                </Tabs>
            </div>
        )
    )
}