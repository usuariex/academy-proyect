import type { FC } from 'react';
import styles from './Tabs.module.css';

export type TabKey = string;

export interface TabItem {
  key: TabKey;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: TabKey;
  onChange: (key: TabKey) => void;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}

export const Tabs: FC<TabsProps> = ({
  items,
  activeKey,
  onChange,
  className,
  itemClassName,
  activeItemClassName,
}) => {
  return (
    <div className={className ?? styles.tabs}>
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const base = itemClassName ?? styles.item;
        const active = activeItemClassName ?? styles.active;
        return (
          <span
            key={item.key}
            className={`${base} ${isActive ? active : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </span>
        );
      })}
    </div>
  );
};

export default Tabs;
