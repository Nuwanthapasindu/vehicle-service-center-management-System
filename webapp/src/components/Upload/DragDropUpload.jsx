import React, { useRef, useState } from 'react';
import './DragDropUpload.css';

const DragDropUpload = ({
    onFileChange,
    previewUrl,
    accept = "image/png, image/jpeg, image/jpg, image/webp",
    hintText = "PNG, JPG or WEBP (Max 10 MB)",
    mainText = "Click to upload or drag and drop",
    iconClass = "fa-solid fa-camera-retro upload-icon"
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        handleFiles(files);
    };

    const handleChange = (e) => {
        const files = e.target.files;
        handleFiles(files);
    };

    const handleFiles = (files) => {
        if (files && files.length > 0) {
            const file = files[0];
            onFileChange(file);
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div
            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="file-input"
                hidden
                accept={accept}
                onChange={handleChange}
            />
            {previewUrl ? (
                <div style={{ textAlign: 'center' }}>
                    <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} />
                    <p className="upload-text" style={{ marginTop: '0.5rem' }}>Click or drag a new image to change</p>
                </div>
            ) : (
                <div className="dropzone-label">
                    <i className={iconClass}></i>
                    <p className="upload-text">{mainText}</p>
                    <p className="upload-hint">{hintText}</p>
                </div>
            )}
        </div>
    );
};

export default DragDropUpload;
