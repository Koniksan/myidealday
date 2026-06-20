import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Slider,
} from "@fluentui/react-components";
import Cropper from "react-easy-crop";
import React from "react";
import { useLocalization } from "../../../infrastructure";
import { useAvatarCropperStyles } from "./avatar-cropper-styles";
import { useAvatarCropper } from "./use-avatar-cropper";

interface AvatarCropperProps {
    imageSrc: string;
    onConfirm: (blob: Blob) => void;
    onClose: () => void;
}

export const AvatarCropper: React.FC<AvatarCropperProps> = ({ imageSrc, onConfirm, onClose }) => {
    const styles = useAvatarCropperStyles();
    const rs = useLocalization();
    const { crop, setCrop, zoom, setZoom, handleCropComplete, handleConfirm } = useAvatarCropper(imageSrc, onConfirm);

    return (
        <Dialog open onOpenChange={(_, d) => !d.open && onClose()}>
            <DialogSurface className={styles.surface}>
                <DialogBody>
                    <DialogTitle>{rs.CropPhoto}</DialogTitle>
                    <DialogContent className={styles.content}>
                        <div className={styles.cropContainer}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                            />
                        </div>
                        <Slider
                            className={styles.slider}
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(_, d) => setZoom(d.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onClose}>{rs.Cancel}</Button>
                        <Button appearance="primary" onClick={handleConfirm}>{rs.Apply}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
