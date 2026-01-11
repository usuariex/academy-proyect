
export function formatResult(result: string | number | null): string {
    if (result == null) return "";

    const num = Number(result);

    if (isNaN(num)) return String(result);

    if (Number.isInteger(num)) return num.toString();

    return num.toString();
}
