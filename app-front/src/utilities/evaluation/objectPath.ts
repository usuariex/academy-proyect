
export function getByPath<T = any>(obj: Record<string, any>, path: string): T | undefined {
    if (!obj || typeof obj !== "object") return undefined;
    if (!path) return undefined;

    return path.split(".").reduce<any>((acc, key) => {
        if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
            return acc[key];
        }
        return undefined;
    }, obj);
}


export function setByPath(obj: Record<string, any>, path: string, value: any): Record<string, any> {
    if (!obj || typeof obj !== "object") {
        throw new Error("Target must be an object");
    }
    if (!path) {
        throw new Error("Path must be a non-empty string");
    }

    const keys = path.split(".");
    const lastKey = keys.pop() as string;

    let target = obj;
    for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(target, key) || typeof target[key] !== "object") {
            target[key] = {};
        }
        target = target[key];
    }

    target[lastKey] = value;
    return obj;
}



export function buildPatchFromValues(
    values: Record<string, any>,
    editableKeys: string[]
): Record<string, any> {
    if (!values || typeof values !== "object") {
        throw new Error("Values must be an object");
    }
    if (!Array.isArray(editableKeys)) {
        throw new Error("EditableKeys must be an array");
    }

    const patch: Record<string, any> = {};
    for (const key of editableKeys) {
        const val = getByPath(values, key);
        if (val !== undefined) {
            setByPath(patch, key, val);
        }
    }
    return patch;
}


export function buildChangedPatch(
    values: Record<string, any>,
    initialValues: Record<string, any>,
    editableKeys: string[]
): Record<string, any> {
    const patch: Record<string, any> = {};

    editableKeys.forEach((key) => {
        const current = getByPath(values, key);
        const original = getByPath(initialValues, key);

        // Solo incluir si el valor cambió
        if (current !== original) {
            setByPath(patch, key, current);
        }
    });

    return patch;
}


