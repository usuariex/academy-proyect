import styles from './ModuleTitle.module.css';

interface ModuleTitleProps {
    text: string;
}

export const ModuleTitle = ({ text }: ModuleTitleProps) => {
    return <h2 className={styles.title}>{text}</h2>;
};
