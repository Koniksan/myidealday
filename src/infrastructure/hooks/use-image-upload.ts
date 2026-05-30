import { useState } from "react";
import { compressImage } from "../storages";

export const useImageUpload = (maxImageSize: number) => {
    const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageOriginalSize, setImageOriginalSize] = useState<number | null>(null);
    const [imageCompressedSize, setImageCompressedSize] = useState<number | null>(null);

    const handleImageSelect = async (file: File) => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        const blob = await compressImage(file, maxImageSize);
        setCompressedBlob(blob);
        setImagePreview(URL.createObjectURL(blob));
        setImageOriginalSize(file.size);
        setImageCompressedSize(blob.size);
    };

    const handleRemoveImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setCompressedBlob(null);
        setImagePreview(null);
        setImageOriginalSize(null);
        setImageCompressedSize(null);
    };

    return {
        compressedBlob,
        imagePreview,
        imageOriginalSize,
        imageCompressedSize,
        handleImageSelect,
        handleRemoveImage,
    };
};
