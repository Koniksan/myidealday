import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { useStyles } from './page-layout-styles';
import { Header } from '../header';
import { HeaderActionsProvider } from '../../../infrastructure/context/header-actions-context';

interface Props {
    children: React.ReactNode;
    centered?: boolean;
}

export const PageLayout: React.FC<Props> = ({ children, centered = false }) => {
    const styles = useStyles();

    return (
        <HeaderActionsProvider>
            <div className={mergeClasses(styles.root, centered && styles.centered)}>
                <Header />
                {children}
            </div>
        </HeaderActionsProvider>
    );
}
