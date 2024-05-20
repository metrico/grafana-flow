export const saveAs = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
}
