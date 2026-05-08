export function parseAetherContent(content: string, identity: Record<string, string>) {
    if (!content) return "";

    // Ersetzt {{company_name}} durch "News24Regional" etc.
    return content.replace(/\{\{(.*?)\}\}/g, (match, key) => {
        const value = identity[key.trim()];
        return value || `<span class="text-red-500 underline decoration-dotted">MISSING_${key.toUpperCase()}</span>`;
    });
}