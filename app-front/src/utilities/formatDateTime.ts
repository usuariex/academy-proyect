
export const formatDateTime = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
};
