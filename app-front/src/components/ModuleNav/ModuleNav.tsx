import styles from './ModuleNav.module.css';
import { NavLink } from 'react-router-dom';
import type { Tab } from '@/models'

type Variant = 'underline' | 'pill' | 'none';
type Align = 'left' | 'center' | 'right';
type Size = 'sm' | 'md' | 'lg';

interface ModuleNavProps {
    tabs: Tab[];
    variant?: Variant;
    align?: Align;
    size?: Size;
}

export const ModuleNav = ({
    tabs,
    variant = 'underline',
    align = 'left',
    size = 'md',

}: ModuleNavProps) => {
    return (
        <div
            className={`${styles.navContainer} ${styles[variant]} ${styles[align]} ${styles[size]}`}
        >
            {tabs.map(({ label, path, icon, exact }) => (
                <NavLink
                    key={path}
                    to={path}
                    end={exact}
                    className={({ isActive }) =>
                        `${styles.tab} ${isActive ? styles.active : ''}`
                    }
                >
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <span className={styles.label}>{label}</span>
                </NavLink>
            ))}
        </div>
    );
};
