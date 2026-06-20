import { useCallback, useState } from "react";
import { Area, Point } from "react-easy-crop";

const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<Blob> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            canvas.getContext("2d")!.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
            canvas.toBlob(x => x ? resolve(x) : reject(new Error("Crop failed")), "image/jpeg", 0.9);
        };
        img.onerror = reject;
        img.src = imageSrc;
    });

export const useAvatarCropper = (imageSrc: string, onConfirm: (blob: Blob) => void) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const handleCropComplete = useCallback((_: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
        onConfirm(blob);
    };

    return { crop, setCrop, zoom, setZoom, handleCropComplete, handleConfirm };
};
