import React from 'react';
import { useStyles } from './page-layout-styles';
import { Header } from '../header';

interface Props {
    children: any;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <Header />
            {children}
        </div>
    )
}