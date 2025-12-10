import type { ReactNode } from "react";

export interface Tab {
    label: string;
    path: string;
    icon?: ReactNode;
    exact?: boolean;
    permission?: string;
}


export interface SelectOption {
    label: string;
    value: string;
}


export type FieldType = "text" | "number" | "date" | "select" | "email" | "phone";


export interface FieldSchema {
    key: string;
    label: string;
    type?: FieldType;
    editable?: boolean;
    required?: boolean;
    options?: SelectOption[];
    formatter?: (val: any) => string;
    parser?: (val: string) => any;
    validate?: (val: any) => string | null;
}

export interface SectionSchema {
    title: string;
    fields: FieldSchema[];
}


/* Tabla generica */
export interface Column<T> {
    key: keyof T | "actions";
    label: string;
    render?: (value: any, row: T) => ReactNode;
}