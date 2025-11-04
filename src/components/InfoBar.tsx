interface InfoBarProps {
    title: string;
    value: number | string;
}

export default function InfoBar(props: { data: InfoBarProps[] }) {
    return (
        <div className="flex gap-4 py-10 px-4 text-center bg-white rounded-md w-full justify-around border-1 border-zinc-400">

            {props.data && props.data.length > 0 ? (
                props.data.map(({ title, value }) => (
                    <div key={title} className="flex flex-col">
                        <span className="font-light text-xl">{title}</span>
                        <span className="font-extrabold text-5xl">{value}</span>
                    </div>
                ))
            ) : (
                <span className="font-light text-xl">Carregando dados...</span>
            )}

        </div>
    );
}