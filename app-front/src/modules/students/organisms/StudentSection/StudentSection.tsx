import React from "react";
import EditableField from "../../atoms/EditableField/EditableField";
import styles from "./StudentSection.module.css";

type Field = { label: string; value: string; editable?: boolean; onSave?: (v:string)=>void; countryFlag?: string };

interface Props { title: string; fields: Field[]; }

const StudentSection: React.FC<Props> = ({ title, fields }) => (
  <section className={styles.section}>
    <h4 className={styles.title}>{title}</h4>
    {fields.map((f, i) => (
      <EditableField key={i} label={f.label} value={f.value} editable={f.editable} onSave={f.onSave} countryFlag={f.countryFlag} />
    ))}
  </section>
);

export default StudentSection;
