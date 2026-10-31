export function plainText(markdown: string) { return markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*`_>~]/g, '').trim(); }
export function readingMinutes(content: string) { return Math.max(1, Math.ceil(plainText(content).length / 450)); }
