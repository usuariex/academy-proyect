
import { Outlet } from "react-router-dom";
import { ModuleTitle } from "@/components/ui";
import { ModuleNav } from "@/components/layout";
import styles from "./ModuleLayout.module.css";
import type { Tab } from '@/models'


interface ModuleLayoutProps {
    title: string;
    tabs: Tab[];
    provider?: React.ComponentType<{ children: React.ReactNode }>;
}

export const ModuleLayout = ({ title, tabs, provider: Provider }: ModuleLayoutProps) => {

    const Wrapper = Provider ?? (({ children }) => <>{children}</>);

    // Por ahora no filtramos nada, usamos todas las tabs
    const filteredTabs = tabs;


    //crear permisos
    /*     const filteredTabs = tabs.filter(
      (tab) => !tab.permission || hasPermission(tab.permission)
    );
     */

    return (
        <Wrapper>
            <div className={styles.moduleLayout}>
                <ModuleTitle text={title} />
                <ModuleNav tabs={filteredTabs} />
                <div className={styles.moduleLayout__content}>
                    <Outlet />
                </div>
            </div>
        </Wrapper>
    );
};
