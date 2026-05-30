import { Button, Text, Tooltip } from "@fluentui/react-components";
import { DismissCircleRegular } from "@fluentui/react-icons";
import React from "react";
import { useLocalization } from "../../../infrastructure";
import { useImageUploadPreviewStyles } from "./image-upload-preview-styles";

interface ImageUploadPreviewProps {
    imagePreview: string;
    imageOriginalSize: number | null;
    imageCompressedSize: number | null;
    onRemove: () => void;
}

const formatBytes = (bytes: number) =>
    bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
        : `${Math.round(bytes / 1024)} KB`;

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
    imagePreview,
    imageOriginalSize,
    imageCompressedSize,
    onRemove,
}) => {
    const styles = useImageUploadPreviewStyles();
    const rs = useLocalization();

    return (
        <div className={styles.wrapper}>
            <div className={styles.imageWrapper}>
                <img src={imagePreview} className={styles.image} />
                <Tooltip content={rs.RemoveImage} relationship="label">
                    <Button
                        className={styles.removeButton}
                        appearance="subtle"
                        size="small"
                        icon={<DismissCircleRegular />}
                        onClick={onRemove}
                    />
                </Tooltip>
            </div>
            {imageOriginalSize != null && imageCompressedSize != null && (
                <Text className={styles.sizeInfo}>
                    {formatBytes(imageOriginalSize)} → {formatBytes(imageCompressedSize)}
                </Text>
            )}
        </div>
    );
};
