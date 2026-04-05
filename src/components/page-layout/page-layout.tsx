import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { useStyles } from './page-layout-styles';
import { Header } from '../header';

interface Props {
    children: React.ReactNode;
    centered?: boolean;
}

export const PageLayout: React.FC<Props> = ({ children, centered = false }) => {
    const styles = useStyles();

    return (
        <div className={mergeClasses(styles.root, centered && styles.centered)}>
            <Header />
            {children}
        </div>
    );
}
