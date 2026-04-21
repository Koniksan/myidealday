import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
} from "@fluentui/react-components";
import { ArrowSyncRegular } from "@fluentui/react-icons";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    open: boolean;
}

export const AppUpdateDialog: React.FC<Props> = ({ open }) => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate("/");
        window.location.reload();
    };

    return (
        <Dialog open={open} modalType="alert">
            <DialogSurface>
                <DialogBody>
                    <DialogTitle icon={<ArrowSyncRegular />}>App has been updated</DialogTitle>
                    <DialogContent>
                        A new version is available. Please reload to get the latest experience.
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" onClick={handleGoToLogin}>
                            Go to login
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
