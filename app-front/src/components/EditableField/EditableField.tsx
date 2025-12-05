
interface EditableFieldProps {
    label: string;
    value: any;
    type?: "text" | "number" | "date" | "select" | "email" | "phone";
    editable: boolean;
    inEdit: boolean;
    options?: { label: string; value: string | number }[];
    onChange?: (val: any) => void;
    error?: string;
}

export const EditableField = ({
    label,
    value,
    type = "text",
    editable,
    inEdit,
    options,
    onChange,
    error,
}: EditableFieldProps) => {
    if (inEdit && editable) {
        if (type === "select" && options) {
            return (
                <div>
                    <label>{label}</label>
                    <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}>
                        {options.map((opt) => (
                            <option key={String(opt.value)} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {error && <small style={{ color: "red" }}>{error}</small>}
                </div>
            );
        }
        return (
            <div>
                <label>{label}</label>
                <input
                    type={type === "number" ? "number" : type}
                    value={value ?? ""}
                    onChange={(e) => onChange?.(e.target.value)}
                />
                {error && <small style={{ color: "red" }}>{error}</small>}
            </div>
        );
    }

    return (
        <div>
            <span>
                <strong>{label}:</strong> {value ?? "-"}
            </span>
        </div>
    );
};
