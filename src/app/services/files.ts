export async function saveFileContent(filePath: string, currentPath: { id: number, absolutePath: string }, content: string, fileId?: number, fileName?: string) {
    const res = await fetch('/api/files/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, filePath, currentPath, content, fileName })
    });
    if(!res.ok) throw new Error('Este archivo ya existe');
}