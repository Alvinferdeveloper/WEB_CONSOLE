import { LsOutPut } from "@/app/types/command";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

export function LsOutput({ output }: { output: LsOutPut }) {
    const isDetailedView = output.length > 0 && output[0].created_at;

    if (isDetailedView) {
        return (
            <div>
                {output.map((file, index) => (
                    <div className="flex space-x-4 text-sm mt-1" key={index}>
                        <p className="w-24 ${file.type === 'DIRECTORY' ? 'text-blue-400' : 'text-gray-400'}">
                            {file.type === 'DIRECTORY' ? 'd--x--x--x' : '----rwx---'}
                        </p>
                        <p className="w-32 text-gray-400">{formatDate(file.created_at!)}</p>
                        <p className={`${file.type === 'DIRECTORY' ? 'text-blue-500' : 'text-white'}`}>
                            {file.name}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    // Fallback to the simple grid view
    return (
        <div className="grid grid-cols-4 gap-x-4">
            {
                output.map((file, index) => (
                    <p className={`${file.type === 'DIRECTORY' ? 'text-blue-500' : 'text-white'} text-sm mt-1`} key={index}>
                        {file.name}
                    </p>
                ))
            }
        </div>
    );
}