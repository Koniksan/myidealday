import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { useStyles } from './page-layout-styles';
import { Header } from '../header';
import { BottomNav } from '../bottom-nav';
import { HeaderActionsProvider } from '../../../infrastructure/context/header-actions-context';

interface Props {
    children: React.ReactNode;
    centered?: boolean;
}

export const PageLayout: React.FC<Props> = ({ children, centered = false }) => {
    const styles = useStyles();

    return (
        <HeaderActionsProvider>
            <div className={styles.wrapper}>
                <div className={styles.root}>
                    <Header />
                    <div className={mergeClasses(styles.content, centered && styles.centered)}>
                        {children}
                    </div>
                    <BottomNav />
                </div>
            </div>
        </HeaderActionsProvider>
    );
}
