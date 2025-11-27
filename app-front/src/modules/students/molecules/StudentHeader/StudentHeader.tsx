import React from "react";
import type { StudentProfileResponse } from "../../../../types";
import styles from "./StudentHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

interface Props { student: StudentProfileResponse; }

const StudentHeader: React.FC<Props> = ({ student }) => (
  <div className={styles.header}>
    <FontAwesomeIcon className={styles.iconUser} icon={faCircleUser} />
    <div className={styles.info}>
      <h3 className={styles.name}>{student.fullName}</h3>
      <div className={styles.status}>{student.statusName}</div>
    </div>
  </div>
);

export default StudentHeader;
