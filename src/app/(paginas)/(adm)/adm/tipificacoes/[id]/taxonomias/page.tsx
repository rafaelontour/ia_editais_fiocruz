import Taxonomias from "./Taxonomias"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params

    return (
        
        <Taxonomias id={id} />
    )
}