import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
} from "@fluentui/react-components";
import React from "react";
import { useConfirmDialogStyles } from "./confirm-dialog-styles";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    cancelLabel: string;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    cancelLabel,
    confirmLabel,
    onCancel,
    onConfirm,
}) => {
    const styles = useConfirmDialogStyles();
    return (
        <Dialog open={open} onOpenChange={(_, d) => !d.open && onCancel()}>
            <DialogSurface className={styles.surface}>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>{message}</DialogContent>
                    <DialogActions className={styles.actions}>
                        <Button appearance="secondary" onClick={onCancel}>{cancelLabel}</Button>
                        <Button appearance="primary" onClick={onConfirm}>{confirmLabel}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
