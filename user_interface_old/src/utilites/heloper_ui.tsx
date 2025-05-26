// src/ImageUpload.tsx
import React, { useState, DragEvent } from 'react';

const ImageUpload: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);

    const handleImageChange = (files: FileList) => {
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
        setImages((prevImages) => prevImages.concat(newImages));
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            handleImageChange(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 w-full text-center cursor-pointer"
            >
                <p className="text-gray-500">Drag & drop your images here or click to select</p>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleImageChange(e.target.files)}
                    className="hidden"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <img src={image} alt={`preview ${index}`} className="w-full h-auto rounded" />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;