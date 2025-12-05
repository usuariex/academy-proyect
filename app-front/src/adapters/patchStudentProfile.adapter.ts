
// adapters/patchStudentProfile.adapter.ts

/**
 * Adapter para transformar el PATCH de StudentProfile
 * al formato que espera la API.
 *
 * Recibe un objeto parcial con los cambios (patch)
 * y devuelve el payload listo para enviar al backend.
 */
export function patchStudentProfileAdapter(patch: Record<string, any>): Record<string, any> {
    const apiPayload: Record<string, any> = {};

    // Copiamos todos los campos tal cual
    Object.assign(apiPayload, patch);

    // Ejemplo: si el backend espera genderId en lugar de genderName
    if (patch.genderName) {
        apiPayload.genderId = mapGenderNameToId(patch.genderName);
        delete apiPayload.genderName;
    }

    // Ejemplo: si el backend espera dirección como objeto plano
    if (patch.address) {
        apiPayload.address = {
            street: patch.address.street,
            reference: patch.address.reference,
            // puedes añadir más transformaciones si el backend requiere
        };
    }

    return apiPayload;
}

/**
 * Helper para mapear nombres de género a IDs
 * (ejemplo, depende de tu backend).
 */
function mapGenderNameToId(name: string): number {
    const map: Record<string, number> = {
        Masculino: 1,
        Femenino: 2,
        Otro: 3,
    };
    return map[name] ?? 0;
}
