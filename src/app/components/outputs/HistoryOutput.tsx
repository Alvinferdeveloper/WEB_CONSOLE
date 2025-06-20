export default function BasicOutput({ output }: { output: { list: string[] } }) {
    return (
        <div>
            {
                output?.list?.map((log, index) => (
                    <div key={index} className=" px-5 text-sm mt-2">
                       <pre className="text-xl">{`${index + 1}  ${log}`}</pre>
                    </div>
                ))
            }
        </div>
    )
}