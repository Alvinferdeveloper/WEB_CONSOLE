export function saveFileContent(filePath: string, currentPath: { id: number, absolutePath: string }, content: string, fileId?: number, fileName?: string) {
    return fetch('/api/files/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, filePath, currentPath, content, fileName })
    });
}