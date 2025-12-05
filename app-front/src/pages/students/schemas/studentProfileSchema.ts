import type { SectionSchema } from "@/models";

export const personalSchema: SectionSchema = {
    title: "Datos personales",
    fields: [
        { key: "dni", label: "DNI", editable: false },
        { key: "birthDate", label: "Fecha de nacimiento", type: "date", editable: false },
        { key: "genderName", label: "Género", editable: false },
        { key: "weight", label: "Peso", type: "number", editable: true },
        { key: "height", label: "Altura", type: "number", editable: true },
    ],
};

export const evaluationSchema: SectionSchema = {
    title: "Evaluaciones",
    fields: [
        { key: "lastEvaluationDate", label: "Última nota", type: "date", editable: false },
        { key: "averageScore", label: "Promedio", type: "number", editable: false },
    ],
};

export const contactSchema: SectionSchema = {
    title: "Contacto",
    fields: [
        { key: "email", label: "Email", type: "email", editable: true },
        { key: "phone", label: "Teléfono", type: "phone", editable: true },
        { key: "address.street", label: "Dirección", editable: true },
    ],
};


export const addressSchema: SectionSchema = {
    title: "Dirección",
    fields: [
        { key: "address.street", label: "Calle", editable: true },
        { key: "address.reference", label: "Referencia", editable: true },
        { key: "address.district.name", label: "Distrito", editable: false },
        { key: "address.district.province.name", label: "Provincia", editable: false },
        { key: "address.district.province.region.name", label: "Región", editable: false },
    ],
};
